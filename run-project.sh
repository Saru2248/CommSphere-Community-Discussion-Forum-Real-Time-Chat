#!/bin/bash
echo "======================================================================"
echo "          CommSphere - Community Discussion Forum & Real-Time Chat"
echo "======================================================================"
echo ""
echo "[1/3] Checking MongoDB..."
echo "Make sure your local MongoDB instance is running (default port 27017)."
echo ""
echo "[2/3] Launching Express Socket.IO Backend Server..."
cd server && npm run dev &
BACKEND_PID=$!
cd ..
sleep 3
echo "Backend server launched (PID: $BACKEND_PID)."
echo ""
echo "[3/3] Launching React Vite Frontend Client..."
cd client && npm run dev &
FRONTEND_PID=$!
cd ..
sleep 2
echo "Frontend client launched (PID: $FRONTEND_PID)."
echo ""
echo "======================================================================"
echo "Services started!"
echo "- Backend API: http://localhost:5000/api"
echo "- Socket server: http://localhost:5000"
echo "- Frontend Client: http://localhost:5173"
echo "======================================================================"
echo "Press Ctrl+C to stop all services."
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
