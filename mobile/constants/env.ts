// Runtime config — imported as `@/constants/env`.
// Replace localhost with your machine's LAN IP when testing on a device.

export const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string) || "http://localhost:4000";

export const REALTIME_SERVER_URL: string =
  (process.env.EXPO_PUBLIC_REALTIME_SERVER_URL as string) || "http://localhost:4001";
