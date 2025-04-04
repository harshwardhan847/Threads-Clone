import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
type Props = {};

const ImageZoomPreview = (props: Props) => {
  const { url } = useLocalSearchParams<{ url: string }>();
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-black">
        <ImageZoom
          uri={url}
          resizeMode={"contain"}
          minScale={1}
          maxScale={3}
          className="w-full h-full"
          isPinchEnabled
          isDoubleTapEnabled
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ImageZoomPreview;
