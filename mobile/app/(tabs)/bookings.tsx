import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Chip } from "@/components/ui/Chip";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { formatRelativeTime } from "@/utils";
import { apiGetMyBookings, apiCancelBooking } from "@/api/student";
import * as Haptics from "expo-haptics";
import { CalendarIcon, ChevronRightIcon, XIcon } from "@/components/icons";

const filters = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type Filter = typeof filters[number];

export default function BookingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");

  const query = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => apiGetMyBookings(1, 100),
    retry: false,
  });

  const cancelMutation = useMutation({
    mutationFn: apiCancelBooking,
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  const handleCancel = (id: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      { text: "Yes, Cancel", style: "destructive", onPress: () => cancelMutation.mutate(id) },
    ]);
  };

  const bookings = query.data?.data ?? [];
  const filtered = filter === "all" ? bookings : bookings.filter((b: any) => b.status?.toLowerCase() === filter);

  return (
    <Screen contentClassName="flex-1">
      <View className="px-4 pt-4 pb-2">
        <Text className="font-display text-2xl font-bold text-foreground">My Bookings</Text>
        <Text className="text-sm text-muted-foreground mt-1">{bookings.length} total bookings</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}>
        {filters.map((f) => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            active={filter === f}
            onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
          />
        ))}
      </ScrollView>

      {query.isPending ? (
        <View className="gap-3 px-4 pt-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : query.isError ? (
        <EmptyState icon="⚠️" title="Couldn't load bookings" message="Pull down to refresh or try again later." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="📅" title="No bookings found" message={filter === "all" ? "Browse services and make your first booking." : `No ${filter} bookings.`} />
      ) : (
        <RefreshFlatList
          data={filtered}
          keyExtractor={(item: any) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card padded={false}>
              <View className="flex-row items-center p-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarIcon size={24} color="#0d5b6b" />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-display font-bold text-foreground">{item.serviceType || "Booking"}</Text>
                    <StatusBadge status={item.status} />
                  </View>
                  <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                    {item.notes || `Booking #${item.id.slice(0, 8)}`}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>
              </View>
              {(item.status === "pending" || item.status === "confirmed") && (
                <View className="flex-row border-t border-border/50">
                  <Pressable
                    onPress={() => handleCancel(item.id)}
                    className="flex-1 flex-row items-center justify-center gap-1.5 py-3"
                  >
                    <XIcon size={16} color="#ef4444" />
                    <Text className="text-sm font-semibold text-destructive">Cancel</Text>
                  </Pressable>
                </View>
              )}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
