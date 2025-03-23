import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

type Props = {};

const ProfileTabs = (props: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <View className=" flex-row flex-1 justify-between items-center mt-8">
      {["Threads", "Replies", "Reposts"].map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            className="flex-1 "
            onPress={() => setActiveTab(index)}
          >
            <Text
              className={`text-lg text-center border-b-2 pb-2 ${activeTab === index ? "text-black font-semibold " : "border-gray-400 text-gray-400"}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ProfileTabs;
