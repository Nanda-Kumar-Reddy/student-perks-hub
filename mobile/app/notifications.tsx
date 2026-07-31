import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";
import { apiGetNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from "@/api/notifications";
import type { AppNotification } from "@/types";

export default function NotificationsScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiGetNotifications(1, 50),
    retry: false,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiMarkNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: apiMarkAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = (query.data?.data ?? []) as AppNotification[];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        right={
          hasUnread ? (
            <Pressable onPress={() => markAllMutation.mutate()}>
              <Text className="text-sm text-primary">Mark all read</Text>
            </Pressable>
          ) : null
        }
      />
      {query.isPending ? (
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon="🔔" title="Couldn't load notifications" message="Try again later." />
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable onPress={() => !item.isRead && markReadMutation.mutate(item.id)}>
              <Card className={item.isRead ? "opacity-60" : ""}>
                <View className="flex-row items-start gap-3">
                  <View className="flex-1">
                    <Text className="font-display font-bold text-foreground">{item.title}</Text>
                    <Text className="text-sm text-muted-foreground mt-1">{item.message}</Text>
                    <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(item.createdAt)}</Text>
                  </View>
                  {!item.isRead ? <View className="w-2.5 h-2.5 rounded-full bg-primary mt-2" /> : null}
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
