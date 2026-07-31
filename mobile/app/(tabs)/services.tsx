import React, { useState, useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/ui/Screen";
import { SearchBar } from "@/components/ui/SearchBar";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { SERVICES } from "@/constants/services";
import { SearchIcon } from "@/components/icons";

const cardColors = [
  "#e0f2fe", "#fff7ed", "#f0fdf4", "#e0e7ff",
  "#fce7f3", "#fef3c7", "#e0f2fe", "#fff7ed",
  "#f0fdf4", "#e0e7ff",
];

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SERVICES;
    const q = query.toLowerCase();
    return SERVICES.filter(
      (s) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Screen contentClassName="flex-1">
      <View className="px-4 pt-4 pb-2">
        <Text className="font-display text-2xl font-bold text-foreground">Services</Text>
        <Text className="text-sm text-muted-foreground mt-1">Browse all categories and find what you need</Text>
      </View>

      <View className="px-4 pb-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search services..."
          leftIcon={<SearchIcon size={20} color="#6b7280" />}
        />
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="font-display text-lg font-bold text-foreground">No services found</Text>
            <Text className="text-sm text-muted-foreground mt-1">Try a different search term</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <AnimatedPressable
            onPress={() => router.push(`/services/${item.slug}` as any)}
            className="flex-1"
          >
            <View
              className="rounded-2xl border border-border/50 bg-card p-4 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                className="mb-3 h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: cardColors[index % cardColors.length] }}
              >
                <Text className="text-3xl">{item.emoji}</Text>
              </View>
              <Text className="font-display text-sm font-bold text-foreground text-center">{item.label}</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1" numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </AnimatedPressable>
        )}
      />
    </Screen>
  );
}
