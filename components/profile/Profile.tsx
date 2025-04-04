import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import useUserProfile from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import UserProfile from "./UserProfile";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "../Thread";

type Props = {
  userId: Id<"users"> | undefined;
  showBackButton?: boolean;
};

const Profile = ({ userId = undefined, showBackButton = false }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // New state to trigger refresh
  const { userProfile } = useUserProfile();
  console.log("🚀 ~ Profile ~ userProfile:", userProfile);
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: userId ?? userProfile?._id },
    { initialNumItems: 5 }
  );
  const onLoadMore = () => {
    loadMore(5);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };
  return (
    <View style={{ paddingTop: top }} className="flex-1 bg-white">
      <FlatList
        data={results}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Thread
            thread={item as Doc<"messages"> & { creator: Doc<"users"> }}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 text-lg mt-4">
            You haven't posted anything yet.
          </Text>
        }
        onEndReached={onLoadMore}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          ></View>
        )}
        ListHeaderComponent={
          <>
            <View className="px-3 bg-white flex-row items-center justify-between">
              {showBackButton ? (
                <TouchableOpacity
                  className="flex-row gap-2 items-center justify-center"
                  onPress={() => router.back()}
                >
                  <Ionicons
                    className="text-blue-500"
                    name="chevron-back"
                    size={24}
                  />
                  <Text>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} />
              )}
              <View className="flex-row gap-4 ">
                <Ionicons name="logo-instagram" size={24} color={"black"} />
                <TouchableOpacity onPress={() => signOut()}>
                  <Ionicons name="log-out-outline" size={24} color={"black"} />
                </TouchableOpacity>
              </View>
            </View>
            {userId && <UserProfile userId={userId} />}
            {!userId && userProfile?._id && (
              <UserProfile userId={userProfile?._id} />
            )}
          </>
        }
      />
    </View>
  );
};

export default Profile;
