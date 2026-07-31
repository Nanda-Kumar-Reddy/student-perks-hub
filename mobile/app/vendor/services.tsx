import React from "react";
import { View, Text, FlatList, Pressable, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SERVICES } from "@/constants/services";
import { apiGetVendorServices, apiAddVendorService, apiRemoveVendorService } from "@/api/vendor";
import type { ServiceType } from "@/types";

export default function VendorServicesScreen() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["vendor-services"],
    queryFn: apiGetVendorServices,
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: (type: ServiceType) => apiAddVendorService(type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-services"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiRemoveVendorService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-services"] }),
  });

  const activeServices = (query.data?.data ?? []) as { id: string; serviceType: ServiceType; isActive: boolean }[];
  const activeTypes = new Set(activeServices.map((s) => s.serviceType));

  const toggleService = (type: ServiceType) => {
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
      {query.isPending ? <Spinner /> : (
        <FlatList
          data={SERVICES}
          numColumns={2}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const active = activeTypes.has(item.type);
            return (
              <Pressable onPress={() => toggleService(item.type)} className="flex-1">
                <Card className={`items-center ${active ? "border-primary" : ""}`}>
                  <Text className="text-4xl mb-2">{item.emoji}</Text>
                  <Text className="font-display text-sm font-bold text-foreground text-center">{item.label}</Text>
                  <Text className={`text-xs mt-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {active ? "Active" : "Tap to add"}
                  </Text>
                </Card>
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}
