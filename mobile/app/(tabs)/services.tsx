import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { SERVICES } from "@/constants/services";

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <Screen contentClassName="px-4 pt-4">
      <Text className="font-display text-2xl font-bold text-foreground mb-4">Services</Text>
      <FlatList
        data={SERVICES}
        numColumns={2}
        keyExtractor={(item) => item.slug}
        ItemSeparatorComponent={() => <View className="h-3" />}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/services/${item.slug}`)}
            className="flex-1"
          >
            <Card className="items-center">
              <Text className="text-4xl mb-3">{item.emoji}</Text>
              <Text className="font-display text-sm font-bold text-foreground text-center">{item.label}</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1">{item.description}</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
