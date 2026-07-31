import React, { useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { apiSignup } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { HttpError } from "@/api/client";
import { MailIcon, LockIcon, UserIcon } from "@/components/icons";
import type { AppRole } from "@/types";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const roles: { label: string; value: AppRole; emoji: string }[] = [
  { label: "Student", value: "student", emoji: "🎓" },
  { label: "Vendor", value: "vendor", emoji: "🏪" },
];

export default function SignupScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [selectedRole, setSelectedRole] = useState<AppRole>("student");
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiSignup({ ...data, role: selectedRole }),
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
          <View className="flex-1 justify-center px-6" style={{ minHeight: 600 }}>
            <View className="mb-8">
              <Text className="font-display text-3xl font-bold text-foreground">Create account</Text>
              <Text className="mt-2 text-sm text-muted-foreground">Join LifeLine Australia today</Text>
            </View>

            <View className="mb-6">
              <Text className="ml-1 mb-2 text-sm font-semibold text-foreground">I am a...</Text>
              <View className="flex-row gap-3">
                {roles.map((role) => (
                  <AnimatedPressable
                    key={role.value}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedRole(role.value);
                    }}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 py-4 ${
                      selectedRole === role.value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <Text className="text-2xl">{role.emoji}</Text>
                    <Text className={`text-base font-semibold ${selectedRole === role.value ? "text-primary" : "text-foreground"}`}>
                      {role.label}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
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
                    leftIcon={<UserIcon size={20} color="#6b7280" />}
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
                    placeholder="At least 8 characters"
                    secureTextEntry
                    error={errors.password?.message}
                    leftIcon={<LockIcon size={20} color="#6b7280" />}
                  />
                )}
              />

              {mutation.isError ? (
                <View className="rounded-xl bg-destructive/10 px-4 py-3">
                  <Text className="text-sm text-destructive">
                    {mutation.error instanceof HttpError ? mutation.error.message : "Signup failed"}
                  </Text>
                </View>
              ) : null}

              <Button onPress={handleSubmit(onSubmit)} loading={mutation.isPending} fullWidth size="lg">
                Create Account
              </Button>
            </View>

            <View className="flex-row items-center justify-center gap-2 mt-8">
              <Text className="text-sm text-muted-foreground">Already have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text className="text-sm font-bold text-primary">Sign in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
