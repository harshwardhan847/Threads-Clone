import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Thread from "@/components/Thread";
import ThreadComposer from "../create";

type Props = {};

const Reply = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: Id<"messages"> }>();
  const thread = useQuery(api.messages.getThreadById, { messageId: id });
  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {thread ? (
          <Thread
            thread={thread as Doc<"messages"> & { creator: Doc<"users"> }}
          />
        ) : (
          <ActivityIndicator />
        )}
        <ThreadComposer isReply threadId={thread?._id} />
      </ScrollView>
    </View>
  );
};

export default Reply;
