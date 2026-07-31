import React from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiLogin } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { HttpError } from "@/api/client";
import { MailIcon, LockIcon } from "@/components/icons";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <Screen contentClassName="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6" style={{ minHeight: 500 }}>
            <View className="items-center mb-12">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-primary">
                <Text className="text-4xl">🇦🇺</Text>
              </View>
              <Text className="font-display text-3xl font-bold text-foreground">Welcome back</Text>
              <Text className="mt-2 text-sm text-muted-foreground">Sign in to your LifeLine account</Text>
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
                    leftIcon={<MailIcon size={20} color="#6b7280" />}
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
                    leftIcon={<LockIcon size={20} color="#6b7280" />}
                  />
                )}
              />

              {mutation.isError ? (
                <View className="rounded-xl bg-destructive/10 px-4 py-3">
                  <Text className="text-sm text-destructive">
                    {mutation.error instanceof HttpError ? mutation.error.message : "Login failed. Check your credentials."}
                  </Text>
                </View>
              ) : null}

              <Pressable onPress={() => router.push("/(auth)/forgot-password")} className="self-end">
                <Text className="text-sm font-semibold text-primary">Forgot password?</Text>
              </Pressable>

              <Button onPress={handleSubmit(onSubmit)} loading={mutation.isPending} fullWidth size="lg">
                Sign In
              </Button>
            </View>

            <View className="flex-row items-center justify-center gap-2 mt-8">
              <Text className="text-sm text-muted-foreground">Don't have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-sm font-bold text-primary">Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
