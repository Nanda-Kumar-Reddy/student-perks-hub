import React, { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";
import { apiGetVendorCoupons, apiCreateVendorCoupon, apiDeleteVendorCoupon } from "@/api/vendor";
import type { Coupon } from "@/types";

export default function VendorOffersScreen() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [desc, setDesc] = useState("");

  const query = useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => apiGetVendorCoupons(1, 50),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: () => apiCreateVendorCoupon({ templateType: "custom", couponTitle: title, discountValue: discount, description: desc }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-coupons"] });
      setShowForm(false);
      setTitle(""); setDiscount(""); setDesc("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDeleteVendorCoupon(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-coupons"] }),
  });

  const coupons = (query.data?.data ?? []) as Coupon[];

  return (
    <Screen>
      <ScreenHeader
        title="Coupons"
        right={
          <Pressable onPress={() => setShowForm(!showForm)}>
            <Text className="text-2xl text-primary">{showForm ? "✕" : "＋"}</Text>
          </Pressable>
        }
      />
      {showForm ? (
        <View className="px-4 mb-4">
          <Card>
            <View className="gap-3">
              <TextInput value={title} onChangeText={setTitle} placeholder="Coupon title" placeholderTextColor="#999" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
              <TextInput value={discount} onChangeText={setDiscount} placeholder="Discount (e.g. 20%)" placeholderTextColor="#999" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
              <TextInput value={desc} onChangeText={setDesc} placeholder="Description" placeholderTextColor="#999" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
            </View>
            <Button onPress={() => createMutation.mutate()} loading={createMutation.isPending} fullWidth className="mt-3">
              Create Coupon
            </Button>
          </Card>
        </View>
      ) : null}
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="🎁" title="Couldn't load coupons" message="Try again later." />
      ) : coupons.length === 0 ? (
        <EmptyState icon="🎁" title="No coupons" message="Create a coupon to attract students." />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-display font-bold text-foreground">{item.couponTitle}</Text>
                <Text className="font-display text-lg font-bold text-primary">{item.discountValue}</Text>
              </View>
              {item.description ? <Text className="text-sm text-muted-foreground">{item.description}</Text> : null}
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
                <Pressable onPress={() => Alert.alert("Delete", "Delete this coupon?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(item.id) },
                ])}>
                  <Text className="text-sm text-destructive">Delete</Text>
                </Pressable>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
