import React, { useState } from "react";
import { View, Text, FlatList, Alert, TextInput, Modal, Pressable } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { formatRelativeTime } from "@/utils";
import { apiGetAdminApprovals, apiApproveAdminApproval, apiRejectAdminApproval } from "@/api/admin";
import { ShieldIcon } from "@/components/icons";

export default function AdminApprovalsScreen() {
  const qc = useQueryClient();
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query = useQuery({ queryKey: ["admin-approvals"], queryFn: () => apiGetAdminApprovals(1, 50), retry: false });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveAdminApproval(id),
    onSuccess: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); qc.invalidateQueries({ queryKey: ["admin-approvals"] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiRejectAdminApproval(id, reason),
    onSuccess: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); qc.invalidateQueries({ queryKey: ["admin-approvals"] }); setRejectModal(null); setRejectReason(""); },
  });

  const approvals = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Approvals" subtitle={`${approvals.filter(a => a.status === "PENDING").length} pending`} showBack={false} />
      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="🛡️" title="Couldn't load approvals" />
      ) : approvals.length === 0 ? (
        <EmptyState icon="🛡️" title="No pending approvals" message="Everything is up to date." />
      ) : (
        <RefreshFlatList
          data={approvals}
          keyExtractor={(item) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card elevation="md">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldIcon size={20} color="#0d5b6b" />
                  </View>
                  <Text className="font-display font-bold text-foreground">{item.entityType || "Approval"}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
              {item.status === "PENDING" ? (
                <View className="flex-row gap-2 mt-3">
                  <Button onPress={() => approveMutation.mutate(item.id)} loading={approveMutation.isPending} size="sm" className="flex-1">
                    Approve
                  </Button>
                  <Button
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setRejectModal({ id: item.id }); }}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </View>
              ) : null}
            </Card>
          )}
        />
      )}

      <Modal visible={!!rejectModal} transparent animationType="slide" onRequestClose={() => setRejectModal(null)}>
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="flex-1" onPress={() => setRejectModal(null)} />
          <View className="bg-card rounded-t-3xl p-6">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 rounded-full bg-muted mb-4" />
              <Text className="font-display text-lg font-bold text-foreground">Reject Approval</Text>
            </View>
            <TextInput
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Enter reason for rejection..."
              placeholderTextColor="#9ca3af"
              multiline
              className="rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground min-h-[80px]"
            />
            <View className="flex-row gap-2 mt-4">
              <Button onPress={() => setRejectModal(null)} variant="outline" fullWidth>Cancel</Button>
              <Button
                onPress={() => rejectModal && rejectMutation.mutate({ id: rejectModal.id, reason: rejectReason })}
                loading={rejectMutation.isPending}
                variant="destructive"
                fullWidth
              >
                Reject
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
