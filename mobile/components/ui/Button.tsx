import React from "react";
import { Pressable, ActivityIndicator, Text, type PressableProps } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "default" | "outline" | "ghost" | "destructive" | "accent";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  default: "bg-primary",
  outline: "border-2 border-border bg-transparent",
  ghost: "bg-transparent",
  destructive: "bg-destructive",
  accent: "bg-accent",
};

const textVariants: Record<Variant, string> = {
  default: "text-primary-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  destructive: "text-destructive-foreground",
  accent: "text-accent-foreground",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 rounded-xl",
  md: "px-5 py-3.5 rounded-xl",
  lg: "px-6 py-4 rounded-2xl",
};

const textSizes: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  variant = "default",
  size = "md",
  loading = false,
  fullWidth = false,
  haptic = true,
  disabled,
  onPress,
  children,
  className,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress: PressableProps["onPress"] = (e) => {
    if (haptic && !disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={animStyle}
      className={cn(
        "flex-row items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#0d5b6b" : "#ffffff"} size="small" />
      ) : null}
      <Text className={cn("font-semibold", textVariants[variant], textSizes[size])}>
        {children}
      </Text>
    </AnimatedPressable>
  );
}
