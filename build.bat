@echo off
echo -----------------------------------
echo   React Native Android Build
echo -----------------------------------

set DIST=dist
set ANDROID=android
set APP=android\app

echo Deleting dist folder...
if exist %DIST% rmdir /S /Q %DIST%
mkdir %DIST%

echo Cleaning Gradle...
cd %ANDROID%
call gradlew clean

echo Building APK...
call gradlew assembleRelease

echo Building AAB...
call gradlew bundleRelease

cd ..

echo Copying output files...
copy "%APP%\build\outputs\apk\release\app-release.apk" "%DIST%\app-release.apk"
copy "%APP%\build\outputs\bundle\release\app-release.aab" "%DIST%\app-release.aab"

echo Build complete!
echo Files generated:
echo    dist\app-release.apk
echo    dist\app-release.aab
