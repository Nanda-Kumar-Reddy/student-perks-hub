import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { apiGetAdminVendors, apiApproveVendor, apiRejectVendor } from "@/api/admin";

export default function AdminVendorsScreen() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: ["admin-vendors"], queryFn: () => apiGetAdminVendors(1, 50), retry: false });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveVendor(id),
    onSuccess: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); qc.invalidateQueries({ queryKey: ["admin-vendors"] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiRejectVendor(id),
    onSuccess: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); qc.invalidateQueries({ queryKey: ["admin-vendors"] }); },
  });

  const vendors = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Vendors" subtitle={`${vendors.filter(v => v.vendorStatus === "pending").length} pending approval`} showBack={false} />
      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="🏪" title="Couldn't load vendors" />
      ) : vendors.length === 0 ? (
        <EmptyState icon="🏪" title="No vendors" message="Vendor applications will appear here." />
      ) : (
        <RefreshFlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card elevation="md">
              <View className="flex-row items-center gap-3 mb-2">
                <Avatar name={item.businessName || item.fullName || item.email} size={44} />
                <View className="flex-1">
                  <Text className="font-display font-bold text-foreground">{item.businessName || "Vendor"}</Text>
                  <Text className="text-sm text-muted-foreground">{item.email}</Text>
                </View>
                <StatusBadge status={item.vendorStatus || item.status || "pending"} />
              </View>
              {item.vendorStatus === "pending" ? (
                <View className="flex-row gap-2 mt-3">
                  <Button onPress={() => approveMutation.mutate(item.id)} loading={approveMutation.isPending} size="sm" className="flex-1">
                    Approve
                  </Button>
                  <Button
                    onPress={() => Alert.alert("Reject", "Reject this vendor?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Reject", style: "destructive", onPress: () => rejectMutation.mutate(item.id) },
                    ])}
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
    </Screen>
  );
}
