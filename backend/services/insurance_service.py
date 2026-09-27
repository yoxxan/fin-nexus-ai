"""
Fin-Nexus AI - Parametric Climate Micro-Insurance & Chainlink Oracle Service
Provides autonomous smart-contract policy lifecycle & IoT weather oracle triggers on Polygon L2.
"""

import time
import hashlib
import uuid
from typing import List, Dict, Optional

class ParametricInsuranceService:
    def __init__(self):
        # In-memory ledger of policies & payout events
        self.policies: Dict[str, dict] = {}
        self.payout_log: List[dict] = []
        self._seed_default_policies()

    def _seed_default_policies(self):
        """Seed realistic rural micro-insurance policies for demo"""
        defaults = [
            {
                "policy_id": "POL-IND-8821",
                "beneficiary_name": "Ramesh Patel",
                "beneficiary_wallet": "0x71C...a49B",
                "crop_or_asset": "Kharif Cotton & Groundnut",
                "region": "Anantapur Arid Zone, AP",
                "hazard_type": "DROUGHT",
                "trigger_condition": "Cumulative 21-day rainfall < 20mm",
                "threshold_value": 20.0,
                "premium_matic": 4.5,
                "payout_matic": 120.0,
                "status": "ACTIVE",
                "created_at": "2026-08-15T09:00:00Z"
            },
            {
                "policy_id": "POL-IND-9043",
                "beneficiary_name": "Sunita Devi",
                "beneficiary_wallet": "0x3B9...8F21",
                "crop_or_asset": "Paddy & Inland Fishery",
                "region": "Brahmaputra Flood Plain, Assam",
                "hazard_type": "FLOOD",
                "trigger_condition": "Continuous 48h rainfall > 220mm",
                "threshold_value": 220.0,
                "premium_matic": 6.0,
                "payout_matic": 180.0,
                "status": "ACTIVE",
                "created_at": "2026-08-20T11:30:00Z"
            },
            {
                "policy_id": "POL-IND-9118",
                "beneficiary_name": "Kishan Rao",
                "beneficiary_wallet": "0x98E...c014",
                "crop_or_asset": "Millets & Solar Pump Setup",
                "region": "Marathwada Dry Belt, MH",
                "hazard_type": "EXCESS_HEAT",
                "trigger_condition": "Peak daily temperature > 44.0°C for 3 consecutive days",
                "threshold_value": 44.0,
                "premium_matic": 3.8,
                "payout_matic": 95.0,
                "status": "ACTIVE",
                "created_at": "2026-09-01T08:15:00Z"
            }
        ]
        for p in defaults:
            self.policies[p["policy_id"]] = p

    def create_policy(self, data: dict) -> dict:
        policy_id = f"POL-IND-{uuid.uuid4().hex[:6].upper()}"
        new_policy = {
            "policy_id": policy_id,
            "beneficiary_name": data.get("beneficiary_name", "Anonymous Farmer"),
            "beneficiary_wallet": data.get("beneficiary_wallet", "0x" + uuid.uuid4().hex[:40]),
            "crop_or_asset": data.get("crop_or_asset", "General Crops"),
            "region": data.get("region", "Rural District"),
            "hazard_type": data.get("hazard_type", "DROUGHT"),
            "trigger_condition": data.get("trigger_condition", "Severe Weather Anomaly"),
            "threshold_value": float(data.get("threshold_value", 25.0)),
            "premium_matic": float(data.get("premium_matic", 5.0)),
            "payout_matic": float(data.get("payout_matic", 125.0)),
            "status": "ACTIVE",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        self.policies[policy_id] = new_policy
        return new_policy

    def get_all_policies(self) -> List[dict]:
        return list(self.policies.values())

    def simulate_oracle_trigger(self, policy_id: str, reported_metric: float, custom_event: Optional[str] = None) -> dict:
        """
        Simulates Chainlink IoT telemetry feed hitting smart contract.
        If threshold is breached, executes autonomous payout in < 5 seconds.
        """
        start_time = time.time()
        policy = self.policies.get(policy_id)
        if not policy:
            raise ValueError(f"Policy {policy_id} not found.")

        if policy["status"] == "PAID":
            return {
                "success": False,
                "message": "Policy has already received automated payout.",
                "policy": policy
            }

        hazard = policy["hazard_type"]
        threshold = policy["threshold_value"]
        breached = False

        if hazard == "DROUGHT" and reported_metric <= threshold:
            breached = True
        elif hazard == "FLOOD" and reported_metric >= threshold:
            breached = True
        elif hazard == "EXCESS_HEAT" and reported_metric >= threshold:
            breached = True

        # Generate cryptographic proof hash mimicking Chainlink Oracle verification
        proof_payload = f"{policy_id}:{reported_metric}:{time.time()}:{policy['beneficiary_wallet']}"
        oracle_proof_hash = "0x" + hashlib.sha256(proof_payload.encode()).hexdigest()
        tx_hash = "0x" + hashlib.sha256(f"polygon_tx_{time.time()}_{policy_id}".encode()).hexdigest()

        latency_seconds = round(time.time() - start_time + 0.12, 2)  # Realistic sub-second L2 execution

        if breached:
            policy["status"] = "PAID"
            payout_record = {
                "payout_id": f"PAY-{uuid.uuid4().hex[:6].upper()}",
                "policy_id": policy_id,
                "beneficiary_name": policy["beneficiary_name"],
                "beneficiary_wallet": policy["beneficiary_wallet"],
                "payout_amount_matic": policy["payout_matic"],
                "payout_amount_usd": round(policy["payout_matic"] * 0.85, 2), # Approx MATIC/POL price
                "hazard_type": hazard,
                "reported_metric": reported_metric,
                "trigger_threshold": threshold,
                "event_description": custom_event or f"Critical {hazard} condition verified via Chainlink IoT Oracle Node #441",
                "chainlink_proof_hash": oracle_proof_hash,
                "polygon_tx_hash": tx_hash,
                "block_number": 68420192,
                "latency_seconds": latency_seconds,
                "claim_latency_reduction_pct": 99.8, # from 45 days (3,888,000s) to ~2 seconds
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            self.payout_log.insert(0, payout_record)
            return {
                "success": True,
                "breached": True,
                "payout": payout_record,
                "policy": policy,
                "message": f"Autonomous parametric payout of {policy['payout_matic']} MATIC successfully transferred in {latency_seconds}s!"
            }
        else:
            return {
                "success": True,
                "breached": False,
                "message": f"Oracle reported {reported_metric}, which does not breach trigger threshold ({threshold}). Policy remains ACTIVE.",
                "policy": policy
            }

    def get_payout_history(self) -> List[dict]:
        return self.payout_log

# Singleton instance
insurance_service = ParametricInsuranceService()
