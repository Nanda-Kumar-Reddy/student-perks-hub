import React from "react";
import { View, Text } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";
import { apiCreateAirportPickup, apiGetMyAirportPickups } from "@/api/student";

const schema = z.object({
  flightNumber: z.string().min(2, "Flight number is required"),
  arrivalDate: z.string().min(2, "Date is required"),
  arrivalTime: z.string().min(2, "Time is required"),
  airport: z.string().min(2, "Airport is required"),
  destination: z.string().min(2, "Destination is required"),
  passengers: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AirportPickupScreen() {
  const qc = useQueryClient();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { flightNumber: "", arrivalDate: "", arrivalTime: "", airport: "", destination: "", passengers: "1", notes: "" },
  });

  const listQuery = useQuery({
    queryKey: ["my-airport-pickups"],
    queryFn: () => apiGetMyAirportPickups(1, 50),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => apiCreateAirportPickup({
      ...data,
      passengers: parseInt(data.passengers || "1", 10),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-airport-pickups"] });
      reset();
    },
  });

  const pickups = listQuery.data?.data ?? [];

  return (
    <Screen>
      <ScreenHeader title="Airport Pickup" subtitle="Request a pickup from the airport" />
      {listQuery.isPending ? <Spinner /> : (
        <Screen contentClassName="px-4 pb-6" scroll>
          <Card className="mb-4">
            <Text className="font-display text-base font-bold text-foreground mb-3">New Pickup Request</Text>
            <View className="gap-3">
              <Controller control={control} name="flightNumber" render={({ field: { onChange, value } }) => (
                <Input label="Flight Number" value={value} onChangeText={onChange} placeholder="QF123" error={errors.flightNumber?.message} />
              )} />
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Controller control={control} name="arrivalDate" render={({ field: { onChange, value } }) => (
                    <Input label="Arrival Date" value={value} onChangeText={onChange} placeholder="2025-03-15" error={errors.arrivalDate?.message} />
                  )} />
                </View>
                <View className="flex-1">
                  <Controller control={control} name="arrivalTime" render={({ field: { onChange, value } }) => (
                    <Input label="Arrival Time" value={value} onChangeText={onChange} placeholder="14:30" error={errors.arrivalTime?.message} />
                  )} />
                </View>
              </View>
              <Controller control={control} name="airport" render={({ field: { onChange, value } }) => (
                <Input label="Airport" value={value} onChangeText={onChange} placeholder="Sydney Airport" error={errors.airport?.message} />
              )} />
              <Controller control={control} name="destination" render={({ field: { onChange, value } }) => (
                <Input label="Destination" value={value} onChangeText={onChange} placeholder="123 Main St, Sydney" error={errors.destination?.message} />
              )} />
              <Controller control={control} name="passengers" render={({ field: { onChange, value } }) => (
                <Input label="Passengers" value={value} onChangeText={onChange} placeholder="1" keyboardType="numeric" />
              )} />
              <Controller control={control} name="notes" render={({ field: { onChange, value } }) => (
                <Input label="Notes (optional)" value={value} onChangeText={onChange} placeholder="Special requests" />
              )} />
            </View>
            <Button onPress={handleSubmit((d) => createMutation.mutate(d))} loading={createMutation.isPending} fullWidth className="mt-4">
              Submit Request
            </Button>
          </Card>

          <Text className="font-display text-lg font-bold text-foreground mb-3">My Requests</Text>
          {pickups.length === 0 ? (
            <EmptyState icon="✈️" title="No requests yet" message="Submit a pickup request above." />
          ) : (
            <View className="gap-3">
              {pickups.map((p: any) => (
                <Card key={p.id}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-display font-bold text-foreground">{p.flightNumber}</Text>
                    <StatusBadge status={p.status} />
                  </View>
                  <Text className="text-sm text-muted-foreground">{p.airport} → {p.destination}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{formatRelativeTime(p.createdAt)}</Text>
                </Card>
              ))}
            </View>
          )}
        </Screen>
      )}
    </Screen>
  );
}
