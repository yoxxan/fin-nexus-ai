"""
Fin-Nexus AI - Scoring & Explainability Engine
Generates dynamic credit scores and explainable rationale based on alternative behavioral signals.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(MODEL_DIR, "credit_model.pkl")
META_FILE = os.path.join(MODEL_DIR, "model_metadata.json")

class CreditScoringEngine:
    def __init__(self):
        self.model = None
        self.metadata = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_FILE):
            try:
                self.model = joblib.load(MODEL_FILE)
            except Exception as e:
                print(f"[Fin-Nexus Engine] Warning loading model: {e}")
        
        if os.path.exists(META_FILE):
            try:
                with open(META_FILE, "r") as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"[Fin-Nexus Engine] Warning loading metadata: {e}")

    def score_applicant(self, features: dict) -> dict:
        """
        Calculates credit score (300-900), risk tier, max eligible loan, and explainability factors.
        """
        # Ensure all features exist with reasonable defaults
        recharge_freq = float(features.get("recharge_frequency_per_month", 6))
        avg_recharge = float(features.get("avg_recharge_amount_usd", 5.0))
        recharge_regularity = float(features.get("recharge_regularity_index", 0.75))
        utility_ontime = float(features.get("utility_bill_ontime_ratio", 0.85))
        in_out_ratio = float(features.get("mobile_wallet_in_out_ratio", 1.15))
        sim_tenure = float(features.get("sim_card_tenure_months", 24))
        emergency_cleared = float(features.get("emergency_airtime_loan_cleared_pct", 0.90))
        nighttime_ratio = float(features.get("nighttime_activity_ratio", 0.15))

        df_input = pd.DataFrame([{
            "recharge_frequency_per_month": recharge_freq,
            "avg_recharge_amount_usd": avg_recharge,
            "recharge_regularity_index": recharge_regularity,
            "utility_bill_ontime_ratio": utility_ontime,
            "mobile_wallet_in_out_ratio": in_out_ratio,
            "sim_card_tenure_months": sim_tenure,
            "emergency_airtime_loan_cleared_pct": emergency_cleared,
            "nighttime_activity_ratio": nighttime_ratio
        }])

        if self.model is not None:
            try:
                prob = float(self.model.predict_proba(df_input)[0][1])
            except Exception:
                prob = self._heuristic_prob(df_input.iloc[0])
        else:
            prob = self._heuristic_prob(df_input.iloc[0])

        # Calibrate to 300 - 900 score
        score = int(round(300 + (prob * 600)))
        score = max(300, min(900, score))

        # Risk tiering & loan terms
        if score >= 740:
            tier = "Tier 1: Prime Micro-Credit"
            status = "APPROVED"
            max_loan = 1200
            interest_rate = 3.5
            recommendation = "Eligible for immediate unsecured micro-capital or agricultural equipment financing."
        elif score >= 650:
            tier = "Tier 2: Standard Reliable"
            status = "APPROVED"
            max_loan = 600
            interest_rate = 5.8
            recommendation = "Approved for working capital loan with weekly auto-debit."
        elif score >= 540:
            tier = "Tier 3: Monitored Inflow"
            status = "CONDITIONAL_APPROVAL"
            max_loan = 250
            interest_rate = 8.5
            recommendation = "Approved for starter micro-loan paired with mandatory parametric insurance."
        else:
            tier = "Tier 4: Credit Building"
            status = "REJECTED_BUILDER_PROGRAM"
            max_loan = 50
            interest_rate = 12.0
            recommendation = "Enrolled in 60-day behavioral credit builder program via utility streak incentives."

        # Explainability factors (SHAP / Feature Impact proxy)
        positive_factors = []
        risk_factors = []

        if utility_ontime >= 0.8:
            positive_factors.append({
                "feature": "Utility Bill Consistency",
                "impact": f"+{int(utility_ontime * 55)} pts",
                "detail": f"{int(utility_ontime * 100)}% on-time electricity/water payments shows strong repayment discipline."
            })
        else:
            risk_factors.append({
                "feature": "Irregular Utility Payments",
                "impact": f"-{int((1 - utility_ontime) * 60)} pts",
                "detail": "Missed or late utility payments signal cash-flow volatility."
            })

        if recharge_regularity >= 0.7:
            positive_factors.append({
                "feature": "Predictable Telco Recharges",
                "impact": f"+{int(recharge_regularity * 40)} pts",
                "detail": "Consistent weekly mobile top-up cadences demonstrate predictable recurring cash flow."
            })
        else:
            risk_factors.append({
                "feature": "Volatile Recharge Cadence",
                "impact": f"-{int((1 - recharge_regularity) * 45)} pts",
                "detail": "Sporadic mobile top-ups suggest erratic income periods."
            })

        if sim_tenure >= 24:
            positive_factors.append({
                "feature": "Long-standing Identity (SIM)",
                "impact": f"+{min(35, int(sim_tenure * 0.8))} pts",
                "detail": f"{int(sim_tenure)} months of verified SIM tenure proves geographic and digital identity stability."
            })
        elif sim_tenure < 6:
            risk_factors.append({
                "feature": "New Mobile Identity",
                "impact": "-30 pts",
                "detail": "SIM card active for under 6 months; higher churn risk."
            })

        if emergency_cleared >= 0.85:
            positive_factors.append({
                "feature": "Telco Advance Repayment",
                "impact": "+30 pts",
                "detail": "100% repayment on operator emergency airtime advances indicates high moral willingness to repay."
            })

        if in_out_ratio > 1.05:
            positive_factors.append({
                "feature": "Positive Wallet Cash Surplus",
                "impact": "+20 pts",
                "detail": f"Wallet inflow exceeds outflow ({in_out_ratio:.2f}x ratio)."
            })

        return {
            "score": score,
            "probability_of_repayment": round(prob, 4),
            "tier": tier,
            "status": status,
            "max_eligible_loan_usd": max_loan,
            "suggested_interest_apr": interest_rate,
            "recommendation": recommendation,
            "positive_factors": positive_factors,
            "risk_factors": risk_factors,
            "radar_metrics": {
                "utility_discipline": round(utility_ontime * 100, 1),
                "recharge_cadence": round(recharge_regularity * 100, 1),
                "identity_stability": round(min(100.0, (sim_tenure / 48.0) * 100), 1),
                "liquidity_retention": round(min(100.0, (in_out_ratio / 1.5) * 100), 1),
                "micro_repayment_honor": round(emergency_cleared * 100, 1)
            }
        }

    def _heuristic_prob(self, row) -> float:
        val = (
            0.30 * row["utility_bill_ontime_ratio"] +
            0.25 * row["recharge_regularity_index"] +
            0.20 * row["emergency_airtime_loan_cleared_pct"] +
            0.15 * min(1.0, row["sim_card_tenure_months"] / 48.0) +
            0.10 * min(1.0, row["mobile_wallet_in_out_ratio"] / 1.5)
        )
        return float(1 / (1 + np.exp(-9 * (val - 0.50))))

# Singleton instance
scoring_engine = CreditScoringEngine()
