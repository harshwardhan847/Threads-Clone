import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Props = {};

const EditProfile = () => {
  const { bioString, linkString, userId, imageUrl } = useLocalSearchParams<{
    bioString: string;
    linkString: string;
    userId: Id<"users">;
    imageUrl: string;
  }>();
  const [bio, setBio] = useState(bioString);
  const [link, setLink] = useState(linkString);
  const updateUser = useMutation(api.users.updateUser);
  const router = useRouter();
  const onDone = async () => {
    await updateUser({
      _id: userId,
      bio,
      // imageUrl: image,
      websiteUrl: link,
    });
    router.dismiss();
  };
  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Text className="text-blue-500" onPress={onDone}>
                  Done
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      ></Stack.Screen>
      <Image
        source={{ uri: imageUrl }}
        className="w-28 self-center h-28 rounded-full object-cover"
      />
      <View className="mb-4 border m-4 border-gray-500 p-2 rounded-md">
        <Text className="text-lg font-semibold">Bio</Text>
        <TextInput
          className="font-medium text-base h-24"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tell us about yourself"
        />
      </View>
      <View className="mb-4 border m-4 border-gray-500 p-2 rounded-md">
        <Text className="text-lg font-semibold">Link</Text>
        <TextInput
          className="font-medium text-base"
          value={link}
          onChangeText={setLink}
          autoCapitalize="none"
          placeholder="https://www.example.com"
        />
      </View>
    </View>
  );
};

export default EditProfile;
