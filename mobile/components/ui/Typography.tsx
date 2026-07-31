import React from "react";
import { Text, type TextProps } from "react-native";
import { cn } from "@/utils";

type Variant = "display" | "h1" | "h2" | "h3" | "body" | "small" | "muted";

const variants: Record<Variant, string> = {
  display: "font-display text-3xl font-bold text-foreground",
  h1: "font-display text-2xl font-bold text-foreground",
  h2: "font-display text-xl font-bold text-foreground",
  h3: "font-display text-lg font-semibold text-foreground",
  body: "text-base text-foreground",
  small: "text-sm text-foreground",
  muted: "text-sm text-muted-foreground",
};

interface TypographyProps extends TextProps {
  variant?: Variant;
}

export function Typography({ variant = "body", className, children, ...props }: TypographyProps) {
  return (
    <Text className={cn(variants[variant], className)} {...props}>
      {children}
    </Text>
  );
}
