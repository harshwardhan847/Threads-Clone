import { View, RefreshControl, Image, TouchableOpacity } from "react-native";
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
import { Link, useNavigation } from "expo-router";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
type Props = {};

const Feed = (props: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // New state to trigger refresh

  const { bottom } = useSafeAreaInsets();
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.messages.getThreads,
    { refreshKey },
    { initialNumItems: 5 }
  );

  //Animation
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  const updateTabBar = () => {
    if (!isFocused) return;
    let newMarginBottom = 0;
    if (scrollOffset.value >= 0 && scrollOffset.value <= tabBarHeight) {
      newMarginBottom = -scrollOffset.value;
    } else if (scrollOffset.value > tabBarHeight) {
      newMarginBottom = -tabBarHeight;
    }
    navigation?.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    });
  };
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocused) {
        scrollOffset.value = event.contentOffset.y;
        runOnJS(updateTabBar)();
      }
    },
  });

  const onLoadMore = () => {
    loadMore(5);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
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
      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={results}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/(auth)/(tabs)/feed/${item._id}`} asChild>
            <TouchableOpacity>
              <Thread
                thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
              />
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item._id}
        onEndReached={onLoadMore}
        ListFooterComponent={
          status === "LoadingMore" ? (
            <Animated.View className="w-full items-center justify-center">
              <View className="">
                <Ionicons
                  name="sync-outline"
                  size={30}
                  className="animate-spin"
                />
              </View>
            </Animated.View>
          ) : null
        }
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
