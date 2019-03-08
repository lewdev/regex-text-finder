@echo off

ECHO ========================================================================
ECHO  html-minifier
ECHO ========================================================================
REM :: npm install html-minifier -g
html-minifier ^
--collapse-whitespace ^
--remove-comments ^
--remove-tag-whitespace ^
--use-short-doctype ^
-o ./public/index.html ./src/index.html

PAUSE;
EXIT;