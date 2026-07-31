import React from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Chip({ label, active = false, onPress, className }: ChipProps) {
  return (
    <Pressable
      onPress={() => {
        if (onPress) Haptics.selectionAsync();
        onPress?.();
      }}
      className={cn(
        "rounded-full px-4 py-2",
        active ? "bg-primary" : "bg-muted border border-border",
        className
      )}
    >
      <Text className={cn("text-sm font-semibold", active ? "text-primary-foreground" : "text-muted-foreground")}>
        {label}
      </Text>
    </Pressable>
  );
}
