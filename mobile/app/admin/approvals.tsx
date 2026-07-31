import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";
import { apiGetAdminApprovals, apiApproveAdminApproval, apiRejectAdminApproval } from "@/api/admin";

export default function AdminApprovalsScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-approvals"],
    queryFn: () => apiGetAdminApprovals(1, 50),
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveAdminApproval(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-approvals"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiRejectAdminApproval(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-approvals"] }),
  });

  const approvals = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Approvals" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="✅" title="Couldn't load approvals" message="Try again later." />
      ) : approvals.length === 0 ? (
        <EmptyState icon="✅" title="No pending approvals" message="Everything is up to date." />
      ) : (
        <FlatList
          data={approvals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground">{item.entityType}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
              {item.status === "PENDING" ? (
                <View className="flex-row gap-2 mt-2">
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
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
