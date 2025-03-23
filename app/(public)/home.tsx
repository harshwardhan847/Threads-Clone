import { View, Text } from "react-native";
import React from "react";
import { SignOutButton } from "@/components/SignOutBtn";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "pink",
      }}
    >
      <Text>this is home page</Text>

      <SignOutButton />
    </View>
  );
};

export default HomePage;
