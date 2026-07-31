import React from "react";
import { Modal, View, Pressable, type ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { XIcon } from "@/components/icons";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function BottomSheet({ visible, onClose, title, children, style }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(400);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      translateY.value = withTiming(400, { duration: 200, easing: Easing.in(Easing.cubic) });
    }
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View
          style={[animStyle]}
          className="rounded-t-3xl bg-card pb-6"
        >
          <View className="items-center pt-3 pb-2">
            <View className="h-1.5 w-12 rounded-full bg-muted" />
          </View>
          {title ? (
            <View className="flex-row items-center justify-between px-5 pb-3">
              <View className="text-lg font-bold text-foreground" />
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}
                className="h-9 w-9 items-center justify-center rounded-full bg-muted"
              >
                <XIcon size={18} color="#6b7280" />
              </Pressable>
            </View>
          ) : null}
          {title ? (
            <View className="absolute left-5 top-3.5">
              <Animated.Text className="text-lg font-bold text-foreground">{title}</Animated.Text>
            </View>
          ) : null}
          <View style={{ paddingBottom: insets.bottom }} className="px-5">
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
