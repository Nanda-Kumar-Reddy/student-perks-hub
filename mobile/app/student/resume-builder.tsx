import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ResumeSection {
  id: string;
  title: string;
  items: string[];
}

export default function ResumeBuilderScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, ""] } : s))
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Resume Builder" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card className="mb-4">
          <Text className="font-display text-base font-bold text-foreground mb-3">Personal Info</Text>
          <View className="gap-3">
            <TextInput value={fullName} onChangeText={setFullName} placeholder="Full Name" placeholderTextColor="#999" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
            <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" placeholderTextColor="#999" keyboardType="phone-pad" className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground" />
            <TextInput value={summary} onChangeText={setSummary} placeholder="Professional summary..." placeholderTextColor="#999" multiline className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground min-h-[80px]" />
          </View>
        </Card>

        {sections.map((section) => (
          <Card key={section.id} className="mb-4">
            <Text className="font-display text-base font-bold text-foreground mb-3">{section.title}</Text>
            <View className="gap-2">
              {section.items.map((item, i) => (
                <TextInput
                  key={i}
                  value={item}
                  onChangeText={(v) => updateItem(section.id, i, v)}
                  placeholder={`${section.title} item...`}
                  placeholderTextColor="#999"
                  multiline
                  className="rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground"
                />
              ))}
              <Pressable onPress={() => addItem(section.id)} className="py-2">
                <Text className="text-sm text-primary">+ Add item</Text>
              </Pressable>
            </View>
          </Card>
        ))}

        <Button fullWidth size="lg">Save Resume</Button>
      </ScrollView>
    </Screen>
  );
}
