# QuickLib

QucikLib client application built with React Native and Expo. 

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Buil apk file

   ```bash
   npx expo prebuild
   ./android/gradlew :app:assembleRelease
   ```

3. Install to device

   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```