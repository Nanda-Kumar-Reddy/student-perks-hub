import React, { useCallback, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  type FlatListProps,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface RefreshFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
  renderItem: FlatListProps<T>["renderItem"];
  onRefresh: () => void;
  refreshing: boolean;
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  contentContainerStyle?: FlatListProps<T>["contentContainerStyle"];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  numColumns?: number;
}

export function RefreshFlatList<T>({
  data,
  renderItem,
  onRefresh,
  refreshing,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.5,
  numColumns = 1,
  ...props
}: RefreshFlatListProps<T>) {
  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRefresh();
  }, [onRefresh]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#0d5b6b"
          colors={["#0d5b6b"]}
        />
      }
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        ListFooterComponent ? (
          <>{ListFooterComponent}</>
        ) : onEndReached ? (
          <ActivityIndicator color="#0d5b6b" style={{ paddingVertical: 20 }} />
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
      {...props}
    />
  );
}
