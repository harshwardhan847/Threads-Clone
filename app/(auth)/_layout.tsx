import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/create"
        options={{
          presentation: "modal",
          title: "New Thread",
          headerRight: () => (
            <TouchableOpacity className="mr-2" onPress={() => router.back()}>
              <Ionicons name="menu" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/image/[url]"
        options={{
          presentation: "fullScreenModal",
          title: "",
          headerStyle: { backgroundColor: "black" },
          headerRight: () => (
            <TouchableOpacity className="mr-2" onPress={() => router.back()}>
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={"white"}
                size={30}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity className="mr-2" onPress={() => router.back()}>
              <Ionicons name="close" color={"white"} size={30} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modal)/edit-profile"
        options={{
          presentation: "modal",

          title: "Edit Profile",
          headerLeft: () => (
            <TouchableOpacity className="ml-2" onPress={() => router.dismiss()}>
              <Text className="">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
