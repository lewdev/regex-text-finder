@echo off
ECHO ========================================================================
ECHO  JavaScript Closure Compiler
ECHO ========================================================================
REM :: https://developers.google.com/closure/compiler/
java -jar ./closure-compiler-v20190301.jar ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--js ./src/script.js ^
--js_output_file ./public/script.js

PAUSE;
EXIT;