import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Thread from "./Thread";
import { Colors } from "@/constants/Colors";

type Props = {
  id: Id<"messages">;
};

const Comments = ({ id }: Props) => {
  const comments = useQuery(api.messages.getThreadComments, { messageId: id });
  return (
    <View className="" style={{ backgroundColor: Colors.background }}>
      {comments?.map((comment) => (
        <Thread
          thread={
            comment as Doc<"messages"> & {
              creator: Doc<"users">;
            }
          }
        />
      ))}
    </View>
  );
};

export default Comments;
