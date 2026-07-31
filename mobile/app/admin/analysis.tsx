import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/utils";
import { apiGetAdminDashboard, apiGetAdminRevenueAnalytics, apiGetAdminUserAnalytics } from "@/api/admin";

export default function AdminAnalysisScreen() {
  const dashQuery = useQuery({ queryKey: ["admin-dashboard"], queryFn: apiGetAdminDashboard, retry: false });
  const revQuery = useQuery({ queryKey: ["admin-revenue"], queryFn: () => apiGetAdminRevenueAnalytics("monthly"), retry: false });
  const usersQuery = useQuery({ queryKey: ["admin-user-analytics"], queryFn: apiGetAdminUserAnalytics, retry: false });

  if (dashQuery.isPending) return <Screen><ScreenHeader title="Analysis" /><Spinner /></Screen>;

  const dash = dashQuery.data as any;
  const rev = revQuery.data as any;
  const users = usersQuery.data as any;

  return (
    <Screen>
      <ScreenHeader title="Analysis" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3 mb-4">
          <Card className="flex-1 min-w-[45%]">
            <Text className="text-sm text-muted-foreground">Total Revenue</Text>
            <Text className="font-display text-2xl font-bold text-primary">{formatPrice(dash?.totalRevenue ?? 0)}</Text>
          </Card>
          <Card className="flex-1 min-w-[45%]">
            <Text className="text-sm text-muted-foreground">Total Users</Text>
            <Text className="font-display text-2xl font-bold text-primary">{dash?.totalUsers ?? 0}</Text>
          </Card>
        </View>

        <Text className="font-display text-lg font-bold text-foreground mb-3">Revenue Trend</Text>
        {revQuery.isPending ? <Spinner /> : revQuery.isError ? (
          <EmptyState icon="📈" title="No data yet" />
        ) : (
          <Card>
            {Array.isArray(rev?.data) ? rev.data.map((p: any, i: number) => (
              <View key={i} className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0">
                <Text className="text-sm text-foreground">{p.label || p.month || `Period ${i + 1}`}</Text>
                <Text className="text-sm font-semibold text-primary">{formatPrice(p.revenue ?? p.amount ?? 0)}</Text>
              </View>
            )) : <Text className="text-sm text-muted-foreground">Revenue data will appear here.</Text>}
          </Card>
        )}

        <Text className="font-display text-lg font-bold text-foreground mb-3 mt-4">User Growth</Text>
        {usersQuery.isPending ? <Spinner /> : usersQuery.isError ? (
          <EmptyState icon="👥" title="No data yet" />
        ) : (
          <Card>
            {Array.isArray(users?.data) ? users.data.map((p: any, i: number) => (
              <View key={i} className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0">
                <Text className="text-sm text-foreground">{p.label || p.month || `Period ${i + 1}`}</Text>
                <Text className="text-sm font-semibold text-primary">{p.count ?? p.users ?? 0}</Text>
              </View>
            )) : <Text className="text-sm text-muted-foreground">User data will appear here.</Text>}
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
