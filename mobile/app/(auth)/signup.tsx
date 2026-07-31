import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiSignup } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { HttpError } from "@/api/client";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiSignup(data),
    onSuccess: (data) => {
      setUser(data.user);
      router.replace(`/(tabs)/${data.user.role}`);
    },
  });

  const onSubmit = (values: FormData) => mutation.mutate(values);

  return (
    <Screen scroll contentClassName="justify-center px-6">
      <View className="mb-10">
        <Text className="font-display text-4xl font-bold text-primary">LifeLine</Text>
        <Text className="font-display text-2xl text-muted-foreground">Australia</Text>
        <Text className="mt-4 text-sm text-muted-foreground">Create your student account</Text>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Full Name"
              value={value}
              onChangeText={onChange}
              placeholder="John Doe"
              error={errors.fullName?.message}
            />
          )}
        />
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
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              placeholder="At least 8 characters"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        {mutation.isError ? (
          <Text className="text-sm text-destructive">
            {mutation.error instanceof HttpError ? mutation.error.message : "Signup failed"}
          </Text>
        ) : null}

        <Button onPress={handleSubmit(onSubmit)} loading={mutation.isPending} fullWidth>
          Create Account
        </Button>

        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Text className="text-sm text-muted-foreground">Already have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="text-sm font-semibold text-primary">Sign in</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
