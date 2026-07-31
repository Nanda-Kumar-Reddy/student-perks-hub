import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput, Modal } from "react-native";
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
import { apiGetVendorRequests, apiApproveVendorRequest, apiRejectVendorRequest } from "@/api/vendor";
import type { VendorRequest } from "@/types";
import { CheckIcon, XIcon, ClipboardIcon } from "@/components/icons";

export default function VendorRequestsScreen() {
  const qc = useQueryClient();
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query = useQuery({
    queryKey: ["vendor-requests"],
    queryFn: () => apiGetVendorRequests(undefined, undefined, 1, 50),
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveVendorRequest(id),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-requests"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiRejectVendorRequest(id, reason),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-requests"] });
      setRejectModal(null);
      setRejectReason("");
    },
  });

  const requests = (query.data?.data ?? []) as VendorRequest[];

  return (
    <Screen>
      <ScreenHeader title="Requests" subtitle={`${requests.filter(r => r.status === "pending").length} pending`} />
      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="📋" title="Couldn't load requests" />
      ) : requests.length === 0 ? (
        <EmptyState icon="📋" title="No requests" message="Student requests will appear here." />
      ) : (
        <RefreshFlatList
          data={requests}
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
                    <ClipboardIcon size={20} color="#0d5b6b" />
                  </View>
                  <Text className="font-display font-bold text-foreground flex-1">{item.serviceType.replace(/_/g, " ")}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              {item.message ? (
                <Text className="text-sm text-muted-foreground mb-2">{item.message}</Text>
              ) : null}
              <Text className="text-xs text-muted-foreground mb-3">{formatRelativeTime(item.createdAt)}</Text>
              {item.status === "pending" ? (
                <View className="flex-row gap-2">
                  <Button
                    onPress={() => approveMutation.mutate(item.id)}
                    loading={approveMutation.isPending}
                    size="sm"
                    className="flex-1"
                  >
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

      {/* Reject Modal */}
      <Modal visible={!!rejectModal} transparent animationType="slide" onRequestClose={() => setRejectModal(null)}>
        <View className="flex-1 bg-black/40 justify-end">
          <Pressable className="flex-1" onPress={() => setRejectModal(null)} />
          <View className="bg-card rounded-t-3xl p-6">
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 rounded-full bg-muted mb-4" />
              <Text className="font-display text-lg font-bold text-foreground">Reject Request</Text>
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
