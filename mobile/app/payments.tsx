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
import { apiGetMyPayments } from "@/api/payments";
import type { Payment } from "@/types";

export default function PaymentsScreen() {
  const query = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => apiGetMyPayments(1, 50),
    retry: false,
  });

  const payments = (query.data?.data ?? []) as Payment[];

  return (
    <Screen>
      <ScreenHeader title="Payments" />
      {query.isPending ? (
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon="💳" title="Couldn't load payments" message="Try again later." />
      ) : payments.length === 0 ? (
        <EmptyState icon="💳" title="No payments yet" message="Your payment history will appear here." />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground">{formatPrice(item.amount, item.currency.toUpperCase())}</Text>
                <StatusBadge status={item.status} />
              </View>
              {item.description ? (
                <Text className="text-sm text-muted-foreground">{item.description}</Text>
              ) : null}
              <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(item.createdAt)}</Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
