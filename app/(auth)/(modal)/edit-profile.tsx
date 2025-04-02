import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as ImagePicker from "expo-image-picker";
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
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const router = useRouter();
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const onDone = async () => {
    let storageId = selectedImage ? await updateProfilePicture() : null;

    const toUpdate: {
      imageUrl?: Id<"_storage">;
      bio?: string;
      websiteUrl?: string;
      pushToken?: string;
      _id: Id<"users">;
    } = {
      _id: userId,
      bio,
      websiteUrl: link,
    };
    if (selectedImage) {
      toUpdate.imageUrl = storageId as Id<"_storage">;
    }
    await updateUser(toUpdate);

    router.dismiss();
  };
  const updateProfilePicture = async () => {
    const uploadUrl = await generateUploadUrl();
    if (!selectedImage) return;
    const response = await fetch(selectedImage.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-type": selectedImage.mimeType!,
      },
    });
    const { storageId } = await result.json();

    console.log("🚀 ~ updateProfilePicture ~ storageId:", storageId);
    return storageId;
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
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
      <TouchableOpacity onPress={pickImage}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            className="w-28 self-center h-28 rounded-full object-cover"
          />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            className="w-28 self-center h-28 rounded-full object-cover"
          />
        )}
      </TouchableOpacity>
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
