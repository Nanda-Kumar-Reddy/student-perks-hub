import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeftIcon } from "@/components/icons";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, showBack = true, right }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <View className="flex-row items-center px-4 py-3">
      {showBack ? (
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <ChevronLeftIcon size={24} />
        </Pressable>
      ) : null}
      <View className="flex-1">
        <Text className="font-display text-xl font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-sm text-muted-foreground">{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View className="ml-2">{right}</View> : null}
    </View>
  );
}
