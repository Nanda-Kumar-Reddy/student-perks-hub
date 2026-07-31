import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/ui/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { formatTime } from "@/utils";
import { apiGetChatMessages, apiGetConversations } from "@/api/chat";
import { getSocket } from "@/services/socket";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage, ConversationItem } from "@/types";
import { ChevronLeftIcon, SendIcon } from "@/components/icons";

export default function ChatConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const flatRef = useRef<FlatList>(null);

  const query = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => apiGetChatMessages(id, 1, 100),
    enabled: !!id,
    retry: false,
  });

  const convQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: apiGetConversations,
    retry: false,
  });

  const conversation = ((convQuery.data?.data ?? []) as ConversationItem[]).find((c) => c.id === id);
  const otherName = conversation?.otherUser.fullName || "Chat";
  const otherAvatar = conversation?.otherUser.avatarUrl;
  const isOnline = conversation?.otherUser.online;

  useEffect(() => {
    if (query.data?.data) {
      setLiveMessages(query.data.data);
    }
  }, [query.data]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;

    socket.emit("joinConversation", { conversationId: id });

    const onMessage = (msg: ChatMessage) => {
      if (msg.conversationId === id) {
        setLiveMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    socket.on("receiveMessage", onMessage);
    return () => {
      socket.off("receiveMessage", onMessage);
      socket.emit("leaveConversation", { conversationId: id });
    };
  }, [id]);

  useEffect(() => {
    if (liveMessages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [liveMessages.length]);

  const sendMessage = useCallback(() => {
    if (!text.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", { conversationId: id, messageText: text.trim() });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setText("");
  }, [id, text]);

  if (query.isPending) {
    return (
      <Screen>
        <View className="flex-row items-center px-4 py-3">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <ChevronLeftIcon size={24} color="#0d5b6b" />
          </Pressable>
          <Text className="font-display text-xl font-bold text-foreground">Chat</Text>
        </View>
        <Spinner />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen contentClassName="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-3 px-4 py-3 border-b border-border/50">
          <Pressable onPress={() => router.back()} className="p-1">
            <ChevronLeftIcon size={24} color="#0d5b6b" />
          </Pressable>
          <View className="relative">
            <Avatar name={otherName} url={otherAvatar} size={40} />
            {isOnline ? (
              <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
            ) : null}
          </View>
          <View className="flex-1">
            <Text className="font-display font-bold text-foreground">{otherName}</Text>
            <Text className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={liveMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <View className={`flex-row ${isMe ? "justify-end" : "justify-start"}`}>
                <View
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe ? "bg-primary rounded-br-md" : "bg-muted rounded-bl-md"
                  }`}
                >
                  <Text className={`text-base ${isMe ? "text-primary-foreground" : "text-foreground"}`}>
                    {item.messageText}
                  </Text>
                  <Text className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <View
          className="flex-row items-center gap-2 px-4 py-3 border-t border-border/50"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-base text-foreground"
            multiline
          />
          <Pressable
            onPress={sendMessage}
            disabled={!text.trim()}
            className={`h-11 w-11 items-center justify-center rounded-full ${text.trim() ? "bg-primary" : "bg-muted"}`}
          >
            <SendIcon size={20} color={text.trim() ? "#ffffff" : "#d1d5db"} />
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
