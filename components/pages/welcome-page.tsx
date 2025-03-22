import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

type Props = {};

const WelcomePage = (props: Props) => {
  return (
    <View>
      <Text
        className="text-red-600"
        style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
      >
        Welcome
      </Text>
      <Link href="/(auth)/sign-in">
        <Text>Sign in</Text>
      </Link>
      <Link href="/(auth)/sign-up">
        <Text>Sign up</Text>
      </Link>
    </View>
  );
};

export default WelcomePage;
