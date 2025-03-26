import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity } from "react-native";

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
              <Text className="text-blue-500">Cancel</Text>
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
