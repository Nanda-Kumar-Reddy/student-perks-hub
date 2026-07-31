import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils";

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl border border-border bg-card",
        padded && "p-4",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
