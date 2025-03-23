import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useUserProfile from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ProfileTabs from "./ProfileTabs";

type Props = {
  userId?: Id<"users">;
};

const UserProfile = ({ userId }: Props) => {
  const profile = useQuery(api.users.getUserById, {
    userId: userId as Id<"users">,
  });
  console.log("🚀 ~ UserProfile ~ profile:", profile);
  const { userProfile } = useUserProfile();
  const isSelf = userProfile?._id === userId;
  return (
    <View className="flex-1 p-4">
      <View className="flex-row items-center justify-between">
        <View className="gap-0 items-start">
          <Text className="text-lg font-bold">
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text className="text-base text-gray-500">@{profile?.username}</Text>
        </View>
        <Image
          source={{ uri: profile?.imageUrl }}
          className="w-16 h-16 rounded-full object-cover"
        />
      </View>
      <Text className="text-sm text-neutral-700 my-4">
        {profile?.bio || "No bio"}
      </Text>

      <View className="flex-row items-center justify-start gap-2">
        <Text>{profile?.followersCount} followers</Text>
        <View className="w-1 h-1 rounded-full bg-black" />
        <Text>{profile?.websiteUrl || "No website"}</Text>
      </View>
      <View className="flex-row items-center justify-evenly mt-4 gap-4">
        {isSelf && (
          <>
            <TouchableOpacity className="border flex-1 p-4 items-center justify-center border-gray-400 rounded-md">
              <Text className="text-center font-bold">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border flex-1 p-4 items-center justify-center border-gray-400 rounded-md">
              <Text className="text-center font-bold">Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity className=" flex-1 p-4 items-center justify-center bg-black rounded-md">
              <Text className="text-center text-white font-bold">Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity className=" flex-1 p-4 items-center justify-center bg-black rounded-md">
              <Text className="text-center text-white font-bold">Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ProfileTabs />
    </View>
  );
};

export default UserProfile;
