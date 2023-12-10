import React from "react";
import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  Button,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import SignInScreen from "./SignInScreen";
import * as WebBrowser from "expo-web-browser";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

import HomeScreen from "./component/Home";
import ChatScreen from "./component/Chat";
import SettingsScreen from "./component/Settings";

const Tab = createBottomTabNavigator();

const LogoutButton = ({ onPress }) => (
  <Button title="Log Out" onPress={onPress} />
);

export default function App() {
  const [userInfo, setUserInfo] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const { height, width } = useWindowDimensions();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      "384006954461-c891ecdj0nqqnrsisshl8upmj3ln3uvm.apps.googleusercontent.com",
    iosClientId:
      "384006954461-5n5l618g2jvfno035686c1td7i36tu7n.apps.googleusercontent.com",
    androidClientId:
      "384006954461-u523ib6ms3bbmdk60smhisktjrccm6q8.apps.googleusercontent.com",
  });

  const getLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (e) {
      console.error("Error getting local user:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Add logic to sign out from Google and Firebase
    try {
      await signOut(auth);
      setUserInfo(null);
      // Optionally, you can clear any local storage or state
      // related to the user to complete the sign-out process.
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  React.useEffect(() => {
    getLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await AsyncStorage.setItem("@user", JSON.stringify(user));
          console.log(JSON.stringify(user, null, 2));
          setUserInfo(user);
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      } else {
        console.log("User not authenticated");
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userInfo ? (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused
                ? "ios-information-circle"
                : "ios-information-circle-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "ios-list" : "ios-list";
            } else if (route.name === "Chat") {
              iconName = focused ? "ios-chatbox" : "ios-chatbox-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "purple",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            position: "absolute",
            bottom: height * 0.035,
            left: width * 0.05,
            right: width * 0.05,
            borderRadius: 15,
            elevation: 0,
            backgroundColor: "#CF9FFF",
            height: height * 0.08,
          },
          tabBarItemStyle: {
            borderRadius: 15,
            bottom: -height * 0.02,
          },
          headerRight: () => <LogoutButton onPress={handleLogout} />, // <-- Add this line
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <SignInScreen promptAsync={promptAsync} />
  );
}
