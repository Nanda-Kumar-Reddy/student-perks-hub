import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice, formatDate, formatRelativeTime } from "@/utils";
import { apiGetCommunityTask, apiApplyForCommunityTask, apiGetCommunityTaskMessages, apiSendCommunityTaskMessage } from "@/api/community";

export default function CommunityTaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [applyMsg, setApplyMsg] = useState("");
  const [chatMsg, setChatMsg] = useState("");

  const taskQuery = useQuery({
    queryKey: ["community-task", id],
    queryFn: () => apiGetCommunityTask(id),
    enabled: !!id,
    retry: false,
  });

  const messagesQuery = useQuery({
    queryKey: ["community-task-messages", id],
    queryFn: () => apiGetCommunityTaskMessages(id, 1, 50),
    enabled: !!id,
    retry: false,
  });

  const applyMutation = useMutation({
    mutationFn: () => apiApplyForCommunityTask(id, applyMsg),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-task", id] });
      setApplyMsg("");
    },
  });

  const sendMsgMutation = useMutation({
    mutationFn: () => apiSendCommunityTaskMessage(id, chatMsg),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-task-messages", id] });
      setChatMsg("");
    },
  });

  if (taskQuery.isPending) return <Screen><ScreenHeader title="Task" /><Spinner /></Screen>;
  if (taskQuery.isError || !taskQuery.data)
    return <Screen><ScreenHeader title="Task" /><EmptyState icon="📋" title="Task not found" /></Screen>;

  const task = taskQuery.data;
  const messages = messagesQuery.data?.data ?? [];

  return (
    <Screen>
      <ScreenHeader title="Task Details" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-display text-xl font-bold text-foreground flex-1">{task.title}</Text>
            <StatusBadge status={task.status} />
          </View>
          <Text className="text-base text-muted-foreground mb-3">{task.description}</Text>
          <View className="gap-1">
            <Text className="text-sm text-foreground">📍 {task.location}</Text>
            <Text className="text-sm text-foreground">📅 {formatDate(task.date)} at {task.time}</Text>
            <Text className="text-sm text-foreground">⏱ {task.duration}</Text>
            <Text className="text-sm text-foreground">💰 {formatPrice(task.payment)}</Text>
            <Text className="text-sm text-muted-foreground">Posted {formatRelativeTime(task.createdAt)}</Text>
          </View>
        </Card>

        {task.status === "APPROVED" ? (
          <Card className="mb-4">
            <Text className="font-display text-base font-bold text-foreground mb-2">Apply for this task</Text>
            <TextInput
              value={applyMsg}
              onChangeText={setApplyMsg}
              placeholder="Tell the poster why you're a good fit..."
              placeholderTextColor="#999"
              multiline
              className="rounded-lg border border-border bg-card p-3 text-base text-foreground min-h-[80px]"
            />
            <Button onPress={() => applyMutation.mutate()} loading={applyMutation.isPending} className="mt-3">
              Apply
            </Button>
          </Card>
        ) : null}

        <Text className="font-display text-lg font-bold text-foreground mb-3">Messages</Text>
        {messages.length === 0 ? (
          <Text className="text-sm text-muted-foreground text-center py-4">No messages yet</Text>
        ) : (
          <View className="gap-2 mb-4">
            {messages.map((m: any) => (
              <Card key={m.id} padded={false} className="p-3">
                <Text className="text-sm text-foreground">{m.content}</Text>
                <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(m.createdAt)}</Text>
              </Card>
            ))}
          </View>
        )}
        <View className="flex-row gap-2">
          <TextInput
            value={chatMsg}
            onChangeText={setChatMsg}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
          />
          <Button onPress={() => sendMsgMutation.mutate()} loading={sendMsgMutation.isPending} size="md">
            Send
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}
