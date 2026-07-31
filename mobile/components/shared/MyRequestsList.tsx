import React from "react";
import { View, Text, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelativeTime } from "@/utils";

interface Props {
  title: string;
  emoji: string;
  queryKey: string[];
  fetcher: () => Promise<{ data: any[] }>;
  renderItem?: (item: any) => React.ReactNode;
}

export function MyRequestsList({ title, emoji, queryKey, fetcher, renderItem }: Props) {
  const query = useQuery({ queryKey, queryFn: fetcher, retry: false });

  return (
    <Screen>
      <ScreenHeader title={title} />
      {query.isPending ? (
        <Spinner />
      ) : query.isError ? (
        <EmptyState icon={emoji} title="Couldn't load" message="Try again later." />
      ) : (query.data?.data ?? []).length === 0 ? (
        <EmptyState icon={emoji} title="Nothing here yet" message="Your requests will appear here." />
      ) : (
        <FlatList
          data={query.data?.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            renderItem ? <>{renderItem(item)}</> : (
              <Card>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-display font-bold text-foreground flex-1">
                    {item.title || item.flightNumber || item.topic || item.service || item.certificationName || item.licenseType || item.carTitle || item.purpose || `Request #${item.id.slice(0, 8)}`}
                  </Text>
                  <StatusBadge status={item.status} />
                </View>
                {item.message || item.notes || item.description ? (
                  <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                    {item.message || item.notes || item.description}
                  </Text>
                ) : null}
                <Text className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </Card>
            )
          )}
        />
      )}
    </Screen>
  );
}
