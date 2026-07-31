import React from "react";
import { Tabs, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { HomeIcon, PackageIcon, CalendarIcon, UserIcon } from "@/components/icons";

export default function TabsLayout() {
  const { status, role } = useAuthStore();

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0d5b6b",
        tabBarStyle: { backgroundColor: "#ffffff", borderTopColor: "#e5e5e5" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => <PackageIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => <CalendarIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="[role]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
