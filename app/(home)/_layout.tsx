import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: true }} name="index" />;
    </Stack>
  );
}
