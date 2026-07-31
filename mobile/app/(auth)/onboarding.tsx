import React, { useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Button } from "@/components/ui/Button";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const slides = [
  {
    emoji: "✈️",
    title: "Airport Pickup",
    description: "Get picked up from the airport and start your journey stress-free.",
    color: "#0d5b6b",
  },
  {
    emoji: "🏠",
    title: "Find Accommodation",
    description: "Browse verified student housing, share houses, and homestays.",
    color: "#0e7490",
  },
  {
    emoji: "💼",
    title: "Jobs & Services",
    description: "Access jobs, consultations, loans, certifications and more — all in one app.",
    color: "#f97316",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const handleScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(auth)/login");
  };

  return (
    <Screen contentClassName="flex-1">
      <View className="flex-row justify-end px-5 pt-4">
        <Pressable onPress={handleSkip}>
          <Text className="text-sm font-semibold text-muted-foreground">Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width }} className="flex-1 items-center justify-center px-8">
            <View
              className="mb-8 h-40 w-40 items-center justify-center rounded-full"
              style={{ backgroundColor: slide.color + "15" }}
            >
              <Text style={{ fontSize: 72 }}>{slide.emoji}</Text>
            </View>
            <Text className="mb-3 font-display text-2xl font-bold text-foreground">{slide.title}</Text>
            <Text className="text-center text-base text-muted-foreground">{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <View
            key={i}
            className="h-2 rounded-full"
            style={{
              width: i === index ? 24 : 8,
              backgroundColor: i === index ? "#0d5b6b" : "#d1d5db",
            }}
          />
        ))}
      </View>

      <View className="px-6 pb-10">
        <Button onPress={handleNext} fullWidth size="lg">
          {index === slides.length - 1 ? "Get Started" : "Continue"}
        </Button>
      </View>
    </Screen>
  );
}
