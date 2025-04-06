import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {};

const Layout = (props: Props) => {
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="search/index"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <View className="bg-neutral-100 rounded-md p-[2]">
                <Ionicons
                  name={focused ? "add" : "add-outline"}
                  color={color}
                  size={size}
                  className=""
                />
              </View>
            );
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Haptics.selectionAsync();
            router.push("/(auth)/(modal)/create");
          },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          headerRight: ({}) => {
            return (
              <TouchableOpacity className="mr-4" onPress={() => signOut()}>
                <Ionicons name="log-out-outline" size={25} />
              </TouchableOpacity>
            );
          },
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={size}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default Layout;
