@echo off
setlocal
title Portfolio Server
cd /d "%~dp0"

echo ===================================================
echo   Memulai Development Server Portfolio
echo ===================================================

if not exist "node_modules" goto :install
goto :start_server

:install
echo [INFO] Folder node_modules belum ada.
echo [INFO] Sedang menginstal dependensi...
call npm install
if errorlevel 1 goto :error_install

:start_server
echo.
echo [INFO] Menjalankan server di http://localhost:5555
echo [INFO] Browser akan terbuka otomatis dalam 2 detik.
echo Tekan Ctrl+C di terminal ini untuk mematikan server.
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5555"

call npm run dev

if errorlevel 1 goto :error_server
goto :eof

:error_install
echo.
echo [ERROR] Gagal melakukan instalasi dependensi!
pause
exit /b 1

:error_server
echo.
echo [ERROR] Server berhenti dengan pesan kesalahan.
pause
exit /b 1
