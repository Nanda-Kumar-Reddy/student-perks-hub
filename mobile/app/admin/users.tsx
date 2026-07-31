import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { RefreshFlatList } from "@/components/ui/RefreshFlatList";
import { formatRelativeTime } from "@/utils";
import { apiGetAdminUsers } from "@/api/admin";

export default function AdminUsersScreen() {
  const query = useQuery({ queryKey: ["admin-users"], queryFn: () => apiGetAdminUsers(1, 50), retry: false });
  const users = (query.data?.data ?? []) as any[];

  return (
    <Screen>
      <ScreenHeader title="Users" subtitle={`${users.length} registered`} showBack={false} />
      {query.isPending ? (
        <View className="gap-3 px-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></View>
      ) : query.isError ? (
        <EmptyState icon="👥" title="Couldn't load users" message="Try again later." />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users" message="Users will appear here." />
      ) : (
        <RefreshFlatList
          data={users}
          keyExtractor={(item) => item.id}
          onRefresh={() => query.refetch()}
          refreshing={query.isFetching && !query.isPending}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Card padded={false}>
              <View className="flex-row items-center p-4">
                <Avatar name={item.fullName || item.email} size={44} />
                <View className="flex-1 ml-3">
                  <Text className="font-display font-bold text-foreground">{item.fullName || "Unnamed"}</Text>
                  <Text className="text-sm text-muted-foreground">{item.email}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View className="px-2 py-0.5 rounded-full bg-primary/10">
                      <Text className="text-xs font-semibold text-primary uppercase">{item.role}</Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}
