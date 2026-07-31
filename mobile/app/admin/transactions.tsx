import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatRelativeTime } from "@/utils";
import { apiGetAdminTransactions } from "@/api/admin";
import type { Transaction } from "@/types";

export default function AdminTransactionsScreen() {
  const query = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => apiGetAdminTransactions(1, 50),
    retry: false,
  });

  const transactions = (query.data?.data ?? []) as Transaction[];

  return (
    <Screen>
      <ScreenHeader title="Transactions" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="📊" title="Couldn't load transactions" message="Try again later." />
      ) : transactions.length === 0 ? (
        <EmptyState icon="📊" title="No transactions" message="Platform transactions will appear here." />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-primary">{formatPrice(item.amount, item.currency)}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
