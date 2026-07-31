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
import { apiGetVendorDashboard, apiGetVendorTransactions } from "@/api/vendor";
import {
  DollarIcon, CalendarIcon, ClockIcon, PackageIcon,
  BarChartIcon, SettingsIcon, ClipboardIcon, ChevronRightIcon,
  BellIcon, StarIcon,
} from "@/components/icons";

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
  const transactions = txQuery.data?.data ?? [];
  const loading = dashQuery.isPending;

  const metrics = [
    { label: "Revenue", value: formatPrice(dash?.totalRevenue ?? dash?.revenue ?? 0), icon: <DollarIcon size={20} color="#ffffff" />, gradient: ["#16a34a", "#4ade80"] as [string, string] },
    { label: "Bookings", value: String(dash?.totalBookings ?? dash?.bookings ?? 0), icon: <CalendarIcon size={20} color="#ffffff" />, gradient: ["#0d5b6b", "#0e7490"] as [string, string] },
    { label: "Pending", value: String(dash?.pendingRequests ?? 0), icon: <ClockIcon size={20} color="#ffffff" />, gradient: ["#f97316", "#fb923c"] as [string, string] },
    { label: "Listings", value: String(dash?.totalListings ?? dash?.listings ?? 0), icon: <PackageIcon size={20} color="#ffffff" />, gradient: ["#6366f1", "#818cf8"] as [string, string] },
  ];

  const menu = [
    { label: "My Services", icon: <PackageIcon size={22} color="#0d5b6b" />, route: "/vendor/services", bg: "#e0f2fe" },
    { label: "Requests", icon: <ClipboardIcon size={22} color="#f97316" />, route: "/vendor/requests", bg: "#fff7ed" },
    { label: "Coupons", icon: <StarIcon size={22} color="#ec4899" />, route: "/vendor/offers", bg: "#fce7f3" },
    { label: "Analytics", icon: <BarChartIcon size={22} color="#6366f1" />, route: "/vendor/analytics", bg: "#e0e7ff" },
    { label: "Verify Transaction", icon: <DollarIcon size={22} color="#16a34a" />, route: "/vendor/verify-transaction", bg: "#f0fdf4" },
    { label: "Settings", icon: <SettingsIcon size={22} color="#6b7280" />, route: "/vendor/settings", bg: "#f3f4f6" },
  ];

  return (
    <Screen scroll contentClassName="pb-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Avatar name={user?.fullName || "Vendor"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Vendor Portal</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Vendor"}
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

      {/* Recent Transactions */}
      <SectionHeader
        title="Recent Transactions"
        action={<Pressable onPress={() => router.push("/payments")}><Text className="text-sm font-semibold text-primary">See all</Text></Pressable>}
        className="pt-6"
      />
      <View className="gap-3 px-4">
        {loading ? (
          <SkeletonCard />
        ) : transactions.length === 0 ? (
          <Card className="items-center py-8">
            <Text className="text-3xl mb-2">💳</Text>
            <Text className="text-sm text-muted-foreground">No transactions yet</Text>
          </Card>
        ) : (
          transactions.slice(0, 3).map((tx: any) => (
            <Card key={tx.id} padded={false}>
              <View className="flex-row items-center p-4">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <DollarIcon size={20} color="#16a34a" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-foreground">{formatPrice(tx.amount)}</Text>
                  <Text className="text-xs text-muted-foreground">{tx.status || "completed"}</Text>
                </View>
                <Text className="text-xs text-muted-foreground">{tx.createdAt?.slice(0, 10)}</Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}
