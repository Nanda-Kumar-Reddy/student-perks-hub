import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { FAB } from "@/components/ui/FAB";
import { formatRelativeTime } from "@/utils";
import { apiGetVendorCoupons, apiCreateVendorCoupon, apiDeleteVendorCoupon } from "@/api/vendor";
import type { Coupon } from "@/types";
import { PlusIcon, TrashIcon, StarIcon } from "@/components/icons";

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-coupons"] });
      setShowForm(false);
      setTitle(""); setDiscount(""); setDesc("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDeleteVendorCoupon(id),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-coupons"] });
    },
  });

  const coupons = (query.data?.data ?? []) as Coupon[];

  return (
    <Screen>
      <ScreenHeader title="Coupons" subtitle={`${coupons.length} active coupons`} />
      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="🎁" title="Couldn't load coupons" />
      ) : coupons.length === 0 ? (
        <EmptyState icon="🎁" title="No coupons" message="Create a coupon to attract students." />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card elevation="md" className="overflow-hidden">
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <StarIcon size={24} color="#f97316" />
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-display font-bold text-foreground">{item.couponTitle}</Text>
                    <Text className="font-display text-lg font-bold text-accent">{item.discountValue}</Text>
                  </View>
                  {item.description ? (
                    <Text className="text-sm text-muted-foreground mt-0.5">{item.description}</Text>
                  ) : null}
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
                    <Pressable onPress={() => Alert.alert("Delete", "Delete this coupon?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(item.id) },
                    ])}>
                      <View className="flex-row items-center gap-1">
                        <TrashIcon size={14} color="#ef4444" />
                        <Text className="text-sm text-destructive">Delete</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
      <FAB
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowForm(!showForm); }}
        icon={<PlusIcon size={28} color="#ffffff" />}
      />

      {showForm ? (
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <View className="bg-card rounded-t-3xl p-6 border-t border-border" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 }}>
            <View className="items-center mb-4">
              <View className="h-1.5 w-12 rounded-full bg-muted" />
            </View>
            <Text className="font-display text-lg font-bold text-foreground mb-4">New Coupon</Text>
            <View className="gap-3">
              <Input label="Title" value={title} onChangeText={setTitle} placeholder="Summer Sale" />
              <Input label="Discount" value={discount} onChangeText={setDiscount} placeholder="20% off" />
              <Input label="Description" value={desc} onChangeText={setDesc} placeholder="Terms and conditions" multiline />
              <Button onPress={() => createMutation.mutate()} loading={createMutation.isPending} fullWidth size="lg">
                Create Coupon
              </Button>
            </View>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}
