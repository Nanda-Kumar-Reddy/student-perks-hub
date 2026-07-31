import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiCreateCommunityTask } from "@/api/community";
import { HttpError } from "@/api/client";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  date: z.string().min(2, "Date is required"),
  time: z.string().min(2, "Time is required"),
  duration: z.string().min(2, "Duration is required"),
  payment: z.string().min(1, "Payment is required"),
});

type FormData = z.infer<typeof schema>;

export default function NewCommunityTaskScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", category: "", description: "", location: "", date: "", time: "", duration: "", payment: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiCreateCommunityTask({ ...data, payment: parseFloat(data.payment) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-tasks"] });
      router.back();
    },
  });

  return (
    <Screen>
      <ScreenHeader title="New Task" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card>
          <View className="gap-3">
            <Controller control={control} name="title" render={({ field }) => (
              <Input label="Title" value={field.value} onChangeText={field.onChange} placeholder="Need help moving" error={errors.title?.message} />
            )} />
            <Controller control={control} name="category" render={({ field }) => (
              <Input label="Category" value={field.value} onChangeText={field.onChange} placeholder="Moving, Cleaning, etc." error={errors.category?.message} />
            )} />
            <Controller control={control} name="description" render={({ field }) => (
              <Input label="Description" value={field.value} onChangeText={field.onChange} placeholder="Describe the task..." error={errors.description?.message} multiline />
            )} />
            <Controller control={control} name="location" render={({ field }) => (
              <Input label="Location" value={field.value} onChangeText={field.onChange} placeholder="Sydney NSW" error={errors.location?.message} />
            )} />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller control={control} name="date" render={({ field }) => (
                  <Input label="Date" value={field.value} onChangeText={field.onChange} placeholder="2025-03-15" error={errors.date?.message} />
                )} />
              </View>
              <View className="flex-1">
                <Controller control={control} name="time" render={({ field }) => (
                  <Input label="Time" value={field.value} onChangeText={field.onChange} placeholder="14:00" error={errors.time?.message} />
                )} />
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Controller control={control} name="duration" render={({ field }) => (
                  <Input label="Duration" value={field.value} onChangeText={field.onChange} placeholder="2 hours" error={errors.duration?.message} />
                )} />
              </View>
              <View className="flex-1">
                <Controller control={control} name="payment" render={({ field }) => (
                  <Input label="Payment (AUD)" value={field.value} onChangeText={field.onChange} placeholder="50" keyboardType="numeric" error={errors.payment?.message} />
                )} />
              </View>
            </View>
          </View>
          {mutation.isError ? (
            <Text className="text-sm text-destructive mt-3">
              {mutation.error instanceof HttpError ? mutation.error.message : "Failed to create task"}
            </Text>
          ) : null}
          <Button onPress={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending} fullWidth className="mt-4">
            Post Task
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}
