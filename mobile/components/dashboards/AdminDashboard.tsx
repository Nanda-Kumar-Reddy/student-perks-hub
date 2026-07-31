import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatPrice } from "@/utils";
import { useAuthStore } from "@/store/authStore";
import { apiGetAdminDashboard } from "@/api/admin";
import {
  DollarIcon, UsersIcon, ClockIcon, BarChartIcon,
  StoreIcon, ClipboardIcon, ShieldIcon, ChevronRightIcon,
  BellIcon, ListIcon,
} from "@/components/icons";

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
  const loading = dashQuery.isPending;

  const metrics = [
    { label: "Revenue", value: formatPrice(dash?.totalRevenue ?? dash?.revenue ?? 0), icon: <DollarIcon size={20} color="#ffffff" />, gradient: ["#16a34a", "#4ade80"] as [string, string] },
    { label: "Users", value: String(dash?.activeUsers ?? dash?.totalUsers ?? 0), icon: <UsersIcon size={20} color="#ffffff" />, gradient: ["#0d5b6b", "#0e7490"] as [string, string] },
    { label: "Approvals", value: String(dash?.pendingApprovals ?? 0), icon: <ClockIcon size={20} color="#ffffff" />, gradient: ["#f97316", "#fb923c"] as [string, string] },
    { label: "Transactions", value: String(dash?.totalTransactions ?? 0), icon: <BarChartIcon size={20} color="#ffffff" />, gradient: ["#6366f1", "#818cf8"] as [string, string] },
  ];

  const menu = [
    { label: "Users", icon: <UsersIcon size={22} color="#0d5b6b" />, route: "/admin/users", bg: "#e0f2fe" },
    { label: "Vendors", icon: <StoreIcon size={22} color="#f97316" />, route: "/admin/vendors", bg: "#fff7ed" },
    { label: "Approvals", icon: <ShieldIcon size={22} color="#16a34a" />, route: "/admin/approvals", bg: "#f0fdf4" },
    { label: "Transactions", icon: <BarChartIcon size={22} color="#6366f1" />, route: "/admin/transactions", bg: "#e0e7ff" },
    { label: "Community Tasks", icon: <ClipboardIcon size={22} color="#ec4899" />, route: "/admin/community-tasks", bg: "#fce7f3" },
    { label: "Analysis", icon: <BarChartIcon size={22} color="#0d5b6b" />, route: "/admin/analysis", bg: "#e0f2fe" },
  ];

  return (
    <Screen scroll contentClassName="pb-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Avatar name={user?.fullName || "Admin"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Admin Panel</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Admin"}
          </Text>
        </View>
        <AnimatedPressable
          onPress={() => router.push("/notifications")}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted"
        >
          <BellIcon size={22} color="#6b7280" />
        </AnimatedPressable>
      </View>

      {/* Metrics */}
      {loading ? (
        <View className="flex-row flex-wrap gap-3 px-4 pt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3 px-4 pt-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} gradient={m.gradient} />
          ))}
        </View>
      )}

      {/* Menu */}
      <SectionHeader title="Manage" className="pt-6" />
      <View className="flex-row flex-wrap gap-3 px-4">
        {menu.map((item) => (
          <AnimatedPressable
            key={item.label}
            onPress={() => router.push(item.route as any)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </View>
              <Text className="flex-1 text-sm font-semibold text-foreground">{item.label}</Text>
              <ChevronRightIcon size={18} color="#d1d5db" />
            </Card>
          </AnimatedPressable>
        ))}
      </View>
    </Screen>
  );
}
