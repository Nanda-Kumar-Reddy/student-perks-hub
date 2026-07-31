import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { formatPrice, formatRelativeTime } from "@/utils";
import { apiGetAdminTransactions } from "@/api/admin";
import type { Transaction } from "@/types";
import { DollarIcon } from "@/components/icons";

export default function AdminTransactionsScreen() {
  const query = useQuery({ queryKey: ["admin-transactions"], queryFn: () => apiGetAdminTransactions(1, 50), retry: false });
  const transactions = (query.data?.data ?? []) as Transaction[];
  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);

  return (
    <Screen>
      <ScreenHeader title="Transactions" subtitle={`${transactions.length} total`} showBack={false} />

      {/* Summary */}
      <View className="px-4 pb-4">
        <Card className="bg-primary" elevation="md">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <DollarIcon size={24} color="#ffffff" />
            </View>
            <View>
              <Text className="text-sm text-white/80">Total Revenue</Text>
              <Text className="font-display text-2xl font-bold text-white">{formatPrice(totalRevenue)}</Text>
            </View>
          </View>
        </Card>
      </View>

      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="📊" title="Couldn't load transactions" />
      ) : transactions.length === 0 ? (
        <EmptyState icon="📊" title="No transactions" message="Platform transactions will appear here." />
      ) : (
        <RefreshFlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card padded={false}>
              <View className="flex-row items-center p-4">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <DollarIcon size={20} color="#0d5b6b" />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-display font-bold text-primary">{formatPrice(item.amount, item.currency)}</Text>
                    <StatusBadge status={item.status} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(item.createdAt)}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
