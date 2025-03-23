import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
type Props = {};

const WelcomePage = (props: Props) => {
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({
    strategy: "oauth_facebook",
  });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const handleFacebookLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startFacebookOAuthFlow();
      console.log(
        "🚀 ~ handleFacebookLogin ~ createdSessionId:",
        createdSessionId
      );
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();
      console.log(
        "🚀 ~ handleGoogleLogin ~ createdSessionId:",
        createdSessionId
      );
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      className="flex-1 gap-5 items-center w-full "
      style={{ backgroundColor: Colors.background }}
    >
      <Image
        className="w-full h-[350] object-cover "
        source={require("@/assets/images/login.png")}
      />
      <ScrollView contentContainerClassName="flex-1 gap-5 items-center">
        <Text className="text-xl " style={{ fontFamily: "DMSans_700Bold" }}>
          How would you like to use Threads?
        </Text>
        <View className="gap-5 mx-5 ">
          <TouchableOpacity
            className="p-5 border-[.5px] rounded-lg bg-white "
            style={{ borderColor: Colors.border }}
            onPress={handleFacebookLogin}
          >
            <View className="flex flex-row items-center gap-5">
              <Image
                source={require("@/assets/images/instagram_icon.webp")}
                className="w-12 h-12"
              />
              <Text
                className="text-lg text-start flex-1"
                style={{ fontFamily: "DMSans_700Medium" }}
              >
                Continue with Instagram
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text
              className="mt-2 text-sm text-neutral-500"
              style={{ fontFamily: "DMSans_400Regular" }}
            >
              Log in or create a thread profile with your Instagram account.
              With a profile you can post, interact and get personalized
              recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-5 border-[.5px] rounded-lg bg-white "
            style={{ borderColor: Colors.border }}
            onPress={handleGoogleLogin}
          >
            <View className="flex flex-row items-center gap-5">
              <Text
                className="text-lg text-start flex-1"
                style={{ fontFamily: "DMSans_700Medium" }}
              >
                Continue with Google
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-5 border-[.5px] rounded-lg bg-white "
            style={{ borderColor: Colors.border }}
          >
            <View className="flex flex-row items-center gap-5">
              <Text
                className="text-lg text-start flex-1"
                style={{ fontFamily: "DMSans_700Medium" }}
              >
                Use without a profile
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text
              className="mt-2 text-sm text-neutral-500"
              style={{ fontFamily: "DMSans_400Regular" }}
            >
              You can browse Threads without a profile, But won't be able to
              post, interact and get personalized recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="self-center">
            <Text className="text-neutral-500 text-base">Switch accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default WelcomePage;
