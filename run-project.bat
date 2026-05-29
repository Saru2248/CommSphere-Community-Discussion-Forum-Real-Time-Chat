@echo off
title CommSphere Discussion Forum & Chat Launcher
echo ======================================================================
echo           CommSphere - Community Discussion Forum & Real-Time Chat
echo ======================================================================
echo.
echo [1/3] Checking MongoDB...
echo Make sure your local MongoDB instance is running (default port 27017).
echo.
echo [2/3] Launching Express Socket.IO Backend Server...
start cmd /k "cd server && title CommSphere Backend Server && npm run dev"
timeout /t 3 /nobreak >nul
echo Backend server launched in a separate window.
echo.
echo [3/3] Launching React Vite Frontend Client...
start cmd /k "cd client && title CommSphere Frontend Client && npm run dev"
timeout /t 2 /nobreak >nul
echo Frontend client launched in a separate window.
echo.
echo ======================================================================
echo Services started!
echo - Backend API: http://localhost:5000/api
echo - Socket server: http://localhost:5000
echo - Frontend Client: http://localhost:5173
echo ======================================================================
echo Press any key to exit this launcher (services will keep running).
pause >nul
