@echo off
rem -------------------------------------------------
rem Build a standalone Windows executable for Shawl Art Labeler
rem -------------------------------------------------

rem Ensure we are in the project folder
cd /d "%~dp0"

rem (optional) create a virtual environment for a clean build
python -m venv .venv
call .venv\Scripts\activate.bat

rem Install required packages (including openpyxl)
pip install -r requirements.txt pyinstaller

rem Build the executable using the spec file
pyinstaller Shawl_Art_Labeler.spec

rem Deactivate virtual environment
deactivate

echo -------------------------------------------------
echo Build complete! Executable is at:
echo   %~dp0dist\Shawl_Art_Labeler.exe
echo -------------------------------------------------
pause
