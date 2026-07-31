import React from "react";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { formatPrice, formatDate } from "@/utils";
import { apiGetMyPayments } from "@/api/payments";
import { CreditCardIcon } from "@/components/icons";

export default function PaymentsScreen() {
  const query = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => apiGetMyPayments(1, 100),
    retry: false,
  });

  const payments = query.data?.data ?? [];
  const totalPaid = payments.filter((p: any) => p.status === "succeeded").reduce((sum: number, p: any) => sum + p.amount, 0);

  return (
    <Screen>
      <ScreenHeader title="Payments" showBack={false} />

      {/* Summary Card */}
      <View className="px-4 pb-4">
        <Card elevation="md" className="bg-primary">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <CreditCardIcon size={24} color="#ffffff" />
            </View>
            <View>
              <Text className="text-sm text-white/80">Total Paid</Text>
              <Text className="font-display text-2xl font-bold text-white">{formatPrice(totalPaid)}</Text>
            </View>
          </View>
        </Card>
      </View>

      {query.isPending ? (
        <View className="gap-3 px-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : query.isError ? (
        <EmptyState icon="💳" title="Couldn't load payments" message="Pull down to refresh." />
      ) : payments.length === 0 ? (
        <EmptyState icon="💳" title="No payments yet" message="Your payment history will appear here." />
      ) : (
        <RefreshFlatList
          data={payments}
          keyExtractor={(item: any) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card padded={false}>
              <View className="flex-row items-center p-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <CreditCardIcon size={24} color="#0d5b6b" />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-display font-bold text-foreground">{formatPrice(item.amount)}</Text>
                    <StatusBadge status={item.status} />
                  </View>
                  <Text className="text-sm text-muted-foreground mt-0.5" numberOfLines={1}>
                    {item.description || `Payment #${item.id.slice(0, 8)}`}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">{formatDate(item.createdAt)}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
