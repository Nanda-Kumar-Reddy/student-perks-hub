import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatRelativeTime } from "@/utils";
import { apiGetMyBookings } from "@/api/student";
import { useAuthStore } from "@/store/authStore";

export default function BookingsScreen() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const query = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => apiGetMyBookings(1, 50),
    retry: false,
  });

  if (query.isPending) return <Screen><Spinner /></Screen>;
  if (query.isError) {
    return (
      <Screen>
        <EmptyState icon="📅" title="Couldn't load bookings" message="Pull to refresh or try again later." />
      </Screen>
    );
  }

  const bookings = query.data?.data ?? [];

  return (
    <Screen contentClassName="px-4 pt-4">
      <Text className="font-display text-2xl font-bold text-foreground mb-4">My Bookings</Text>
      {bookings.length === 0 ? (
        <EmptyState icon="📅" title="No bookings yet" message="Browse services and make your first booking." />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item: any) => item.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground">{item.serviceType || "Booking"}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-sm text-muted-foreground">
                {item.notes || `Booking #${item.id.slice(0, 8)}`}
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                {formatRelativeTime(item.createdAt)}
              </Text>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
