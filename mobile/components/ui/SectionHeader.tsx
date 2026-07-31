import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <View className={cn("flex-row items-end justify-between px-4 mb-3", className)}>
      <View className="flex-1">
        <Text className="font-display text-lg font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-sm text-muted-foreground mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
