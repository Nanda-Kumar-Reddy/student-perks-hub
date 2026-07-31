import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/utils";
import { apiGetVendorDashboard, apiGetVendorRevenueAnalytics } from "@/api/vendor";

export default function VendorAnalyticsScreen() {
  const dashQuery = useQuery({ queryKey: ["vendor-dashboard"], queryFn: apiGetVendorDashboard, retry: false });
  const revQuery = useQuery({ queryKey: ["vendor-revenue"], queryFn: () => apiGetVendorRevenueAnalytics("monthly"), retry: false });

  const dash = dashQuery.data as any;
  const rev = revQuery.data as any;

  if (dashQuery.isPending) return <Screen><ScreenHeader title="Analytics" /><Spinner /></Screen>;

  return (
    <Screen>
      <ScreenHeader title="Analytics" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3 mb-4">
          <Card className="flex-1 min-w-[45%]">
            <Text className="text-sm text-muted-foreground">Total Revenue</Text>
            <Text className="font-display text-2xl font-bold text-primary">{formatPrice(dash?.totalRevenue ?? 0)}</Text>
          </Card>
          <Card className="flex-1 min-w-[45%]">
            <Text className="text-sm text-muted-foreground">Total Bookings</Text>
            <Text className="font-display text-2xl font-bold text-primary">{dash?.totalBookings ?? 0}</Text>
          </Card>
        </View>

        <Text className="font-display text-lg font-bold text-foreground mb-3">Revenue Trend</Text>
        {revQuery.isPending ? <Spinner /> : revQuery.isError ? (
          <EmptyState icon="📊" title="No data yet" />
        ) : (
          <Card>
            {Array.isArray(rev?.data) ? (
              rev.data.map((point: any, i: number) => (
                <View key={i} className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0">
                  <Text className="text-sm text-foreground">{point.label || point.month || `Period ${i + 1}`}</Text>
                  <Text className="text-sm font-semibold text-primary">{formatPrice(point.revenue ?? point.amount ?? 0)}</Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-muted-foreground">Revenue data will appear here.</Text>
            )}
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
