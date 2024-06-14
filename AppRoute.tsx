import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { Logo } from "./components/Logo";
import { Home } from "./screens/Home";
import { HomeUser } from "./screens/HomeUser";
import { PostRoom } from "./screens/PostRoom";
import { RoomDetail } from "./screens/RoomDetail";
import { SignIn } from "./screens/SignIn";
import { globalStyles } from "./styles/globalStyles";

const Stack = createNativeStackNavigator();

export const AppRoute = () => {
  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <Logo />,
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerRight: () => {
                  return (
                    <View style={globalStyles.headerRight}>
                      <TouchableOpacity
                        style={[globalStyles.button, { marginBottom: 5 }]}
                        onPress={() => {
                          navigation.navigate("SignIn");
                        }}
                      >
                        <Text style={globalStyles.textButton}>Sign in</Text>
                      </TouchableOpacity>
                    </View>
                  );
                },
              })}
            />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="RoomDetail" component={RoomDetail} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="HomeUser"
              component={HomeUser}
              options={({ navigation }) => ({
                headerRight: () => {
                  return (
                    <View style={globalStyles.headerRight}>
                      <TouchableOpacity
                        style={[globalStyles.button, { marginBottom: 5 }]}
                        onPress={() => {
                          navigation.navigate("PostRoom");
                        }}
                      >
                        <Text style={globalStyles.textButton}>Post your room</Text>
                      </TouchableOpacity>
                    </View>
                  );
                },
              })}
            />
            <Stack.Screen name="PostRoom" component={PostRoom} />
            <Stack.Screen name="RoomDetail" component={RoomDetail} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
