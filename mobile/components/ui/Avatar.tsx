import React from "react";
import { View, Text } from "react-native";
import { cn, initials } from "@/utils";

interface AvatarProps {
  name: string;
  url?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, url, size = 48, className }: AvatarProps) {
  const fontSize = size * 0.4;
  if (url) {
    // Using a plain Image would require expo-image or react-native Image.
    // For now, render initials in a colored circle — image support can be added later.
  }
  return (
    <View
      className={cn("items-center justify-center rounded-full bg-primary", className)}
      style={{ width: size, height: size }}
    >
      <Text
        className="font-bold text-primary-foreground"
        style={{ fontSize }}
      >
        {initials(name)}
      </Text>
    </View>
  );
}
