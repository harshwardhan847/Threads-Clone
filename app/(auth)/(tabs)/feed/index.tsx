import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ThreadComposer from "@/components/ThreadComposer";
import Thread from "@/components/Thread";
import { Doc } from "@/convex/_generated/dataModel";
type Props = {};

const Feed = (props: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    { initialNumItems: 5 }
  );
  const onLoadMore = () => {
    loadMore(5);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  if (status === "LoadingFirstPage") {
    return (
      <SafeAreaView
        style={{ paddingBottom: -bottom }}
        className="flex-1 items-center justify-center"
      >
        {/* <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          style={{ paddingBottom: bottom }}
          className="px-4"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-1 h-40 rounded-lg bg-gray-300" />
          )}
          keyExtractor={(item) => item.toString()}
          ItemSeparatorComponent={() => <View className="mb-4"></View>}
          ListHeaderComponent={
            <View className="flex-1 h-48 mb-4 rounded-lg bg-gray-300" />
          }
        /> */}
        <Animated.View>
          <Ionicons name="refresh-outline" size={40} className="animate-spin" />
        </Animated.View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ paddingBottom: -bottom }} className="flex-1">
      <FlatList
        data={results}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Thread
            thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
          />
        )}
        keyExtractor={(item) => item._id}
        onEndReached={onLoadMore}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ItemSeparatorComponent={() => (
          <View className="border-b border-gray-300"></View>
        )}
        ListHeaderComponent={
          <View className="pb-0">
            <Image
              source={require("@/assets/images/threads-logo-black.png")}
              className="w-12 h-12 self-center"
            />
            <ThreadComposer isPreview />
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Feed;
