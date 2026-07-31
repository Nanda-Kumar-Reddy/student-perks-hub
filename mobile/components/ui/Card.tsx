import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils";

interface CardProps extends ViewProps {
  padded?: boolean;
  elevation?: "none" | "sm" | "md" | "lg";
}

const elevationStyles: Record<string, ViewProps["style"]> = {
  none: {},
  sm: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
};

export function Card({ padded = true, elevation = "sm", className, style, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-border/50 bg-card",
        padded && "p-4",
        className
      )}
      style={[elevationStyles[elevation], style]}
      {...props}
    >
      {children}
    </View>
  );
}
