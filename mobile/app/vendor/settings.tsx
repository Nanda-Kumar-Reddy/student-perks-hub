import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { apiGetVendorSettings, apiUpdateVendorSettings } from "@/api/vendor";

export default function VendorSettingsScreen() {
  const qc = useQueryClient();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");

  useQuery({
    queryKey: ["vendor-settings"],
    queryFn: async () => {
      const s = await apiGetVendorSettings();
      setBusinessName((s.businessName as string) || "");
      setPhone((s.phone as string) || "");
      setAddress((s.address as string) || "");
      setAbout((s.about as string) || "");
      setCategory((s.category as string) || "");
      return s;
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: () => apiUpdateVendorSettings({ businessName, phone, address, about, category }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vendor-settings"] }),
  });

  return (
    <Screen>
      <ScreenHeader title="Vendor Settings" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card>
          <View className="gap-3">
            <Input label="Business Name" value={businessName} onChangeText={setBusinessName} placeholder="Your business" />
            <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Contact phone" keyboardType="phone-pad" />
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="Business address" />
            <Input label="Category" value={category} onChangeText={setCategory} placeholder="Service category" />
            <Input label="About" value={about} onChangeText={setAbout} placeholder="About your business" multiline />
          </View>
          <Button onPress={() => updateMutation.mutate()} loading={updateMutation.isPending} fullWidth className="mt-4">
            Save Settings
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}
