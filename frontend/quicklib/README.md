# QuickLib

QucikLib client application built with React Native and Expo. 

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Prebuild android files

   ```bash
   npx expo prebuild
   ```

3. Buil apk file

   ```bash
   cd android 
   ./gradlew :app:assembleRelease
   ```

4. Install to device

   ```bash
   cd app/build/outputs/release
   adb install app-release.apk
   ```