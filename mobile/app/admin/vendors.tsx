import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiGetAdminVendors, apiApproveVendor, apiRejectVendor } from "@/api/admin";

export default function AdminVendorsScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => apiGetAdminVendors(1, 50),
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiApproveVendor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vendors"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiRejectVendor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-vendors"] }),
  });

  const vendors = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Vendors" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="🏪" title="Couldn't load vendors" message="Try again later." />
      ) : vendors.length === 0 ? (
        <EmptyState icon="🏪" title="No vendors" message="Vendor applications will appear here." />
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center gap-3 mb-2">
                <Avatar name={item.businessName || item.fullName || item.email} size={40} />
                <View className="flex-1">
                  <Text className="font-display font-bold text-foreground">{item.businessName || "Vendor"}</Text>
                  <Text className="text-sm text-muted-foreground">{item.email}</Text>
                </View>
                <StatusBadge status={item.vendorStatus || item.status || "pending"} />
              </View>
              {item.vendorStatus === "pending" ? (
                <View className="flex-row gap-2 mt-2">
                  <Pressable
                    onPress={() => approveMutation.mutate(item.id)}
                    className="flex-1 py-2 rounded-lg bg-success items-center"
                  >
                    <Text className="text-sm font-semibold text-success-foreground">Approve</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => Alert.alert("Reject", "Reject this vendor?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Reject", style: "destructive", onPress: () => rejectMutation.mutate(item.id) },
                    ])}
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
