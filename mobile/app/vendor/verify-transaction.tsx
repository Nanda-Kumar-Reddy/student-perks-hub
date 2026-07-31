import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { request } from "@/api/client";

const schema = z.object({
  code: z.string().min(4, "Verification code is required"),
});

type FormData = z.infer<typeof schema>;

export default function VerifyTransactionScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });
  const [result, setResult] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => request<Record<string, unknown>>("POST", "/api/vendor/verify-transaction", { body: data }),
    onSuccess: (data) => setResult(JSON.stringify(data, null, 2)),
    onError: (err: Error) => setResult(err.message),
  });

  return (
    <Screen>
      <ScreenHeader title="Verify Transaction" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Card>
          <Text className="font-display text-base font-bold text-foreground mb-3">Enter verification code from the student</Text>
          <Controller control={control} name="code" render={({ field }) => (
            <Input label="Verification Code" value={field.value} onChangeText={field.onChange} placeholder="ABCD1234" error={errors.code?.message} />
          )} />
          <Button onPress={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending} fullWidth className="mt-3">
            Verify
          </Button>
          {result ? (
            <View className="mt-4 p-3 rounded-lg bg-muted">
              <Text className="text-sm text-foreground">{result}</Text>
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </Screen>
  );
}
