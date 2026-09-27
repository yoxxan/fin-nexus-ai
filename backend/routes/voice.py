"""
Fin-Nexus AI - Voice-First Multilingual UX Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.voice_service import voice_service
from ml.scoring_engine import scoring_engine

router = APIRouter(prefix="/api/voice", tags=["Voice-First UX"])

class VoiceTranscriptPayload(BaseModel):
    transcript: str
    auto_score: bool = True

@router.get("/presets")
def get_presets():
    return {
        "success": True,
        "presets": voice_service.get_presets()
    }

@router.post("/process-transcript")
def process_transcript(payload: VoiceTranscriptPayload):
    try:
        parsed_data = voice_service.parse_transcript_to_json(payload.transcript)
        
        # If auto_score is enabled, immediately run behavioral scoring on the extracted features
        scoring_result = None
        if payload.auto_score and "behavioral_features" in parsed_data:
            scoring_result = scoring_engine.score_applicant(parsed_data["behavioral_features"])
            scoring_result["applicant_name"] = parsed_data["applicant_name"]

        return {
            "success": True,
            "parsed_application": parsed_data,
            "credit_evaluation": scoring_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
