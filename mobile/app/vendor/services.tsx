import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { SERVICES } from "@/constants/services";
import { apiGetVendorServices, apiAddVendorService, apiRemoveVendorService } from "@/api/vendor";
import type { ServiceType } from "@/types";
import { CheckIcon, PlusIcon } from "@/components/icons";

const cardColors = ["#e0f2fe", "#fff7ed", "#f0fdf4", "#e0e7ff", "#fce7f3", "#fef3c7"];

export default function VendorServicesScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["vendor-services"],
    queryFn: apiGetVendorServices,
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: (type: ServiceType) => apiAddVendorService(type),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-services"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiRemoveVendorService(id),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      qc.invalidateQueries({ queryKey: ["vendor-services"] });
    },
  });

  const activeServices = (query.data?.data ?? []) as { id: string; serviceType: ServiceType; isActive: boolean }[];
  const activeTypes = new Set(activeServices.map((s) => s.serviceType));

  const toggleService = (type: ServiceType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existing = activeServices.find((s) => s.serviceType === type);
    if (existing) {
      Alert.alert("Remove Service", "Remove this service from your offerings?", [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeMutation.mutate(existing.id) },
      ]);
    } else {
      addMutation.mutate(type);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="My Services" subtitle="Tap to add or remove" />
      {query.isPending ? (
        <SkeletonGrid count={6} />
      ) : (
        <FlatList
          data={SERVICES}
          numColumns={2}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const active = activeTypes.has(item.type);
            return (
              <AnimatedPressable onPress={() => toggleService(item.type)} className="flex-1">
                <Card className={`items-center ${active ? "border-primary border-2" : ""}`} elevation="sm">
                  <View className="relative">
                    <View className="h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: cardColors[index % cardColors.length] }}>
                      <Text className="text-2xl">{item.emoji}</Text>
                    </View>
                    {active ? (
                      <View className="absolute -top-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <CheckIcon size={14} color="#ffffff" />
                      </View>
                    ) : (
                      <View className="absolute -top-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-muted border border-border">
                        <PlusIcon size={14} color="#6b7280" />
                      </View>
                    )}
                  </View>
                  <Text className="font-display text-sm font-bold text-foreground text-center mt-3">{item.label}</Text>
                  <Text className={`text-xs mt-1 ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {active ? "Active" : "Tap to add"}
                  </Text>
                </Card>
              </AnimatedPressable>
            );
          }}
        />
      )}
    </Screen>
  );
}
