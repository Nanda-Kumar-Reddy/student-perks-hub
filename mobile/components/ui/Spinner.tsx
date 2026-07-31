import React from "react";
import { View, ActivityIndicator } from "react-native";

export function Spinner({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size={size} color="#0d5b6b" />
    </View>
  );
}
