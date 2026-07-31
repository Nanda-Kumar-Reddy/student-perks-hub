import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "LifelineAustralia",
  slug: "lifeline-australia-mobile",
  scheme: "lifelineaustralia",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.lifelineaustralia.app",
    infoPlist: {
      NSCameraUsageDescription: "We need camera access to take profile photos and upload documents.",
      NSPhotoLibraryUsageDescription: "We need photo library access to select images for your profile and listings.",
    },
  },
  android: {
    package: "com.lifelineaustralia.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0d5b6b",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        color: "#ffffff",
        defaultSound: true,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "We need access to your photos to upload images.",
        cameraPermission: "We need access to your camera to take photos.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "placeholder-eas-project-id",
    },
  },
});
