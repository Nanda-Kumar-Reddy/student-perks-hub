import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { formatRelativeTime } from "@/utils";
import { apiGetConversations } from "@/api/chat";
import type { ConversationItem } from "@/types";

export default function ChatListScreen() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: apiGetConversations,
    retry: false,
  });

  const conversations = (query.data?.data ?? []) as ConversationItem[];

  return (
    <Screen>
      <ScreenHeader title="Messages" showBack={false} />
      {query.isPending ? (
        <View className="gap-3 px-4 pt-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : query.isError ? (
        <EmptyState icon="💬" title="Couldn't load messages" message="Pull down to refresh or try again later." />
      ) : conversations.length === 0 ? (
        <EmptyState icon="💬" title="No conversations" message="Start a chat from any service listing." />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AnimatedPressable onPress={() => router.push(`/chat/${item.id}`)}>
              <View className="flex-row items-center gap-3 rounded-2xl border border-border/50 bg-card p-3" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
                <View className="relative">
                  <Avatar name={item.otherUser.fullName} url={item.otherUser.avatarUrl} size={48} />
                  {item.otherUser.online ? (
                    <View className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-card" />
                  ) : null}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-display font-bold text-foreground">{item.otherUser.fullName}</Text>
                    {item.lastMessage ? (
                      <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.lastMessage.createdAt)}</Text>
                    ) : null}
                  </View>
                  <View className="flex-row items-center justify-between mt-0.5">
                    <Text className="text-sm text-muted-foreground flex-1" numberOfLines={1}>
                      {item.lastMessage?.text || "Start a conversation"}
                    </Text>
                    {item.unreadCount > 0 ? (
                      <View className="ml-2 min-w-[20px] h-5 items-center justify-center rounded-full bg-primary px-1.5">
                        <Text className="text-xs font-bold text-primary-foreground">{item.unreadCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </AnimatedPressable>
          )}
        />
      )}
    </Screen>
  );
}
