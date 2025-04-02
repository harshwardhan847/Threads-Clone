import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  InputAccessoryView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Stack, useRouter } from "expo-router";
import useUserProfile from "@/hooks/useUserProfile";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
};

const ThreadComposer = ({ isPreview, isReply, threadId }: Props) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const INPUT_ACCESSORY_VIEW_ID = "INPUT_ACCESSORY_VIEW_ID";

  const { userProfile } = useUserProfile();
  const addThreadMessage = useMutation(api.messages.addThreadMessage);

  const handleSubmit = async () => {
    await addThreadMessage({
      content,
      threadId,
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
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel}>
              <Text className="text-blue-500">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-row items-center gap-4 mb-5 p-4 border-b border-gray-300">
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

          {/* // TODO: Make all these icons working */}
          <View className="mt-4 flex-row gap-2">
            <TouchableOpacity>
              <Ionicons name="image-outline" size={25} color={"#1119"} />
            </TouchableOpacity>
            <TouchableOpacity>
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
        <TouchableOpacity className="self-start" onPress={removeThread}>
          <Ionicons
            name="close-outline"
            className=""
            color={"#11195"}
            size={25}
          />
        </TouchableOpacity>
      </View>
      <InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}>
        <View className="flex-row items-center p-4 gap-4 pl-16">
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
      </InputAccessoryView>
    </View>
  );
};

export default ThreadComposer;
