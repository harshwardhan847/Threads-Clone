import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import useUserProfile from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import UserProfile from "./UserProfile";

type Props = {
  userId: Id<"users"> | undefined;
  showBackButton?: boolean;
};

const Profile = ({ userId = undefined, showBackButton = false }: Props) => {
  const { userProfile } = useUserProfile();
  console.log("🚀 ~ Profile ~ userProfile:", userProfile);
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={{ paddingTop: top }} className="flex-1 bg-white">
      <FlatList
        data={[]}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>test</Text>}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 text-lg mt-4">
            You haven't posted anything yet.
          </Text>
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
