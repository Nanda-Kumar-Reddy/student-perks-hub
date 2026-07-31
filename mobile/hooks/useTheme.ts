import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";

export type ResolvedTheme = "light" | "dark";

export function useTheme(): { resolved: ResolvedTheme; mode: string; setMode: (m: "light" | "dark" | "system") => void } {
  const systemScheme = useColorScheme();
  const { themeMode, setThemeMode } = useSettingsStore();
  const resolved: ResolvedTheme =
    themeMode === "system" ? (systemScheme === "dark" ? "dark" : "light") : themeMode;
  return { resolved, mode: themeMode, setMode: setThemeMode };
}
