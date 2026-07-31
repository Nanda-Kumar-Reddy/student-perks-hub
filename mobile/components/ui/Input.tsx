import React, { useState } from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";
import { cn } from "@/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={cn("gap-1.5", containerClassName)}>
      {label ? (
        <Text className="ml-1 text-sm font-semibold text-foreground">{label}</Text>
      ) : null}
      <View
        className={cn(
          "flex-row items-center rounded-xl border bg-card px-4",
          error ? "border-destructive" : focused ? "border-primary" : "border-border",
          focused && "shadow-sm"
        )}
        style={focused ? { shadowColor: "#0d5b6b", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 1 } : undefined}
      >
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <TextInput
          className={cn("flex-1 py-3.5 text-base text-foreground", className)}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
        {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text className="ml-1 text-xs text-destructive">{error}</Text>
      ) : null}
    </View>
  );
}
