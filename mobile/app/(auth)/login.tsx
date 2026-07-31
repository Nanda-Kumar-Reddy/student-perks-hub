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
import { apiLogin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { HttpError } from "@/api/client";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: apiLogin,
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
        <Text className="mt-4 text-sm text-muted-foreground">Sign in to your account</Text>
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
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        {mutation.isError ? (
          <Text className="text-sm text-destructive">
            {mutation.error instanceof HttpError ? mutation.error.message : "Login failed"}
          </Text>
        ) : null}

        <Button onPress={handleSubmit(onSubmit)} loading={mutation.isPending} fullWidth>
          Sign In
        </Button>

        <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
          <Text className="text-center text-sm text-primary">Forgot password?</Text>
        </Pressable>

        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Text className="text-sm text-muted-foreground">Don't have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-sm font-semibold text-primary">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
