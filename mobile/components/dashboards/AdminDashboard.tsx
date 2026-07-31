import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { formatPrice } from "@/utils";
import { useAuthStore } from "@/store/authStore";
import { apiGetAdminDashboard } from "@/api/admin";

export function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const dashQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: apiGetAdminDashboard,
    retry: false,
    staleTime: 60_000,
  });

  const dash = dashQuery.data as any;
  const metrics = [
    { label: "Total Revenue", value: formatPrice(dash?.totalRevenue ?? dash?.revenue ?? 0), emoji: "💰" },
    { label: "Active Users", value: String(dash?.activeUsers ?? dash?.totalUsers ?? 0), emoji: "👥" },
    { label: "Pending Approvals", value: String(dash?.pendingApprovals ?? 0), emoji: "⏳" },
    { label: "Transactions", value: String(dash?.totalTransactions ?? 0), emoji: "📊" },
  ];

  return (
    <Screen scroll contentClassName="px-4 pt-4 pb-6">
      <View className="flex-row items-center gap-3 mb-6">
        <Avatar name={user?.fullName || "Admin"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Admin Panel</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Admin"}
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
        <Pressable onPress={() => router.push("/admin/users")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Users</Text>
          <Text className="text-2xl">👥</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/admin/vendors")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Vendors</Text>
          <Text className="text-2xl">🏪</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/admin/approvals")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Approvals</Text>
          <Text className="text-2xl">✅</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/admin/transactions")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Transactions</Text>
          <Text className="text-2xl">📊</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/admin/community-tasks")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Community Tasks</Text>
          <Text className="text-2xl">📋</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/admin/analysis")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Analysis</Text>
          <Text className="text-2xl">📈</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
