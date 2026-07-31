import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { SERVICES } from "@/constants/services";
import { useAuthStore } from "@/store/authStore";
import { apiGetStudentBookings, apiGetStudentRequests } from "@/api/student";
import {
  CalendarIcon, ClockIcon, BriefcaseIcon, HeartIcon,
  ClipboardIcon, FileTextIcon, ChatIcon, ChevronRightIcon,
  BellIcon, CreditCardIcon, PlaneIcon, HomeIcon, CarIcon,
  CalculatorIcon, AwardIcon, UsersIcon, DollarIcon,
} from "@/components/icons";

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

  const loading = bookingsQuery.isPending || requestsQuery.isPending;
  const bookings = bookingsQuery.data?.data ?? [];
  const requests = requestsQuery.data?.data ?? [];
  const activeBookings = bookings.filter((b: any) => b.status === "pending" || b.status === "confirmed").length;
  const pendingRequests = requests.filter((r: any) => r.status === "pending").length;
  const appliedJobs = requests.filter((r: any) => r.serviceType === "JOBS").length;

  const quickActions = [
    { label: "Community Tasks", icon: <ClipboardIcon size={22} color="#0d5b6b" />, route: "/student/community-tasks", bg: "#e0f2fe" },
    { label: "Resume Builder", icon: <FileTextIcon size={22} color="#f97316" />, route: "/student/resume-builder", bg: "#fff7ed" },
    { label: "Messages", icon: <ChatIcon size={22} color="#0d5b6b" />, route: "/chat", bg: "#e0f2fe" },
    { label: "Payments", icon: <CreditCardIcon size={22} color="#16a34a" />, route: "/payments", bg: "#f0fdf4" },
  ];

  return (
    <Screen scroll contentClassName="pb-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Avatar name={user?.fullName || "Student"} url={user?.avatarUrl} size={48} />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Welcome back,</Text>
          <Text className="font-display text-xl font-bold text-foreground">
            {user?.fullName || "Student"}
          </Text>
        </View>
        <AnimatedPressable
          onPress={() => router.push("/notifications")}
          className="h-10 w-10 items-center justify-center rounded-full bg-muted"
        >
          <BellIcon size={22} color="#6b7280" />
        </AnimatedPressable>
      </View>

      {/* Metrics */}
      {loading ? (
        <View className="flex-row flex-wrap gap-3 px-4 pt-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3 px-4 pt-4">
          <MetricCard
            label="Active Bookings"
            value={activeBookings}
            icon={<CalendarIcon size={20} color="#ffffff" />}
            gradient={["#0d5b6b", "#0e7490"]}
          />
          <MetricCard
            label="Pending Requests"
            value={pendingRequests}
            icon={<ClockIcon size={20} color="#ffffff" />}
            gradient={["#f97316", "#fb923c"]}
          />
          <MetricCard
            label="Applied Jobs"
            value={appliedJobs}
            icon={<BriefcaseIcon size={20} color="#ffffff" />}
            gradient={["#6366f1", "#818cf8"]}
          />
          <MetricCard
            label="Saved"
            value={0}
            icon={<HeartIcon size={20} color="#ffffff" />}
            gradient={["#ec4899", "#f472b6"]}
          />
        </View>
      )}

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" className="pt-6" />
      <View className="flex-row flex-wrap gap-3 px-4">
        {quickActions.map((action) => (
          <AnimatedPressable
            key={action.label}
            onPress={() => router.push(action.route as any)}
            className="flex-1 min-w-[45%]"
          >
            <Card className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: action.bg }}>
                {action.icon}
              </View>
              <Text className="flex-1 text-sm font-semibold text-foreground">{action.label}</Text>
              <ChevronRightIcon size={18} color="#d1d5db" />
            </Card>
          </AnimatedPressable>
        ))}
      </View>

      {/* Browse Services */}
      <SectionHeader title="Browse Services" subtitle="Explore all categories" className="pt-6" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {SERVICES.map((s) => (
          <AnimatedPressable
            key={s.slug}
            onPress={() => router.push(`/services/${s.slug}` as any)}
            className="items-center"
          >
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/50" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
              <Text className="text-2xl">{s.emoji}</Text>
            </View>
            <Text className="mt-1.5 text-xs font-semibold text-foreground text-center" style={{ maxWidth: 72 }}>{s.label}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      {/* Recent Bookings */}
      <SectionHeader
        title="Recent Bookings"
        action={<Pressable onPress={() => router.push("/(tabs)/bookings")}><Text className="text-sm font-semibold text-primary">See all</Text></Pressable>}
        className="pt-6"
      />
      <View className="gap-3 px-4">
        {loading ? (
          <SkeletonCard />
        ) : bookings.length === 0 ? (
          <Card className="items-center py-8">
            <Text className="text-3xl mb-2">📅</Text>
            <Text className="text-sm text-muted-foreground">No bookings yet. Browse services to get started!</Text>
          </Card>
        ) : (
          bookings.slice(0, 3).map((booking: any) => (
            <Card key={booking.id} padded={false}>
              <AnimatedPressable
                onPress={() => router.push("/(tabs)/bookings")}
                className="flex-row items-center p-4"
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarIcon size={20} color="#0d5b6b" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-foreground">{booking.serviceType || "Booking"}</Text>
                  <Text className="text-xs text-muted-foreground">{booking.notes || `#${booking.id.slice(0, 8)}`}</Text>
                </View>
                <ChevronRightIcon size={18} color="#d1d5db" />
              </AnimatedPressable>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}
