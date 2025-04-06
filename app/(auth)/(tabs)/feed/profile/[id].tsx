import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Profile from "../../profile";
import { Id } from "@/convex/_generated/dataModel";

type Props = {};

const CreatorProfile = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: Id<"users"> }>();
  return <Profile userId={id} showBackButton />;
};

export default CreatorProfile;
