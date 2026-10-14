@echo off
echo Starting SocialConnect App...
echo.
echo Starting Backend Server...
start cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend...
start cmd /k "cd /d %~dp0frontend && npx expo@49 start --tunnel --port 19002"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:19002
echo.
echo Please wait a few seconds, then open http://localhost:19002 in your browser
echo Scan the QR Code with Expo Go on your phone
echo.
pause
