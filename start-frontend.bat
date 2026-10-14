@echo off
echo Starting Frontend...
cd /d "%~dp0frontend"
npx expo@49 start --tunnel --port 19002
pause
