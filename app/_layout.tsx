import {
  Slot,
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import SplashScreen from "expo-splash-screen";
import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "../global.css";

import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

if (!clerkPublishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}
LogBox.ignoreLogs(["Clerk: Clerk has been loaded from development keys"]);

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  // Construct a new integration instance. This is needed to communicate between the integration and React
  const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
  });

  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
    integrations: [
      // Pass integration
      navigationIntegration,
      Sentry.mobileReplayIntegration(),
    ],
    _experiments: {
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 1.0,
    },
    profilesSampleRate: 1.0,
    attachScreenshot: true,
    enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
  });

  const { isLoaded, isSignedIn } = useAuth();
  const segment = useSegments();
  const router = useRouter();
  const ref = useNavigationContainerRef();
  const { user } = useUser();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    SplashScreen?.preventAutoHideAsync();
    if (fontsLoaded) {
      SplashScreen?.hideAsync();
    }
  }, [fontsLoaded]);
  useEffect(() => {
    if (user) {
      Sentry.setUser({
        email: user.emailAddresses[0].emailAddress,
        id: user.id,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segment[0] === "(auth)";
    if (isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/(tabs)/feed");
    } else if (!isSignedIn && inAuthGroup) {
      router.replace("/");
    }
  }, [isSignedIn]);
  return <Slot />;
};

function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
export default Sentry.wrap(RootLayout);
