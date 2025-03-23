import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as Sentry from "@sentry/react-native";
type Props = {};

const Feed = (props: Props) => {
  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity
        onPress={() => {
          Sentry.captureException(new Error("Test Error"));
        }}
        className="bg-red-500  shadow-sm px-4 py-3 rounded-md"
      >
        <Text className="text-white">Test Error</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Feed;
