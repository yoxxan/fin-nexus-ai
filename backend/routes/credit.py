"""
Fin-Nexus AI - Alternative Credit Scoring API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from ml.scoring_engine import scoring_engine

router = APIRouter(prefix="/api/credit", tags=["Behavioral Credit Risk"])

class CreditEvaluationRequest(BaseModel):
    applicant_name: Optional[str] = "Anonymous Applicant"
    recharge_frequency_per_month: float = Field(default=6.0, ge=0.5, le=30.0)
    avg_recharge_amount_usd: float = Field(default=5.0, ge=0.5, le=100.0)
    recharge_regularity_index: float = Field(default=0.75, ge=0.0, le=1.0)
    utility_bill_ontime_ratio: float = Field(default=0.85, ge=0.0, le=1.0)
    mobile_wallet_in_out_ratio: float = Field(default=1.15, ge=0.1, le=5.0)
    sim_card_tenure_months: float = Field(default=24.0, ge=1.0, le=120.0)
    emergency_airtime_loan_cleared_pct: float = Field(default=0.90, ge=0.0, le=1.0)
    nighttime_activity_ratio: float = Field(default=0.15, ge=0.0, le=1.0)

@router.post("/score")
def evaluate_credit(payload: CreditEvaluationRequest):
    try:
        features = payload.model_dump()
        result = scoring_engine.score_applicant(features)
        result["applicant_name"] = payload.applicant_name
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personas")
def get_sample_personas():
    """
    Returns pre-configured personas for instant judge testing during live hackathon demos.
    """
    return {
        "success": True,
        "personas": [
            {
                "id": "persona_high_prime",
                "name": "Lakshmi Narayanan",
                "role": "Organic Chili Farmer (Khammam)",
                "summary": "100% on-time electricity payments, weekly routine top-ups, 6-year SIM tenure.",
                "data": {
                    "applicant_name": "Lakshmi Narayanan",
                    "recharge_frequency_per_month": 4.0,
                    "avg_recharge_amount_usd": 6.5,
                    "recharge_regularity_index": 0.95,
                    "utility_bill_ontime_ratio": 0.98,
                    "mobile_wallet_in_out_ratio": 1.35,
                    "sim_card_tenure_months": 72.0,
                    "emergency_airtime_loan_cleared_pct": 1.0,
                    "nighttime_activity_ratio": 0.06
                }
            },
            {
                "id": "persona_medium_vendor",
                "name": "Babu Khan",
                "role": "Street Food Cart Owner (Hyderabad)",
                "summary": "High daily QR velocity, occasional delayed utility, 3-year SIM tenure.",
                "data": {
                    "applicant_name": "Babu Khan",
                    "recharge_frequency_per_month": 8.0,
                    "avg_recharge_amount_usd": 3.0,
                    "recharge_regularity_index": 0.82,
                    "utility_bill_ontime_ratio": 0.80,
                    "mobile_wallet_in_out_ratio": 1.10,
                    "sim_card_tenure_months": 36.0,
                    "emergency_airtime_loan_cleared_pct": 0.90,
                    "nighttime_activity_ratio": 0.22
                }
            },
            {
                "id": "persona_builder_risk",
                "name": "Suraj Verma",
                "role": "Gig Delivery Worker (New SIM)",
                "summary": "New 3-month SIM, erratic recharge history, late utility payments.",
                "data": {
                    "applicant_name": "Suraj Verma",
                    "recharge_frequency_per_month": 2.0,
                    "avg_recharge_amount_usd": 2.0,
                    "recharge_regularity_index": 0.35,
                    "utility_bill_ontime_ratio": 0.40,
                    "mobile_wallet_in_out_ratio": 0.75,
                    "sim_card_tenure_months": 3.0,
                    "emergency_airtime_loan_cleared_pct": 0.50,
                    "nighttime_activity_ratio": 0.45
                }
            }
        ]
    }
