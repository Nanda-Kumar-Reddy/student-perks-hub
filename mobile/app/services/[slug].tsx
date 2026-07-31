import React, { useState } from "react";
import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetVendorListings } from "@/api/vendor";
import { formatPrice } from "@/utils";
import type { VendorListing } from "@/types";

export default function ServiceListScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const meta = SERVICE_MAP[slug || ""];
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["vendor-listings", meta?.type],
    queryFn: () => apiGetVendorListings(meta?.type as any, 1, 50),
    enabled: !!meta,
    retry: false,
  });

  if (!meta) {
    return (
      <Screen>
        <ScreenHeader title="Service not found" />
        <EmptyState title="Service not found" />
      </Screen>
    );
  }

  const listings = (query.data?.data ?? []) as VendorListing[];
  const filtered = search
    ? listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
    : listings;

  return (
    <Screen>
      <ScreenHeader title={meta.label} subtitle={meta.description} />
      <View className="px-4 mb-3">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search listings..."
          placeholderTextColor="#999"
          className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
        />
      </View>
      {query.isPending ? (
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon={meta.emoji} title="Couldn't load listings" message="Try again later." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={meta.emoji} title="No listings yet" message={`No ${meta.label.toLowerCase()} available right now.`} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/services/${slug}/${item.id}`)}>
              <Card>
                <View className="flex-row items-start gap-3">
                  <View className="w-14 h-14 rounded-lg bg-muted items-center justify-center">
                    <Text className="text-3xl">{meta.emoji}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-display font-bold text-foreground">{item.title}</Text>
                    {item.description ? (
                      <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.description}</Text>
                    ) : null}
                    <View className="flex-row items-center gap-2 mt-2">
                      {item.price != null ? (
                        <Text className="text-sm font-semibold text-primary">{formatPrice(item.price)}</Text>
                      ) : null}
                      {item.approvalStatus === "PENDING" ? <StatusBadge status={item.approvalStatus} /> : null}
                    </View>
                  </View>
                  <Text className="text-muted-foreground text-lg">›</Text>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
