import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/utils";

type Tone = "default" | "success" | "warning" | "destructive" | "primary" | "accent";

const tones: Record<Tone, string> = {
  default: "bg-muted",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  primary: "bg-primary",
  accent: "bg-accent",
};

const textTones: Record<Tone, string> = {
  default: "text-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  destructive: "text-destructive-foreground",
  primary: "text-primary-foreground",
  accent: "text-accent-foreground",
};

interface BadgeProps {
  tone?: Tone;
  label: string;
  className?: string;
}

export function Badge({ tone = "default", label, className }: BadgeProps) {
  return (
    <View className={cn("rounded-full px-2.5 py-1", tones[tone], className)}>
      <Text className={cn("text-xs font-semibold", textTones[tone])}>{label}</Text>
    </View>
  );
}
