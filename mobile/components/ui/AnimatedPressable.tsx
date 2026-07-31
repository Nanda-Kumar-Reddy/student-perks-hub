import React from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  scale?: number;
  haptic?: boolean;
  className?: string;
}

export function AnimatedPressable({
  children,
  scale: scaleTarget = 0.97,
  haptic = true,
  className,
  onPress,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressableBase
      onPressIn={() => { scale.value = withSpring(scaleTarget, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={animStyle}
      className={className}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}
