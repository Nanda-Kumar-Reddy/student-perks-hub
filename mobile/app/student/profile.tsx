import React from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { apiGetMyProfile, apiUpdateMyProfile } from "@/api/profiles";

export default function ProfileEditScreen() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [university, setUniversity] = useState("");

  useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const p = await apiGetMyProfile();
      setFullName((p.fullName as string) || fullName);
      setPhone((p.phone as string) || "");
      setAddress((p.address as string) || "");
      setUniversity((p.university as string) || "");
      return p;
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: () => apiUpdateMyProfile({ fullName, phone, address, university }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  return (
    <Screen>
      <ScreenHeader title="Edit Profile" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <Avatar name={fullName || "User"} size={80} />
        </View>
        <Card>
          <View className="gap-3">
            <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
            <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+61..." keyboardType="phone-pad" />
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="Your address" />
            <Input label="University" value={university} onChangeText={setUniversity} placeholder="Your university" />
          </View>
          <Button onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} fullWidth className="mt-4">
            Save Changes
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}
