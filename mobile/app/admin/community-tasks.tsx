import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatRelativeTime } from "@/utils";
import { apiGetPendingCommunityTasks, apiApproveCommunityTask, apiRejectCommunityTask } from "@/api/community";
import type { CommunityTask } from "@/types";

export default function AdminCommunityTasksScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-pending-tasks"],
    queryFn: () => apiGetPendingCommunityTasks(1, 50),
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveCommunityTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pending-tasks"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiRejectCommunityTask(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-pending-tasks"] }),
  });

  const tasks = (query.data?.data ?? []) as CommunityTask[];

  return (
    <Screen>
      <ScreenHeader title="Community Tasks" subtitle="Pending approval" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="📋" title="Couldn't load tasks" message="Try again later." />
      ) : tasks.length === 0 ? (
        <EmptyState icon="📋" title="No pending tasks" message="All tasks have been reviewed." />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground flex-1">{item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.description}</Text>
              <Text className="text-xs text-muted-foreground mt-1">{formatPrice(item.payment)} · {formatRelativeTime(item.createdAt)}</Text>
              <View className="flex-row gap-2 mt-3">
                <Pressable
                  onPress={() => approveMutation.mutate(item.id)}
                  className="flex-1 py-2 rounded-lg bg-success items-center"
                >
                  <Text className="text-sm font-semibold text-success-foreground">Approve</Text>
                </Pressable>
                <Pressable
                  onPress={() => Alert.prompt("Reject", "Enter reason:", (reason) => {
                    if (reason) rejectMutation.mutate({ id: item.id, reason });
                  })}
                  className="flex-1 py-2 rounded-lg bg-destructive items-center"
                >
                  <Text className="text-sm font-semibold text-destructive-foreground">Reject</Text>
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
