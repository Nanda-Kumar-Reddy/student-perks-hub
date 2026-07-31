import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  gradient?: [string, string];
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  gradient = ["#0d5b6b", "#0e7490"],
  className,
}: MetricCardProps) {
  return (
    <View className={cn("flex-1 min-w-[45%] overflow-hidden rounded-2xl", className)}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4"
        style={{ borderRadius: 16 }}
      >
        <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-white/20">
          {icon}
        </View>
        <Text className="font-display text-2xl font-bold text-white">{value}</Text>
        <Text className="text-sm text-white/80">{label}</Text>
      </LinearGradient>
    </View>
  );
}
