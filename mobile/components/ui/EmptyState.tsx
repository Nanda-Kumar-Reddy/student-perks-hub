import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-16">
      {icon ? <Text className="mb-4 text-5xl opacity-30">{icon}</Text> : null}
      <Text className="font-display text-lg font-bold text-foreground">{title}</Text>
      {message ? (
        <Text className="mt-1 text-center text-sm text-muted-foreground">{message}</Text>
      ) : null}
    </View>
  );
}
