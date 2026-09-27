// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FinNexusParametricInsurance
 * @dev Autonomous parametric micro-insurance for rural farmers & unbanked micro-entrepreneurs.
 *      Integrates with Chainlink Oracles to disburse payouts in under 5 minutes upon extreme climate triggers.
 *      Designed for Polygon L2 / Ethereum Sepolia.
 */
contract FinNexusParametricInsurance {
    address public immutable owner;

    enum HazardType { DROUGHT, FLOOD, EXCESS_HEAT }
    enum PolicyStatus { ACTIVE, TRIGGERED, PAID, EXPIRED }

    struct Policy {
        uint256 id;
        address payable beneficiary;
        string region;
        HazardType hazard;
        uint256 triggerThreshold; // e.g. rainfall < 15mm (drought) or > 250mm (flood), temp > 45C
        uint256 premiumAmount;
        uint256 payoutAmount;
        uint256 timestamp;
        PolicyStatus status;
        uint256 payoutTimestamp;
        bytes32 oracleVerificationHash;
    }

    uint256 private nextPolicyId = 1;
    mapping(uint256 => Policy) public policies;
    uint256[] public policyIds;

    // Authorized Chainlink Oracle / Relayer addresses
    mapping(address => bool) public authorizedOracles;

    // Pool Liquidity
    uint256 public totalPoolLiquidity;

    event PolicyCreated(
        uint256 indexed policyId,
        address indexed beneficiary,
        string region,
        HazardType hazard,
        uint256 payoutAmount
    );

    event OracleTelemetryReceived(
        string region,
        uint256 recordedMetric,
        bytes32 verificationHash
    );

    event PayoutExecuted(
        uint256 indexed policyId,
        address indexed beneficiary,
        uint256 amountPaid,
        uint256 timestamp,
        bytes32 verificationHash
    );

    event LiquidityAdded(address indexed provider, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "FinNexus: Only contract owner");
        _;
    }

    modifier onlyOracle() {
        require(
            authorizedOracles[msg.sender] || msg.sender == owner,
            "FinNexus: Unauthorized oracle caller"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedOracles[msg.sender] = true;
    }

    /**
     * @notice Deposit funds into the micro-liquidity reserve pool
     */
    function addLiquidity() external payable {
        require(msg.value > 0, "FinNexus: Must send ETH/MATIC");
        totalPoolLiquidity += msg.value;
        emit LiquidityAdded(msg.sender, msg.value);
    }

    /**
     * @notice Authorize a Chainlink node or decentralized oracle relay
     */
    function setOracleAuthorization(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
    }

    /**
     * @notice Underwrite a new parametric micro-insurance policy
     */
    function createPolicy(
        address payable _beneficiary,
        string memory _region,
        HazardType _hazard,
        uint256 _triggerThreshold,
        uint256 _payoutAmount
    ) external payable returns (uint256) {
        require(msg.value > 0, "FinNexus: Premium required");
        require(_beneficiary != address(0), "FinNexus: Invalid beneficiary");
        require(address(this).balance >= _payoutAmount, "FinNexus: Pool undercapitalized for coverage");

        uint256 policyId = nextPolicyId++;
        policies[policyId] = Policy({
            id: policyId,
            beneficiary: _beneficiary,
            region: _region,
            hazard: _hazard,
            triggerThreshold: _triggerThreshold,
            premiumAmount: msg.value,
            payoutAmount: _payoutAmount,
            timestamp: block.timestamp,
            status: PolicyStatus.ACTIVE,
            payoutTimestamp: 0,
            oracleVerificationHash: bytes32(0)
        });

        policyIds.push(policyId);
        totalPoolLiquidity += msg.value;

        emit PolicyCreated(policyId, _beneficiary, _region, _hazard, _payoutAmount);
        return policyId;
    }

    /**
     * @notice Called automatically by Chainlink IoT weather oracle when a disaster threshold is breached
     * @param _policyId Target policy ID
     * @param _recordedMetric IoT telemetry reading (e.g. 8mm rainfall in drought zone, or 280mm flood)
     * @param _proofHash Chainlink oracle cryptographic proof hash
     */
    function triggerOraclePayout(
        uint256 _policyId,
        uint256 _recordedMetric,
        bytes32 _proofHash
    ) external onlyOracle {
        Policy storage policy = policies[_policyId];
        require(policy.status == PolicyStatus.ACTIVE, "FinNexus: Policy not active");

        bool shouldPayout = false;

        if (policy.hazard == HazardType.DROUGHT) {
            // Drought: rainfall fell below minimal threshold
            if (_recordedMetric <= policy.triggerThreshold) {
                shouldPayout = true;
            }
        } else if (policy.hazard == HazardType.FLOOD) {
            // Flood: rainfall exceeded danger threshold
            if (_recordedMetric >= policy.triggerThreshold) {
                shouldPayout = true;
            }
        } else if (policy.hazard == HazardType.EXCESS_HEAT) {
            // Heatwave: temperature exceeded threshold in degrees C
            if (_recordedMetric >= policy.triggerThreshold) {
                shouldPayout = true;
            }
        }

        require(shouldPayout, "FinNexus: Climate threshold not breached");
        require(address(this).balance >= policy.payoutAmount, "FinNexus: Insufficient liquidity in vault");

        policy.status = PolicyStatus.PAID;
        policy.payoutTimestamp = block.timestamp;
        policy.oracleVerificationHash = _proofHash;
        totalPoolLiquidity -= policy.payoutAmount;

        emit OracleTelemetryReceived(policy.region, _recordedMetric, _proofHash);
        emit PayoutExecuted(
            _policyId,
            policy.beneficiary,
            policy.payoutAmount,
            block.timestamp,
            _proofHash
        );

        // Immediate direct transfer to rural farmer / beneficiary
        (bool success, ) = policy.beneficiary.call{value: policy.payoutAmount}("");
        require(success, "FinNexus: Payout transfer failed");
    }

    /**
     * @notice Read-only helper to fetch total policies
     */
    function getTotalPolicies() external view returns (uint256) {
        return policyIds.length;
    }

    /**
     * @notice Contract balance
     */
    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        totalPoolLiquidity += msg.value;
    }
}
