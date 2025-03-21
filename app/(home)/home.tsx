import { View, Text } from "react-native";
import React from "react";

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
        backgroundColor: "red",
      }}
    >
      <Text>this is home page</Text>
    </View>
  );
};

export default HomePage;
