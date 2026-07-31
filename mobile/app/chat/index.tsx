import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
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
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon="💬" title="Couldn't load messages" message="Try again later." />
      ) : conversations.length === 0 ? (
        <EmptyState icon="💬" title="No conversations" message="Start a chat from any service listing." />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/chat/${item.id}`)}>
              <Card>
                <View className="flex-row items-center gap-3">
                  <Avatar name={item.otherUser.fullName} url={item.otherUser.avatarUrl} size={44} />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-display font-bold text-foreground">{item.otherUser.fullName}</Text>
                      {item.lastMessage ? (
                        <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.lastMessage.createdAt)}</Text>
                      ) : null}
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-muted-foreground flex-1" numberOfLines={1}>
                        {item.lastMessage?.text || "Start a conversation"}
                      </Text>
                      {item.unreadCount > 0 ? (
                        <View className="ml-2 rounded-full bg-destructive px-2 py-0.5">
                          <Text className="text-xs font-bold text-destructive-foreground">{item.unreadCount}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}
