import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { SERVICES } from "@/constants/services";
import { useAuthStore } from "@/store/authStore";
import { apiGetStudentBookings, apiGetStudentRequests } from "@/api/student";

export function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const bookingsQuery = useQuery({
    queryKey: ["student-bookings"],
    queryFn: () => apiGetStudentBookings(1, 100),
  retry: false,
  staleTime: 60_000,
  });
  const requestsQuery = useQuery({
    queryKey: ["student-requests"],
    queryFn: () => apiGetStudentRequests(1, 100),
    retry: false,
    staleTime: 60_000,
  });

  const bookings = bookingsQuery.data?.data ?? [];
  const requests = requestsQuery.data?.data ?? [];
  const activeBookings = bookings.filter((b: any) => b.status === "pending" || b.status === "confirmed").length;
  const pendingRequests = requests.filter((r: any) => r.status === "pending").length;

  const metrics = [
    { label: "Active Bookings", value: activeBookings, emoji: "📅" },
    { label: "Pending Requests", value: pendingRequests, emoji: "⏳" },
    { label: "Applied Jobs", value: requests.filter((r: any) => r.serviceType === "JOBS").length, emoji: "💼" },
    { label: "Saved", value: 0, emoji: "♡" },
  ];

  return (
    <Screen scroll contentClassName="px-4 pt-4 pb-6">
      <View className="flex-row items-center gap-3 mb-6">
        <Avatar name={user?.fullName || "Student"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Welcome back,</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Student"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3 mb-6">
        {metrics.map((m) => (
          <Card key={m.label} className="flex-1 min-w-[45%]">
            <Text className="text-2xl mb-1">{m.emoji}</Text>
            <Text className="font-display text-2xl font-bold text-primary">{m.value}</Text>
            <Text className="text-sm text-muted-foreground">{m.label}</Text>
          </Card>
        ))}
      </View>

      <Text className="font-display text-lg font-bold text-foreground mb-3">Browse Services</Text>
      <View className="flex-row flex-wrap gap-3 mb-6">
        {SERVICES.map((s) => (
          <Pressable
            key={s.slug}
            onPress={() => router.push(`/services/${s.slug}`)}
            className="flex-1 min-w-[30%] items-center p-4 rounded-xl border border-border bg-card"
          >
            <Text className="text-3xl mb-2">{s.emoji}</Text>
            <Text className="text-xs font-semibold text-foreground text-center">{s.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="font-display text-lg font-bold text-foreground mb-3">Quick Access</Text>
      <View className="gap-2">
        <Pressable onPress={() => router.push("/student/community-tasks")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Community Tasks</Text>
          <Text className="text-2xl">📋</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/student/resume-builder")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Resume Builder</Text>
          <Text className="text-2xl">📄</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/chat")} className="flex-row items-center justify-between p-4 rounded-xl border border-border bg-card">
          <Text className="font-semibold text-foreground">Messages</Text>
          <Text className="text-2xl">💬</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
