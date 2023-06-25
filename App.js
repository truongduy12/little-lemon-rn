import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useReducer, useState } from "react";
import Splash from "./screens/Splash";
import Profile from "./screens/Profile";
import Header from "./components/Header";
import { AuthContext } from "./Context";
import Home from "./screens/Home";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontLoaded] = useFonts({
    Karla: require("./assets/fonts/Karla-Regular.ttf"),
    MarkaziText: require("./assets/fonts/MarkaziText-Regular.ttf"),
  });
  const [authState, dispatch] = useReducer(
    (prev, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            ...prev,
            isSignOut: false,
            userInfo: action.info,
          };
        case "SIGN_OUT":
          return {
            ...prev,
            isSignOut: true,
            userInfo: null,
          };
        case "GET_AUTH":
          return {
            ...prev,
            userInfo: action.info,
            isLoading: false,
          };
      }
    },
    {
      isLoading: false,
      isSignOut: false,
      userInfo: null,
    }
  );

  useEffect(() => {
    const getAuth = async () => {
      let authInfo;
      try {
        authInfo = await AsyncStorage.getItem("auth");
      } catch (e) {
        Alert.alert(e);
        setLoggedIn(null);
      }
      dispatch({ type: "GET_AUTH", info: authInfo });
      console.log("auth:", authInfo);
    };
    getAuth();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: "SIGN_IN", info: data });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              header: (props) => <Header {...props} />,
              contentStyle: { backgroundColor: "white" },
            }}
          >
            {authState.isLoading || !fontLoaded ? (
              <Stack.Screen name="Splash" component={Splash} />
            ) : authState.userInfo == null ? (
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                  headerShown: false,
                }}
              />
            ) : (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edefee",
  },
});
