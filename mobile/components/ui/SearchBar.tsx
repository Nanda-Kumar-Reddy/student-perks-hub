import React from "react";
import { View, TextInput, type TextInputProps } from "react-native";
import { cn } from "@/utils";

interface SearchBarProps extends Omit<TextInputProps, "className"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  className,
  leftIcon,
  rightIcon,
  ...props
}: SearchBarProps) {
  return (
    <View
      className={cn(
        "flex-row items-center rounded-xl border border-border bg-card px-4 py-1",
        className
      )}
    >
      {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 py-2.5 text-base text-foreground"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {rightIcon ? <View className="ml-2.5">{rightIcon}</View> : null}
    </View>
  );
}
