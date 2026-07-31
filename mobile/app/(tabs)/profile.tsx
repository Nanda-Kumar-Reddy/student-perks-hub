import React from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import {
  ChevronRightIcon, LogOutIcon, BellIcon, ChatIcon,
  CreditCardIcon, FileTextIcon, SettingsIcon, SunIcon,
  MoonIcon, SparkleIcon, UserIcon,
} from "@/components/icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { themeMode, setThemeMode } = useSettingsStore();
  const { resolved } = useTheme();

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const themeOptions: { label: string; value: "light" | "dark" | "system"; icon: React.ReactNode }[] = [
    { label: "Light", value: "light", icon: <SunIcon size={18} color={themeMode === "light" ? "#ffffff" : "#6b7280"} /> },
    { label: "Dark", value: "dark", icon: <MoonIcon size={18} color={themeMode === "dark" ? "#ffffff" : "#6b7280"} /> },
    { label: "Auto", value: "system", icon: <SparkleIcon size={18} color={themeMode === "system" ? "#ffffff" : "#6b7280"} /> },
  ];

  const menuItems = [
    { label: "Edit Profile", icon: <UserIcon size={20} color="#0d5b6b" />, route: "/student/profile", bg: "#e0f2fe" },
    { label: "Messages", icon: <ChatIcon size={20} color="#f97316" />, route: "/chat", bg: "#fff7ed" },
    { label: "Notifications", icon: <BellIcon size={20} color="#ec4899" />, route: "/notifications", bg: "#fce7f3" },
    { label: "Payments", icon: <CreditCardIcon size={20} color="#16a34a" />, route: "/payments", bg: "#f0fdf4" },
  ];

  return (
    <Screen scroll contentClassName="pb-8">
      {/* Profile Header */}
      <View className="items-center pt-8 pb-6">
        <Avatar name={user?.fullName || "User"} url={user?.avatarUrl} size={88} />
        <Text className="font-display text-xl font-bold text-foreground mt-3">
          {user?.fullName || "User"}
        </Text>
        <Text className="text-sm text-muted-foreground">{user?.email}</Text>
        <View className="mt-2 px-3 py-1 rounded-full bg-primary/10">
          <Text className="text-xs font-semibold text-primary uppercase">{user?.role || "student"}</Text>
        </View>
      </View>

      {/* Theme Selector */}
      <SectionHeader title="Appearance" />
      <View className="px-4">
        <Card className="flex-row gap-2">
          {themeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setThemeMode(opt.value);
              }}
              className={`flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-xl ${
                themeMode === opt.value ? "bg-primary" : "bg-muted"
              }`}
            >
              {opt.icon}
              <Text className={`text-sm font-semibold ${themeMode === opt.value ? "text-primary-foreground" : "text-foreground"}`}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </Card>
      </View>

      {/* Account Section */}
      <SectionHeader title="Account" className="pt-6" />
      <View className="px-4 gap-3">
        {menuItems.map((item) => (
          <Card key={item.label} padded={false}>
            <AnimatedPressable
              onPress={() => router.push(item.route as any)}
              className="flex-row items-center p-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </View>
              <Text className="flex-1 ml-3 text-base font-semibold text-foreground">{item.label}</Text>
              <ChevronRightIcon size={20} color="#d1d5db" />
            </AnimatedPressable>
          </Card>
        ))}
      </View>

      {/* Sign Out */}
      <View className="px-4 pt-8">
        <Button onPress={handleSignOut} variant="outline" fullWidth size="lg">
          Sign Out
        </Button>
      </View>

      <View className="items-center pt-6">
        <Text className="text-xs text-muted-foreground">LifeLine Australia v1.0.0</Text>
      </View>
    </Screen>
  );
}
