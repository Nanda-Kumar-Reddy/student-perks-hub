import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiForgotPassword } from "@/api/auth";
import { HttpError } from "@/api/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiForgotPassword(data.email),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <Screen contentClassName="justify-center px-6">
        <View className="items-center">
          <Text className="mb-4 text-5xl">✉️</Text>
          <Text className="font-display text-2xl font-bold text-foreground">Check your email</Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            We've sent a password reset link to your email address.
          </Text>
          <Button onPress={() => router.push("/(auth)/login")} className="mt-8" variant="outline">
            Back to login
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentClassName="justify-center px-6">
      <View className="mb-10">
        <Text className="font-display text-3xl font-bold text-primary">Reset Password</Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        {mutation.isError ? (
          <Text className="text-sm text-destructive">
            {mutation.error instanceof HttpError ? mutation.error.message : "Request failed"}
          </Text>
        ) : null}

        <Button onPress={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending} fullWidth>
          Send Reset Link
        </Button>

        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text className="text-center text-sm text-primary">Back to login</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
