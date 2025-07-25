import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

// Create google-services.json from environment variable if it exists
if (process.env.GOOGLE_SERVICES_JSON_BASE64) {
  try {
    const content = Buffer.from(process.env.GOOGLE_SERVICES_JSON_BASE64, 'base64').toString('utf-8');
    writeFileSync('./src/assets/google-services.json', content);
  } catch (error) {
    console.warn('Failed to create google-services.json:', error);
  }
}

export default {
  expo: {
    name: "QuickLib",
    slug: "quicklib",
    version: process.env.VERSION_NAME || "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "quicklib",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "no.chirico.quicklib",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./src/assets/google-services.json",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/icon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/adaptive-icon.png",
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
      },
      apiUrl: process.env.API_URL || "http://localhost:8080",
      releaseUrl: process.env.RELEASE_URL || ""
    }
  }
};