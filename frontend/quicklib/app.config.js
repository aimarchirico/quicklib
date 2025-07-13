import { writeFileSync } from 'fs';

// Create google-services.json from environment variable if it exists
if (process.env.GOOGLE_SERVICES_JSON_BASE64) {
  try {
    const content = Buffer.from(process.env.GOOGLE_SERVICES_JSON_BASE64, 'base64').toString('utf-8');
    writeFileSync('./google-services.json', content);
  } catch (error) {
    console.warn('Failed to create google-services.json:', error);
  }
}

export default {
  expo: {
    name: "QuickLib",
    slug: "quicklib",
    version: "1.0.10",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "quicklib",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "no.chirico.quicklib",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/adaptive-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#151718"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "e38c6fc6-6543-439c-9856-d091310dcd2a"
      }
    }
  }
};