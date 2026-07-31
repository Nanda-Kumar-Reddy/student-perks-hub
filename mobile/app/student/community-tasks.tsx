import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatRelativeTime, formatDate } from "@/utils";
import { apiListCommunityTasks } from "@/api/community";

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
      <ScreenHeader title="Community Tasks" right={
        <Pressable onPress={() => router.push("/student/community-tasks/new")}>
          <Text className="text-2xl text-primary">＋</Text>
        </Pressable>
      } />
      {query.isPending ? (
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon="📋" title="Couldn't load tasks" message="Try again later." />
      ) : tasks.length === 0 ? (
        <EmptyState icon="📋" title="No tasks yet" message="Be the first to post a community task." />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/student/community-tasks/${item.id}`)}>
              <Card>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-display font-bold text-foreground flex-1">{item.title}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.description}</Text>
                <View className="flex-row items-center gap-3 mt-2">
                  <Text className="text-sm font-semibold text-primary">{formatPrice(item.payment)}</Text>
                  <Text className="text-xs text-muted-foreground">{item.location}</Text>
                  <Text className="text-xs text-muted-foreground">{formatDate(item.date)}</Text>
                </View>
                <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(item.createdAt)}</Text>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
