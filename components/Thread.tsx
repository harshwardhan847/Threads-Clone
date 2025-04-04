import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  thread: Doc<"messages"> & {
    creator: Doc<"users">;
  };
};

const Thread = ({ thread }: Props) => {
  const likeThread = useMutation(api.messages.likeThread);

  return (
    <View className="p-4 flex-row">
      <Image
        source={{ uri: thread.creator.imageUrl }}
        className="w-14 h-14 rounded-full mr-5"
      />
      <View className="flex-1 ">
        {/* Header */}
        <View className="justify-between flex-row items-start">
          <View className="flex-row gap-2 items-center justify-start">
            <Text className="font-bold text-lg flex items-center justify-center">
              {thread.creator.first_name} {thread.creator?.last_name}
            </Text>
            <Text className="text-sm flex items-center justify-center text-gray-600">
              {new Date(thread._creationTime).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons
            name="ellipsis-horizontal-outline"
            size={25}
            color={"#111"}
          />
        </View>
        <Text className="text-lg mb-0">{thread.content}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          {thread.mediaFiles?.map((imageUrl, index) => (
            <TouchableOpacity key={index} className="">
              <View className="h-48 mb-2 bg-gray-200 overflow-hidden rounded-lg shadow-sm relative aspect-square mr-4">
                <Image
                  source={{ uri: imageUrl }}
                  className="object-cover w-full h-full "
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Actions */}
        <View className="flex-row gap-4 items-center justify-start mt-4">
          {/* //TODO: user can only like once and heart red on like */}
          <TouchableOpacity
            onPress={() => likeThread({ threadId: thread?._id })}
            className="flex-row gap-2 items-center justify-start"
          >
            <Ionicons name="heart-outline" size={25} />
            <Text className="text-lg">{thread?.likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-2 items-center justify-start">
            <Ionicons name="chatbubble-outline" size={25} />
            <Text className="text-lg">{thread?.commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-2 items-center justify-start">
            <Ionicons name="repeat-outline" size={25} />
            <Text className="text-lg">{thread?.retweetCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-2 items-center justify-start">
            <Ionicons name="share-outline" size={25} className="mb-1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Thread;
