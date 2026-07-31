import React from "react";
import { Pressable, type ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
  label?: string;
  position?: "bottom-right" | "bottom-center";
  className?: string;
  style?: ViewStyle;
}

export function FAB({ onPress, icon, label, position = "bottom-right", className, style }: FABProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.9, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[animStyle, style]}
      className={cn(
        "absolute flex-row items-center justify-center gap-2 rounded-full bg-primary",
        label ? "px-6 py-4" : "h-14 w-14",
        position === "bottom-right" ? "bottom-6 right-4" : "bottom-6 self-center",
        className
      )}
    >
      {icon}
      {label ? (
        <Animated.Text className="text-base font-bold text-primary-foreground">{label}</Animated.Text>
      ) : null}
    </AnimatedPressable>
  );
}
