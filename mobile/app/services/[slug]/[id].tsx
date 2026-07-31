import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
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

export default function ServiceDetailScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const router = useRouter();
  const meta = SERVICE_MAP[slug || ""];
  const [enquiring, setEnquiring] = useState(false);

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
      setEnquiring(false);
      router.push("/chat");
    },
    onError: () => {
      setEnquiring(false);
      Alert.alert("Error", "Could not start conversation. Try again.");
    },
  });

  const handleEnquire = () => {
    setEnquiring(true);
    startChatMutation.mutate();
  };

  if (!meta) {
    return (
      <Screen>
        <ScreenHeader title="Not found" />
        <EmptyState title="Listing not found" />
      </Screen>
    );
  }

  if (query.isPending) return <Screen><ScreenHeader title={meta.label} /><Spinner /></Screen>;
  if (query.isError || !listing)
    return (
      <Screen>
        <ScreenHeader title={meta.label} />
        <EmptyState icon={meta.emoji} title="Couldn't load listing" message="Try again later." />
      </Screen>
    );

  const features: string[] = (listing.metadata?.features as string[]) || [];

  return (
    <Screen>
      <ScreenHeader title={meta.label} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card padded={false} className="overflow-hidden mb-4">
          <View className="h-48 items-center justify-center bg-muted">
            <Text className="text-6xl">{meta.emoji}</Text>
          </View>
        </Card>

        <Text className="font-display text-2xl font-bold text-foreground mb-2">{listing.title}</Text>
        {listing.description ? (
          <Text className="text-base text-muted-foreground mb-4">{listing.description}</Text>
        ) : null}

        {listing.price != null ? (
          <Card className="mb-4 flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">Price</Text>
            <Text className="font-display text-xl font-bold text-primary">{formatPrice(listing.price)}</Text>
          </Card>
        ) : null}

        {features.length > 0 ? (
          <View className="mb-4">
            <Text className="font-display text-lg font-bold text-foreground mb-2">Features</Text>
            <View className="flex-row flex-wrap gap-2">
              {features.map((f, i) => (
                <View key={i} className="rounded-lg bg-muted px-3 py-1.5">
                  <Text className="text-sm text-foreground">{f}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Button onPress={handleEnquire} loading={enquiring} fullWidth size="lg">
          Enquire Now
        </Button>
      </ScrollView>
    </Screen>
  );
}
