@echo off
REM Navigate to the client folder and start the Vite React app
cd client
start cmd /k "npm run dev"

REM Navigate to the server folder and start the Node server
cd ..
cd server
start cmd /k "node app.js"

REM Open the Vite React app in the default web browser
timeout /t 5
start http://localhost:5173/
