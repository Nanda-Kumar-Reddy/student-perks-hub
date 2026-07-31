import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/utils";
import { apiGetNotifications, apiMarkAllNotificationsRead, apiMarkNotificationRead } from "@/api/notifications";
import { BellIcon } from "@/components/icons";

export default function NotificationsScreen() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiGetNotifications(1, 50),
    retry: false,
  });

  const markAllMutation = useMutation({
    mutationFn: apiMarkAllNotificationsRead,
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: apiMarkNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = query.data?.data ?? [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        showBack={false}
        right={
          unreadCount > 0 ? (
            <Pressable onPress={() => markAllMutation.mutate()}>
              <Text className="text-sm font-semibold text-primary">Mark all read</Text>
            </Pressable>
          ) : null
        }
      />

      {query.isPending ? (
        <View className="gap-3 px-4 pt-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : query.isError ? (
        <EmptyState icon="🔔" title="Couldn't load notifications" message="Pull down to refresh." />
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <RefreshFlatList
          data={notifications}
          keyExtractor={(item: any) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (!item.isRead) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  markOneMutation.mutate(item.id);
                }
              }}
              className={`flex-row gap-3 rounded-2xl border p-4 ${
                item.isRead ? "border-border/50 bg-card" : "border-primary/20 bg-primary/5"
              }`}
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
            >
              <View className={`h-10 w-10 items-center justify-center rounded-xl ${item.isRead ? "bg-muted" : "bg-primary/10"}`}>
                <BellIcon size={20} color={item.isRead ? "#6b7280" : "#0d5b6b"} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-display font-bold text-foreground">{item.title}</Text>
                  <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
                </View>
                <Text className="text-sm text-muted-foreground mt-1">{item.message}</Text>
              </View>
              {!item.isRead ? <View className="h-2.5 w-2.5 rounded-full bg-primary mt-2" /> : null}
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
