import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetVendorListings } from "@/api/vendor";
import { apiStartConversation } from "@/api/chat";
import { formatPrice } from "@/utils";
import type { VendorListing } from "@/types";
import { CheckIcon } from "@/components/icons";

export default function ServiceDetailScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const router = useRouter();
  const meta = SERVICE_MAP[slug || ""];

  const query = useQuery({
    queryKey: ["vendor-listings", meta?.type],
    queryFn: () => apiGetVendorListings(meta?.type as any, 1, 100),
    enabled: !!meta,
    retry: false,
  });

  const listing = (query.data?.data ?? []).find((l: VendorListing) => l.id === id) as VendorListing | undefined;

  const startChatMutation = useMutation({
    mutationFn: () => apiStartConversation(listing?.vendorId || ""),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/chat");
    },
    onError: () => {
      Alert.alert("Error", "Could not start conversation. Try again.");
    },
  });

  if (!meta) {
    return <Screen><ScreenHeader title="Not found" /><EmptyState title="Listing not found" /></Screen>;
  }
  if (query.isPending) return <Screen><ScreenHeader title={meta.label} /><Spinner /></Screen>;
  if (query.isError || !listing) return <Screen><ScreenHeader title={meta.label} /><EmptyState icon={meta.emoji} title="Couldn't load listing" /></Screen>;

  const features: string[] = (listing.metadata?.features as string[]) || [];

  return (
    <Screen>
      <ScreenHeader title={meta.label} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="h-52 rounded-2xl items-center justify-center bg-muted mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
          <Text className="text-7xl">{meta.emoji}</Text>
        </View>

        <Text className="font-display text-2xl font-bold text-foreground mb-2">{listing.title}</Text>
        {listing.description ? (
          <Text className="text-base text-muted-foreground mb-4">{listing.description}</Text>
        ) : null}

        {listing.price != null ? (
          <Card className="mb-4 flex-row items-center justify-between" elevation="md">
            <View>
              <Text className="text-sm text-muted-foreground">Price</Text>
              <Text className="font-display text-2xl font-bold text-primary">{formatPrice(listing.price)}</Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Text className="text-xl">A$</Text>
            </View>
          </Card>
        ) : null}

        {features.length > 0 ? (
          <View className="mb-4">
            <Text className="font-display text-lg font-bold text-foreground mb-3">Features</Text>
            <View className="gap-2">
              {features.map((f, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-success/10">
                    <CheckIcon size={12} color="#16a34a" />
                  </View>
                  <Text className="text-sm text-foreground">{f}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Button
          onPress={() => startChatMutation.mutate()}
          loading={startChatMutation.isPending}
          fullWidth
          size="lg"
        >
          Enquire Now
        </Button>
      </ScrollView>
    </Screen>
  );
}
