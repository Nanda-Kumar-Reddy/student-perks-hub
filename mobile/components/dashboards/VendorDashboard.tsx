import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { formatPrice } from "@/utils";
import { useAuthStore } from "@/store/authStore";
import { apiGetVendorDashboard, apiGetVendorTransactions } from "@/api/vendor";

export function VendorDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const dashQuery = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: apiGetVendorDashboard,
    retry: false,
    staleTime: 60_000,
  });
  const txQuery = useQuery({
    queryKey: ["vendor-transactions"],
    queryFn: () => apiGetVendorTransactions(1, 5),
    retry: false,
    staleTime: 60_000,
  });

  const dash = dashQuery.data as any;
  const metrics = [
    { label: "Revenue", value: formatPrice(dash?.totalRevenue ?? dash?.revenue ?? 0), emoji: "💰" },
    { label: "Bookings", value: String(dash?.totalBookings ?? dash?.bookings ?? 0), emoji: "📅" },
    { label: "Pending", value: String(dash?.pendingRequests ?? 0), emoji: "⏳" },
    { label: "Listings", value: String(dash?.totalListings ?? dash?.listings ?? 0), emoji: "📦" },
  ];

  return (
    <Screen scroll contentClassName="px-4 pt-4 pb-6">
      <View className="flex-row items-center gap-3 mb-6">
        <Avatar name={user?.fullName || "Vendor"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Vendor Portal</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Vendor"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3 mb-6">
        {metrics.map((m) => (
          <Card key={m.label} className="flex-1 min-w-[45%]">
            <Text className="text-2xl mb-1">{m.emoji}</Text>
            <Text className="font-display text-2xl font-bold text-primary">{m.value}</Text>
            <Text className="text-sm text-muted-foreground">{m.label}</Text>
          </Card>
        ))}
      </View>

      <Text className="font-display text-lg font-bold text-foreground mb-3">Manage</Text>
      <View className="gap-2">
        <Pressable onPress={() => router.push("/vendor/services")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">My Services</Text>
          <Text className="text-2xl">📦</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/vendor/requests")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Requests</Text>
          <Text className="text-2xl">📋</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/vendor/offers")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Coupons</Text>
          <Text className="text-2xl">🎁</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/vendor/analytics")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Analytics</Text>
          <Text className="text-2xl">📊</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/vendor/settings")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Settings</Text>
          <Text className="text-2xl">⚙️</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
