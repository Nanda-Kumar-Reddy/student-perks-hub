import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatRelativeTime } from "@/utils";
import type { ServiceMeta } from "@/constants/services";

interface GenericServiceScreenProps {
  meta: ServiceMeta;
  fetcher: (page?: number, limit?: number) => Promise<{ data: any[] }>;
  creator: (data: Record<string, unknown>) => Promise<unknown>;
  formFields: { key: string; label: string; placeholder: string; keyboardType?: "default" | "numeric" | "email-address"; multiline?: boolean }[];
}

export function GenericServiceScreen({ meta, fetcher, creator, formFields }: GenericServiceScreenProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const query = useQuery({
    queryKey: [`my-${meta.slug}`],
    queryFn: () => fetcher(1, 50),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () => creator(form),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: [`my-${meta.slug}`] });
      setShowForm(false);
      setForm({});
      Alert.alert("Success", "Your request has been submitted!");
    },
    onError: () => Alert.alert("Error", "Could not submit request. Try again."),
  });

  const requests = query.data?.data ?? [];

  return (
    <Screen>
      <ScreenHeader title={meta.label} subtitle={meta.description} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card className="mb-4 items-center" elevation="md">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
            <Text className="text-3xl">{meta.emoji}</Text>
          </View>
          <Text className="font-display text-lg font-bold text-foreground text-center">{meta.label}</Text>
          <Text className="text-sm text-muted-foreground text-center mt-1">{meta.description}</Text>
          <Button onPress={() => setShowForm(!showForm)} className="mt-4" fullWidth>
            {showForm ? "Cancel" : `Request ${meta.label}`}
          </Button>
        </Card>

        {showForm ? (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Card className="gap-3 mb-4" elevation="md">
              {formFields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  value={form[field.key] || ""}
                  onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  multiline={field.multiline}
                />
              ))}
              <Button onPress={() => mutation.mutate()} loading={mutation.isPending} fullWidth size="lg">
                Submit Request
              </Button>
            </Card>
          </KeyboardAvoidingView>
        ) : null}

        <Text className="font-display text-lg font-bold text-foreground mb-3">My Requests</Text>
        {query.isPending ? (
          <View className="gap-3"><SkeletonCard /><SkeletonCard /></View>
        ) : query.isError ? (
          <EmptyState icon={meta.emoji} title="Couldn't load requests" />
        ) : requests.length === 0 ? (
          <EmptyState icon={meta.emoji} title="No requests yet" message={`Submit a ${meta.label.toLowerCase()} request above.`} />
        ) : (
          <View className="gap-3">
            {requests.map((req: any) => (
              <Card key={req.id} padded={false}>
                <View className="flex-row items-center p-4">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Text className="text-xl">{meta.emoji}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-foreground">{req.title || req.serviceType || meta.label}</Text>
                      <StatusBadge status={req.status} />
                    </View>
                    <Text className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(req.createdAt)}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
