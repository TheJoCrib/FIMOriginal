import React from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";

export default function SignInScreen({ promptAsync }) {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          backgroundColor: "#4285F4",
          width: "90%",
          padding: 10,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 15, // Add this for spacing
          marginTop: 350, // Keep one marginTop property
        }}
        onPress={() => promptAsync()}
      >
        {/* Add your child components here */}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
