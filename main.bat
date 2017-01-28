:load
@echo off & setlocal enabledelayedexpansion & mode con:cols=60 lines=20

:var
set appname=clib
set version=0.1
set app=%appdata%\mellow\%appname%
if not exist %app% mkdir %app%
set cache=%app%\cache.txt
set config=%app%\config.txt
set cb=%app%\cb.txt

echo version=%version% > %cache%
echo workspace=%cd% >> %cache%

if not exist %config% (
    echo ### Clib Config ### > %config%
    echo. >> %config%
    echo program=null>>%config%
    echo password=null>>%config%
    echo encrypt=false>>%config%
)

for /f "tokens=2 delims==" %%a in ('find "version" ^<%cache%') do set version_old=%%a
for /f "tokens=2 delims==" %%a in ('find "workspace" ^<%cache%') do set workspace=%%a

for /f "tokens=2 delims==" %%a in ('find "program" ^<%config%') do set s_program=%%a
for /f "tokens=2 delims==" %%a in ('find "password" ^<%config%') do set s_password=%%a
for /f "tokens=2 delims==" %%a in ('find "encrypt" ^<%config%') do set s_encrypt=%%a

if not %version_old% == %version% (
    msg * "Clib has been updated. Settings have been reset and unnecessary files were removed."
    del %config%
    goto var
)

if not %errorlevel% == 0 goto err

:ini
title %appname% v%version%
color 3b
cd %workspace%

:main
cls
echo.
echo %appname% * Password shit
echo.
echo ____________________________________________________________
echo.
echo 1. Launch program with password ready to paste
echo.
echo 2. Set default program
echo 3. Set default password
echo.
echo 4. Reset defaults
echo.
set /p main=Option #: 
if %main% == 1 goto launch
if %main% == 2 goto setProgram
if %main% == 3 goto setPassword
if %main% == 4 goto resetConfig
if %main% == * goto quit
goto main

:launch
cls
echo|set/p=%s_password%|clip
start "" %s_program%
echo.
echo Password has been copied for 30 seconds and %appname% will
echo close automatically when time is up.
echo.
timeout /T 30
echo|set/p=|clip
goto quit

:setProgram
cls
echo.
echo %appname% * Password shit
echo.
echo ____________________________________________________________
echo.
echo Enter the program path or select one from the list below
echo.
echo 1. LoL (C:\Riot Games\League of Legends\LeagueClient.exe)
echo.
set /p setProgram=Program path: 
if %setProgram% == 0 goto main
if %setProgram% == 1 (
    echo ### Clib Config ### > %config%
    echo. >> %config%
    echo program="C:\Riot Games\League of Legends\LeagueClient.exe">>%config%
    echo password=%s_password%>>%config%
    echo encrypt=%s_encrypt%>>%config%
    goto var
)
echo ### Clib Config ###>%config%
echo. >> %config%
echo program="%setProgram%">>%config%
echo password=%s_password%>>%config%
echo encrypt=%s_encrypt%>>%config%
goto var

:setPassword
cls
echo.
echo %appname% * Password shit
echo.
echo ____________________________________________________________
echo.
set /p setPassword=Password: 
if %setPassword% == 0 goto main
echo ### Clib Config ###>%config%
echo. >> %config%
echo program=%s_program%>>%config%
echo password=%setPassword%>>%config%
echo encrypt=%s_encrypt%>>%config%
goto var

:resetConfig
cls
del %config%
goto load

:err
echo.
echo ### an error has occured ###
echo.
verify >nul
pause
goto var

:quit
exit