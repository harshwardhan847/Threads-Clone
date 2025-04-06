import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const Layout = (props: Props) => {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Thread",
          headerShadowVisible: false,
          headerBackTitle: "Back",
          headerTintColor: "#000",

          headerRight: () => (
            <Ionicons name="notifications-outline" size={25} color={"#000"} />
          ),
        }}
      />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
