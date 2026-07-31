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
import { apiGetVendorRequests, apiApproveVendorRequest, apiRejectVendorRequest } from "@/api/vendor";
import type { VendorRequest } from "@/types";

export default function VendorRequestsScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["vendor-requests"],
    queryFn: () => apiGetVendorRequests(undefined, undefined, 1, 50),
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveVendorRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-requests"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => apiRejectVendorRequest(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-requests"] }),
  });

  const handleReject = (id: string) => {
    Alert.prompt("Reject Request", "Enter a reason:", (reason) => {
      if (reason) rejectMutation.mutate({ id, reason });
    });
  };

  const requests = (query.data?.data ?? []) as VendorRequest[];

  return (
    <Screen>
      <ScreenHeader title="Requests" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="📋" title="Couldn't load requests" message="Try again later." />
      ) : requests.length === 0 ? (
        <EmptyState icon="📋" title="No requests" message="Student requests will appear here." />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground">{item.serviceType.replace(/_/g, " ")}</Text>
                <StatusBadge status={item.status} />
              </View>
              {item.message ? (
                <Text className="text-sm text-muted-foreground">{item.message}</Text>
              ) : null}
              <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(item.createdAt)}</Text>
              {item.status === "pending" ? (
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    onPress={() => approveMutation.mutate(item.id)}
                    className="flex-1 py-2 rounded-lg bg-success items-center"
                  >
                    <Text className="text-sm font-semibold text-success-foreground">Approve</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleReject(item.id)}
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
