import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/utils";
import { apiGetAdminDashboard, apiGetAdminRevenueAnalytics, apiGetAdminUserAnalytics } from "@/api/admin";
import { DollarIcon, UsersIcon, TrendingUpIcon, BarChartIcon } from "@/components/icons";

export default function AdminAnalysisScreen() {
  const dashQuery = useQuery({ queryKey: ["admin-dashboard"], queryFn: apiGetAdminDashboard, retry: false });
  const revQuery = useQuery({ queryKey: ["admin-revenue"], queryFn: () => apiGetAdminRevenueAnalytics("monthly"), retry: false });
  const usersQuery = useQuery({ queryKey: ["admin-user-analytics"], queryFn: apiGetAdminUserAnalytics, retry: false });

  const dash = dashQuery.data as any;
  const rev = revQuery.data as any;
  const users = usersQuery.data as any;
  const loading = dashQuery.isPending;

  const maxRev = Array.isArray(rev?.data) ? Math.max(...rev.data.map((p: any) => p.revenue ?? p.amount ?? 0), 1) : 1;

  return (
    <Screen scroll contentClassName="pb-6">
      <ScreenHeader title="Analysis" showBack={false} />

      {loading ? (
        <View className="flex-row flex-wrap gap-3 px-4 pt-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </View>
      ) : (
        <>
          <View className="flex-row flex-wrap gap-3 px-4 pt-4">
            <MetricCard label="Revenue" value={formatPrice(dash?.totalRevenue ?? 0)} icon={<DollarIcon size={20} color="#fff" />} gradient={["#16a34a", "#4ade80"]} />
            <MetricCard label="Users" value={dash?.totalUsers ?? 0} icon={<UsersIcon size={20} color="#fff" />} gradient={["#0d5b6b", "#0e7490"]} />
            <MetricCard label="Growth" value={`+${dash?.growth ?? 0}%`} icon={<TrendingUpIcon size={20} color="#fff" />} gradient={["#6366f1", "#818cf8"]} />
            <MetricCard label="Transactions" value={dash?.totalTransactions ?? 0} icon={<BarChartIcon size={20} color="#fff" />} gradient={["#f97316", "#fb923c"]} />
          </View>

          {/* Revenue Chart */}
          <View className="px-4 pt-6">
            <Text className="font-display text-lg font-bold text-foreground mb-3">Revenue Trend</Text>
            {revQuery.isPending ? <SkeletonCard /> : revQuery.isError ? (
              <EmptyState icon="📈" title="No data yet" />
            ) : (
              <Card elevation="md">
                {Array.isArray(rev?.data) && rev.data.length > 0 ? (
                  rev.data.map((point: any, i: number) => {
                    const val = point.revenue ?? point.amount ?? 0;
                    const pct = (val / maxRev) * 100;
                    return (
                      <View key={i} className="mb-3">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-sm text-muted-foreground">{point.label || point.month || `Period ${i + 1}`}</Text>
                          <Text className="text-sm font-semibold text-primary">{formatPrice(val)}</Text>
                        </View>
                        <View className="h-2 rounded-full bg-muted overflow-hidden">
                          <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text className="text-sm text-muted-foreground text-center py-4">Revenue data will appear here.</Text>
                )}
              </Card>
            )}
          </View>

          {/* User Growth */}
          <View className="px-4 pt-6">
            <Text className="font-display text-lg font-bold text-foreground mb-3">User Growth</Text>
            {usersQuery.isPending ? <SkeletonCard /> : usersQuery.isError ? (
              <EmptyState icon="👥" title="No data yet" />
            ) : (
              <Card elevation="md">
                {Array.isArray(users?.data) && users.data.length > 0 ? (
                  users.data.map((point: any, i: number) => {
                    const maxCount = Math.max(...users.data.map((p: any) => p.count ?? p.users ?? 0), 1);
                    const val = point.count ?? point.users ?? 0;
                    const pct = (val / maxCount) * 100;
                    return (
                      <View key={i} className="mb-3">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-sm text-muted-foreground">{point.label || point.month || `Period ${i + 1}`}</Text>
                          <Text className="text-sm font-semibold text-primary">{val}</Text>
                        </View>
                        <View className="h-2 rounded-full bg-muted overflow-hidden">
                          <View className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text className="text-sm text-muted-foreground text-center py-4">User data will appear here.</Text>
                )}
              </Card>
            )}
          </View>
        </>
      )}
    </Screen>
  );
}
