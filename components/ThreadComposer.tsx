import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  InputAccessoryView,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Stack, useRouter } from "expo-router";
import useUserProfile from "@/hooks/useUserProfile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer = ({ isPreview, isReply, threadId }: Props) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const { bottom } = useSafeAreaInsets();
  const [mediaFiles, setMediaFiles] = useState<ImagePicker.ImagePickerAsset[]>(
    []
  );
  const INPUT_ACCESSORY_VIEW_ID = "INPUT_ACCESSORY_VIEW_ID";

  const { userProfile } = useUserProfile();
  const addThreadMessage = useMutation(api.messages.addThreadMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const uploadMediaFile = async (image: ImagePicker.ImagePickerAsset) => {
    if (!image) return;
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-type": image.mimeType!,
      },
    });
    const { storageId } = await result.json();

    console.log("🚀 ~ updateProfilePicture ~ storageId:", storageId);
    return storageId;
  };
  const selectImage = async (type: "library" | "camera") => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [9, 16],
    };
    let result;
    if (type === "library") {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }
    if (!result.canceled) {
      setMediaFiles([result.assets[0], ...mediaFiles]);
    }
  };
  const handleSubmit = async () => {
    const mediaIds = await Promise.all(
      mediaFiles.map((file) => uploadMediaFile(file))
    );
    console.log("🚀 ~ handleSubmit ~ mediaIds:", mediaIds);

    await addThreadMessage({
      content,
      threadId,
      mediaFiles: mediaIds,
    });

    removeThread();
    router.dismiss();
  };
  const removeThread = () => {
    setContent("");
    setWebsiteUrl("");
    setMediaFiles([]);
  };
  const handleCancel = async () => {
    setContent("");
    Alert.alert("Discard Thread?", "", [
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          router.dismiss();
        },
      },
      //   TODO: Add draft functionality
      {
        text: "Save Draft",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  return (
    <View className="flex-1 justify-between ">
      <TouchableOpacity
        onPress={() => {
          if (isPreview) {
            router.push("/(auth)/(modal)/create");
          }
        }}
        disabled={!isPreview}
        style={
          isPreview && {
            top: 0,
            left: 0,
            right: 0,
            flex: 1,
            zIndex: 1000,
            pointerEvents: "box-only",
          }
        }
      >
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={handleCancel}>
                <Text className="text-blue-500">Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View
          className={`flex-row items-center gap-4 p-4 border-b border-gray-300 ${!isPreview && "mb-5"}`}
        >
          {/*// TODO: Add fallback image url */}
          <Image
            source={{ uri: userProfile?.imageUrl ?? "" }}
            className="w-14 h-14 rounded-full self-start"
          />
          <View className="flex-col flex-1">
            <Text className="text-lg font-bold">
              {userProfile?.first_name} {userProfile?.last_name}
            </Text>
            <TextInput
              className="text-base max-h-24"
              placeholder={isReply ? "Reply to thread" : "What's new?"}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus={!isPreview}
              inputAccessoryViewID={INPUT_ACCESSORY_VIEW_ID}
            />
            {mediaFiles?.length > 0 && (
              <ScrollView horizontal className="pt-8">
                {mediaFiles.map((item, index) => (
                  <View
                    key={index}
                    className="min-h-40 relative aspect-[12/16] mr-4"
                  >
                    <Image
                      source={{ uri: item.uri }}
                      className=" w-full h-full object-cover rounded-lg"
                    />
                    <TouchableOpacity
                      className="absolute top-0 right-0  m-1 bg-black/40 rounded-md"
                      onPress={() =>
                        setMediaFiles(mediaFiles?.filter((_, i) => i !== index))
                      }
                    >
                      <Ionicons
                        name="close"
                        size={15}
                        color={"#fff"}
                        className="p-1"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* // TODO: Make all these icons working */}
            <View className="mt-4 flex-row gap-2">
              <TouchableOpacity onPress={() => selectImage("library")}>
                <Ionicons name="image-outline" size={25} color={"#1119"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectImage("camera")}>
                <Ionicons name="camera-outline" size={25} color={"#1119"} />
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center">
                <Text
                  style={{ color: "#1119" }}
                  className="flex items-center justify-center text-center"
                >
                  gif
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {!isPreview && (
            <TouchableOpacity className="self-start" onPress={removeThread}>
              <Ionicons
                name="close-outline"
                className=""
                color={"#11195"}
                size={25}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {/* <InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}> */}

      {!isPreview && (
        <View
          style={{ paddingBottom: bottom }}
          className="flex-row items-center p-4 gap-4 pl-16 bg-white"
        >
          <Text className="flex-1 text-gray-500 text-lg">
            {isReply
              ? "Everyone can reply or quote"
              : "Profiles that you follow can reply or quote"}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-black p-4 px-6 rounded-full"
          >
            <Text className="text-white font-bold">Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* </InputAccessoryView> */}
    </View>
  );
};

export default ThreadComposer;
