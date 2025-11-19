@echo off
REM 微信小程序自动编译脚本
REM 需要先在微信开发者工具中开启"命令行调用"功能

echo ========================================
echo 微信小程序自动编译脚本
echo ========================================
echo.

REM 微信开发者工具 CLI 路径（需要根据实际安装路径修改）
set CLI_PATH="C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"

REM 项目路径
set PROJECT_PATH=%~dp0..\miniprogram

echo 正在编译项目...
echo 项目路径: %PROJECT_PATH%
echo.

REM 打开项目
%CLI_PATH% open --project %PROJECT_PATH%

REM 编译项目
%CLI_PATH% build-npm --project %PROJECT_PATH%

REM 预览项目（生成二维码）
REM %CLI_PATH% preview --project %PROJECT_PATH%

echo.
echo ========================================
echo 编译完成！
echo ========================================
pause
