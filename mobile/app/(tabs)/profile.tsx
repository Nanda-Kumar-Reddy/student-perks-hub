import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/hooks/useTheme";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { themeMode, setThemeMode } = useSettingsStore();
  const { resolved } = useTheme();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const themeOptions: { label: string; value: "light" | "dark" | "system" }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  return (
    <Screen scroll contentClassName="px-4 pt-6">
      <View className="items-center mb-6">
        <Avatar name={user?.fullName || "User"} url={user?.avatarUrl} size={80} />
        <Text className="font-display text-xl font-bold text-foreground mt-3">
          {user?.fullName || "User"}
        </Text>
        <Text className="text-sm text-muted-foreground">{user?.email}</Text>
      </View>

      <Card className="mb-4">
        <Text className="font-display text-base font-bold text-foreground mb-3">Theme</Text>
        <View className="flex-row gap-2">
          {themeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setThemeMode(opt.value)}
              className={`flex-1 py-2.5 rounded-lg items-center ${themeMode === opt.value ? "bg-primary" : "bg-muted"}`}
            >
              <Text className={`text-sm font-semibold ${themeMode === opt.value ? "text-primary-foreground" : "text-foreground"}`}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="font-display text-base font-bold text-foreground mb-3">Account</Text>
        <View className="gap-3">
          <Pressable onPress={() => router.push("/student/profile")} className="flex-row items-center justify-between py-2">
            <Text className="text-foreground">Edit Profile</Text>
            <Text className="text-muted-foreground">›</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/notifications")} className="flex-row items-center justify-between py-2">
            <Text className="text-foreground">Notifications</Text>
            <Text className="text-muted-foreground">›</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/payments")} className="flex-row items-center justify-between py-2">
            <Text className="text-foreground">Payments</Text>
            <Text className="text-muted-foreground">›</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/chat")} className="flex-row items-center justify-between py-2">
            <Text className="text-foreground">Messages</Text>
            <Text className="text-muted-foreground">›</Text>
          </Pressable>
        </View>
      </Card>

      <Button onPress={handleSignOut} variant="destructive" fullWidth>
        Sign Out
      </Button>
    </Screen>
  );
}
