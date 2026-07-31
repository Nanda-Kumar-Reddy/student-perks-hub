import React from "react";
import { View, ScrollView, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/utils";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
  style?: ViewStyle;
}

export function Screen({ children, scroll = false, className, contentClassName, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const Container = scroll ? ScrollView : View;
  return (
    <View
      className={cn("flex-1 bg-background", className)}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, ...style }}
    >
      <Container
        className={cn("flex-1", contentClassName)}
        contentContainerStyle={scroll ? { flexGrow: 1 } : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </View>
  );
}
