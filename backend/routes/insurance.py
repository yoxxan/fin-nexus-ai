"""
Fin-Nexus AI - Parametric Insurance & Chainlink Oracle Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from services.insurance_service import insurance_service

router = APIRouter(prefix="/api/insurance", tags=["Parametric Insurance"])

class CreatePolicyRequest(BaseModel):
    beneficiary_name: str
    beneficiary_wallet: Optional[str] = None
    crop_or_asset: str
    region: str
    hazard_type: str = "DROUGHT" # DROUGHT, FLOOD, EXCESS_HEAT
    trigger_condition: str
    threshold_value: float
    premium_matic: float = 5.0
    payout_matic: float = 120.0

class OracleTriggerRequest(BaseModel):
    policy_id: str
    reported_metric: float
    custom_event: Optional[str] = None

@router.get("/policies")
def list_policies():
    return {
        "success": True,
        "policies": insurance_service.get_all_policies()
    }

@router.post("/policy/create")
def create_policy(payload: CreatePolicyRequest):
    try:
        new_pol = insurance_service.create_policy(payload.model_dump())
        return {
            "success": True,
            "data": new_pol
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/oracle/trigger")
def trigger_oracle(payload: OracleTriggerRequest):
    try:
        result = insurance_service.simulate_oracle_trigger(
            policy_id=payload.policy_id,
            reported_metric=payload.reported_metric,
            custom_event=payload.custom_event
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts")
def list_payouts():
    return {
        "success": True,
        "payouts": insurance_service.get_payout_history()
    }
