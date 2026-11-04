@echo off
title Space Junk Explorer - Servidor Local 3D
echo Iniciando o Space Junk Explorer em http://localhost:8080 ...
start "" "http://localhost:8080"
python -m http.server 8080
