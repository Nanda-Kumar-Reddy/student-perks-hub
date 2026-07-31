import React from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";
import { cn } from "@/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn("gap-1.5", containerClassName)}>
      {label ? (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      ) : null}
      <View
        className={cn(
          "flex-row items-center rounded-lg border bg-card px-3",
          error ? "border-destructive" : "border-border"
        )}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          className={cn("flex-1 py-3 text-base text-foreground", className)}
          placeholderTextColor="#999"
          autoCapitalize="none"
          {...props}
        />
      </View>
      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : null}
    </View>
  );
}
