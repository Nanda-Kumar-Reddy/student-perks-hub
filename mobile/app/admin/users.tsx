import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";
import { apiGetAdminUsers } from "@/api/admin";

export default function AdminUsersScreen() {
  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiGetAdminUsers(1, 50),
    retry: false,
  });

  const users = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Users" />
      {query.isPending ? <Spinner /> : query.isError ? (
        <EmptyState icon="👥" title="Couldn't load users" message="Try again later." />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users" message="Users will appear here." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-center gap-3">
                <Avatar name={item.fullName || item.email} size={40} />
                <View className="flex-1">
                  <Text className="font-display font-bold text-foreground">{item.fullName || "Unnamed"}</Text>
                  <Text className="text-sm text-muted-foreground">{item.email}</Text>
                  <Text className="text-xs text-muted-foreground">{item.role} · {formatRelativeTime(item.createdAt)}</Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
