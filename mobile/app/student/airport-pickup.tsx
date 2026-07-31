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
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { apiCreateAirportPickup, apiGetMyAirportPickups } from "@/api/student";
import { formatRelativeTime } from "@/utils";
import { PlaneIcon, ClockIcon, MapPinIcon } from "@/components/icons";

export default function AirportPickupScreen() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ flightNumber: "", arrivalDate: "", arrivalTime: "", pickupLocation: "", dropoffLocation: "", passengers: "1", notes: "" });

  const query = useQuery({
    queryKey: ["my-airport-pickups"],
    queryFn: () => apiGetMyAirportPickups(1, 50),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () => apiCreateAirportPickup(form),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["my-airport-pickups"] });
      setShowForm(false);
      setForm({ flightNumber: "", arrivalDate: "", arrivalTime: "", pickupLocation: "", dropoffLocation: "", passengers: "1", notes: "" });
      Alert.alert("Success", "Your airport pickup request has been submitted!");
    },
    onError: () => Alert.alert("Error", "Could not submit request. Try again."),
  });

  const requests = query.data?.data ?? [];

  return (
    <Screen>
      <ScreenHeader title="Airport Pickup" subtitle="Get picked up from the airport" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card className="mb-4 items-center" elevation="md">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
            <PlaneIcon size={32} color="#0d5b6b" />
          </View>
          <Text className="font-display text-lg font-bold text-foreground text-center">Need a ride from the airport?</Text>
          <Text className="text-sm text-muted-foreground text-center mt-1">Request a pickup and a vendor will be assigned to you.</Text>
          <Button onPress={() => setShowForm(!showForm)} className="mt-4" fullWidth>
            {showForm ? "Cancel" : "Request Pickup"}
          </Button>
        </Card>

        {showForm ? (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Card className="gap-3 mb-4" elevation="md">
              <Input label="Flight Number" value={form.flightNumber} onChangeText={(v) => setForm({ ...form, flightNumber: v })} placeholder="QF123" />
              <Input label="Arrival Date" value={form.arrivalDate} onChangeText={(v) => setForm({ ...form, arrivalDate: v })} placeholder="2024-03-15" />
              <Input label="Arrival Time" value={form.arrivalTime} onChangeText={(v) => setForm({ ...form, arrivalTime: v })} placeholder="14:30" />
              <Input label="Pickup Location" value={form.pickupLocation} onChangeText={(v) => setForm({ ...form, pickupLocation: v })} placeholder="Sydney Airport - Terminal 1" leftIcon={<MapPinIcon size={20} color="#6b7280" />} />
              <Input label="Drop-off Location" value={form.dropoffLocation} onChangeText={(v) => setForm({ ...form, dropoffLocation: v })} placeholder="Your address" leftIcon={<MapPinIcon size={20} color="#6b7280" />} />
              <Input label="Passengers" value={form.passengers} onChangeText={(v) => setForm({ ...form, passengers: v })} placeholder="1" keyboardType="numeric" />
              <Input label="Notes (optional)" value={form.notes} onChangeText={(v) => setForm({ ...form, notes: v })} placeholder="Any special requirements" multiline />
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
          <EmptyState icon="✈️" title="Couldn't load requests" />
        ) : requests.length === 0 ? (
          <EmptyState icon="✈️" title="No requests yet" message="Submit a pickup request above." />
        ) : (
          <View className="gap-3">
            {requests.map((req: any) => (
              <Card key={req.id} padded={false}>
                <View className="flex-row items-center p-4">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <PlaneIcon size={20} color="#0d5b6b" />
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-foreground">{req.flightNumber || "Flight"}</Text>
                      <StatusBadge status={req.status} />
                    </View>
                    <Text className="text-xs text-muted-foreground mt-0.5">
                      {formatRelativeTime(req.createdAt)}
                    </Text>
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
