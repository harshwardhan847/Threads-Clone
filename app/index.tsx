import WelcomePage from "@/components/pages/welcome-page";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/(auth)/(tabs)/feed"} />;
  }

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <WelcomePage />
      </SignedOut>
    </View>
  );
}
