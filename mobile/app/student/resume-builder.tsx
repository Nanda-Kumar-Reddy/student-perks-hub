import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { PlusIcon, FileTextIcon, CheckIcon } from "@/components/icons";

interface ResumeSection {
  id: string;
  title: string;
  items: string[];
}

export default function ResumeBuilderScreen() {
  const user = useAuthStore((s) => s.user);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [sections, setSections] = useState<ResumeSection[]>([
    { id: "education", title: "Education", items: [""] },
    { id: "experience", title: "Experience", items: [""] },
    { id: "skills", title: "Skills", items: [""] },
  ]);

  const updateItem = (sectionId: string, index: number, value: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((item, i) => (i === index ? value : item)) }
          : s
      )
    );
  };

  const addItem = (sectionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, ""] } : s))
    );
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved", "Your resume has been saved locally.");
  };

  return (
    <Screen>
      <ScreenHeader title="Resume Builder" subtitle="Create your professional resume" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Personal Info */}
        <Card className="mb-4" elevation="md">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FileTextIcon size={18} color="#0d5b6b" />
            </View>
            <Text className="font-display text-base font-bold text-foreground">Personal Info</Text>
          </View>
          <View className="gap-3">
            <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
            <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+61..." keyboardType="phone-pad" />
            <Input label="Professional Summary" value={summary} onChangeText={setSummary} placeholder="Brief summary of your profile..." multiline />
          </View>
        </Card>

        {/* Sections */}
        {sections.map((section) => (
          <Card key={section.id} className="mb-4" elevation="sm">
            <Text className="font-display text-base font-bold text-foreground mb-3">{section.title}</Text>
            <View className="gap-2">
              {section.items.map((item, i) => (
                <TextInput
                  key={i}
                  value={item}
                  onChangeText={(v) => updateItem(section.id, i, v)}
                  placeholder={`${section.title} item...`}
                  placeholderTextColor="#9ca3af"
                  multiline
                  className="rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
                />
              ))}
              <Pressable
                onPress={() => addItem(section.id)}
                className="flex-row items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/30"
              >
                <PlusIcon size={18} color="#0d5b6b" />
                <Text className="text-sm font-semibold text-primary">Add item</Text>
              </Pressable>
            </View>
          </Card>
        ))}

        <Button onPress={handleSave} fullWidth size="lg">
          Save Resume
        </Button>
      </ScrollView>
    </Screen>
  );
}
