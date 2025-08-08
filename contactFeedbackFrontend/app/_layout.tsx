import React, { useEffect, useState } from "react";
import { Stack, useRouter, Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("/login");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setInitialRoute("/(tabs)"); // set default screen
        } else {
          setInitialRoute("/login");
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!loading) {
      router.replace(initialRoute); // navigate only after loading
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
