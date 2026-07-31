import React from "react";
import { View, Text, Pressable } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/store/authStore";
import { HomeIcon, PackageIcon, CalendarIcon, UserIcon } from "@/components/icons";

function TabIcon({ icon, color, focused }: { icon: React.ReactNode; color: string; focused: boolean }) {
  return (
    <View className="items-center justify-center" style={{ marginTop: -2 }}>
      {icon}
      {focused ? (
        <View className="mt-1 h-1 w-6 rounded-full" style={{ backgroundColor: color }} />
      ) : (
        <View className="mt-1 h-1 w-6" />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { status, role } = useAuthStore();
  const insets = useSafeAreaInsets();

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/onboarding" />;
  }

  const activeColor = "#0d5b6b";
  const inactiveColor = "#9ca3af";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f3f4f6",
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<HomeIcon size={24} color={color} />} color={activeColor} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<PackageIcon size={24} color={color} />} color={activeColor} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<CalendarIcon size={24} color={color} />} color={activeColor} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={<UserIcon size={24} color={color} />} color={activeColor} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="[role]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
