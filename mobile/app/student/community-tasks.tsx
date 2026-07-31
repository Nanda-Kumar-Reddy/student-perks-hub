import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { FAB } from "@/components/ui/FAB";
import { formatPrice, formatRelativeTime, formatDate } from "@/utils";
import { apiListCommunityTasks } from "@/api/community";
import { PlusIcon, MapPinIcon, DollarIcon, ClockIcon } from "@/components/icons";

export default function CommunityTasksScreen() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["community-tasks"],
    queryFn: () => apiListCommunityTasks({ status: "APPROVED" }),
    retry: false,
  });

  const tasks = query.data?.data ?? [];

  return (
    <Screen>
      <ScreenHeader title="Community Tasks" showBack={false} />
      {query.isPending ? (
        <View className="gap-3 px-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : query.isError ? (
        <EmptyState icon="📋" title="Couldn't load tasks" message="Try again later." />
      ) : tasks.length === 0 ? (
        <EmptyState icon="📋" title="No tasks yet" message="Be the first to post a community task." />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AnimatedPressable onPress={() => router.push(`/student/community-tasks/${item.id}`)}>
              <Card elevation="md">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-display font-bold text-foreground flex-1">{item.title}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.description}</Text>
                <View className="flex-row flex-wrap gap-3 mt-3">
                  <View className="flex-row items-center gap-1">
                    <DollarIcon size={14} color="#0d5b6b" />
                    <Text className="text-sm font-semibold text-primary">{formatPrice(item.payment)}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPinIcon size={14} color="#6b7280" />
                    <Text className="text-xs text-muted-foreground">{item.location}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <ClockIcon size={14} color="#6b7280" />
                    <Text className="text-xs text-muted-foreground">{formatDate(item.date)}</Text>
                  </View>
                </View>
                <Text className="text-xs text-muted-foreground mt-2">{formatRelativeTime(item.createdAt)}</Text>
              </Card>
            </AnimatedPressable>
          )}
        />
      )}
      <FAB
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/student/community-tasks/new");
        }}
        icon={<PlusIcon size={28} color="#ffffff" />}
      />
    </Screen>
  );
}
