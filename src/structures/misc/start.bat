@echo off
title launch gengar

if exist ..\..\node_modules\ (
@echo off
echo Please wait...
npm run dev
pause
  
) else (
  call npm i >> NUL
  echo Alle wichtigen Sachen wurden erfolgreich installiert!
@echo off
echo Please wait...
npm run dev
color 1
echo   ________                                   
echo  /  _____/  ____   ____    _________ _______ 
echo /   \  ____/ __ \ /    \  / ___\__  \\_  __ \
echo \    \_\  \  ___/|   |  \/ /_/  > __ \|  | \/
echo \______  /\___  >___|  /\___  (____  /__|   
echo        \/     \/     \//_____/     \/       
pause
)