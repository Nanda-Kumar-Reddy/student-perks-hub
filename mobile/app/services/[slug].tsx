import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { SERVICE_MAP } from "@/constants/services";
import { apiGetVendorListings } from "@/api/vendor";
import { formatPrice } from "@/utils";
import type { VendorListing } from "@/types";
import { SearchIcon, ChevronRightIcon } from "@/components/icons";

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
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search listings..."
          leftIcon={<SearchIcon size={20} color="#6b7280" />}
        />
      </View>
      {query.isPending ? (
        <View className="gap-3 px-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
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
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AnimatedPressable onPress={() => router.push(`/services/${slug}/${item.id}` as any)}>
              <Card padded={false}>
                <View className="flex-row items-center p-4">
                  <View className="w-14 h-14 rounded-xl bg-muted items-center justify-center">
                    <Text className="text-2xl">{meta.emoji}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="font-display font-bold text-foreground">{item.title}</Text>
                    {item.description ? (
                      <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.description}</Text>
                    ) : null}
                    <View className="flex-row items-center gap-2 mt-2">
                      {item.price != null ? (
                        <Text className="text-sm font-bold text-primary">{formatPrice(item.price)}</Text>
                      ) : null}
                      {item.approvalStatus === "PENDING" ? <StatusBadge status={item.approvalStatus} /> : null}
                    </View>
                  </View>
                  <ChevronRightIcon size={20} color="#d1d5db" />
                </View>
              </Card>
            </AnimatedPressable>
          )}
        />
      )}
    </Screen>
  );
}
