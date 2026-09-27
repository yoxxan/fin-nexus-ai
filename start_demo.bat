@echo off
title FIN-NEXUS AI - Hackathon Demo Launcher
echo ============================================================
echo   FIN-NEXUS AI - TECH HORIZON 2.0 HACKATHON DEMO LAUNCHER
echo   Empowering the next billion through AI & Trust
echo ============================================================
echo.

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "Fin-Nexus Backend" cmd /k "cd backend && .venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on port 5173...
start "Fin-Nexus Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
echo Opening Fin-Nexus AI in browser...
start http://localhost:5173

echo.
echo ============================================================
echo   DEMO READY!
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000/docs
echo ============================================================
