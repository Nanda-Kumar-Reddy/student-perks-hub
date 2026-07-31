import React from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
} from "react-native-reanimated";

export function Skeleton({ className, style }: { className?: string; style?: ViewStyle }) {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={className}
      style={[{ backgroundColor: "#e5e7eb", borderRadius: 8 }, animStyle, style]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="rounded-2xl border border-border/50 bg-card p-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-3 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-3 px-4 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <View className="flex-row flex-wrap gap-3 px-4 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="flex-1 min-w-[45%] rounded-2xl border border-border/50 bg-card p-4 items-center" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}>
          <Skeleton className="w-12 h-12 rounded-full mb-2" />
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-2 w-16" />
        </View>
      ))}
    </View>
  );
}
