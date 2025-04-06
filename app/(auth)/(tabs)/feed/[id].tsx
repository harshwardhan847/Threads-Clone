import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Thread from "@/components/Thread";
import useUserProfile from "@/hooks/useUserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Comments from "@/components/Comments";
import { Colors } from "@/constants/Colors";

type Props = {};

const ThreadDetailPage = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: Id<"messages"> }>();
  const thread = useQuery(api.messages.getThreadById, { messageId: id });
  const { userProfile } = useUserProfile();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "block",
        },
      });
    };
  }, []);
  return (
    <View
      className="flex-grow-[1] relative"
      style={{ backgroundColor: Colors.background }}
    >
      <ScrollView>
        {thread && (
          <View className="bg-white shadow">
            <Thread
              thread={thread as Doc<"messages"> & { creator: Doc<"users"> }}
            />
          </View>
        )}
        <View
          style={{ height: StyleSheet.hairlineWidth, backgroundColor: "#1119" }}
        />
        {thread?._id && <Comments id={thread?._id} />}
        <View className="h-32" style={{ backgroundColor: Colors.background }} />
      </ScrollView>
      <Link href={`/(auth)/(modal)/reply/${thread?._id}`} asChild>
        <TouchableOpacity className=" absolute bottom-0 left-0 right-0 ">
          <View
            style={{ paddingBottom: bottom }}
            className="bg-white border-t border-gray-400/40"
          >
            <View className="m-3 p-2 flex-row rounded-full bg-gray-300 items-center gap-2">
              <Image
                source={{ uri: userProfile?.imageUrl as string }}
                className="w-8 h-8 rounded-full"
              />
              <Text>Reply to {thread?.creator?.first_name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ThreadDetailPage;
