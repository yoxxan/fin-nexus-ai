"""
Fin-Nexus AI - Backend Gateway
Architecting Financial Inclusion through Decentralized AI Scoring & Parametric Insurance
Tech Horizon 2.0 - Team CodeCommit
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import credit, insurance, voice

app = FastAPI(
    title="Fin-Nexus AI Gateway",
    description="Decentralized Behavioral Credit Scoring, Chainlink Weather Parametric Insurance & Voice-First UX API",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(credit.router)
app.include_router(insurance.router)
app.include_router(voice.router)

@app.get("/")
def root():
    return {
        "project": "Fin-Nexus AI",
        "tagline": "Current financial systems are built on history — We build on BEHAVIOR.",
        "hackathon": "Tech Horizon 2.0 (Fintech Track / Open Innovation)",
        "team": "CodeCommit",
        "status": "OPERATIONAL",
        "endpoints": [
            "/api/credit/score",
            "/api/credit/personas",
            "/api/insurance/policies",
            "/api/insurance/oracle/trigger",
            "/api/voice/presets",
            "/api/voice/process-transcript"
        ]
    }

@app.get("/api/system/metrics")
def get_global_metrics():
    """
    Key impact and comparative edge metrics directly aligned with the pitch presentation.
    """
    return {
        "unbanked_population_target": "1.7 Billion Adults",
        "global_gdp_opportunity": "$3.7 Trillion",
        "claim_latency_traditional": "45–60 Days",
        "claim_latency_fin_nexus": "< 5 Seconds",
        "latency_reduction_percentage": "98.9%",
        "collateral_requirement": "None (Behavioral Proxy)",
        "privacy_model": "Zero-Knowledge Edge Processing",
        "l2_network": "Polygon PoS / Amoy",
        "oracle_network": "Chainlink Decentralized IoT Feeds"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
