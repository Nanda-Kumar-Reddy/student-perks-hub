import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { formatTime } from "@/utils";
import { apiGetChatMessages } from "@/api/chat";
import { getSocket } from "@/services/socket";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/types";

export default function ChatConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);

  const query = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => apiGetChatMessages(id, 1, 100),
    enabled: !!id,
    retry: false,
  });

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
      }
    };

    socket.on("receiveMessage", onMessage);
    return () => {
      socket.off("receiveMessage", onMessage);
      socket.emit("leaveConversation", { conversationId: id });
    };
  }, [id]);

  const sendMessage = useCallback(() => {
    if (!text.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", { conversationId: id, messageText: text.trim() });
    }
    setText("");
  }, [id, text]);

  if (query.isPending) return <Screen><ScreenHeader title="Chat" /><Spinner /></Screen>;

  const otherName = "Conversation";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <ScreenHeader title={otherName} />
        <FlatList
          data={liveMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <View className={`flex-row ${isMe ? "justify-end" : "justify-start"}`}>
                <View className={`max-w-[75%] rounded-xl px-4 py-2 ${isMe ? "bg-primary" : "bg-muted"}`}>
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
        <View className="flex-row items-center gap-2 px-4 py-3 border-t border-border">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-base text-foreground"
          />
          <Button onPress={sendMessage} size="sm">
            Send
          </Button>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
