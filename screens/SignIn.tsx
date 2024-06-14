import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { setSignIn } from "../store";
import { globalStyles } from "../styles/globalStyles";

export const SignIn = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const login = () => {
    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((user) => {
        dispatch(setSignIn(user));
      })
      .catch((err) => {
        setError(
          "Failed to sign in. Please check your username and password and try again.",
        );
      });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}> Sign in</Text>
      <Text>use your Home Span account</Text>
      <View style={[globalStyles.inputContainer, { marginTop: 20 }]}>
        <TextInput
          style={globalStyles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
        />
        <Ionicons
          name="person-outline"
          size={24}
          color="grey"
          style={globalStyles.icon}
        />
      </View>
      <View style={globalStyles.inputContainer}>
        <TextInput
          style={globalStyles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={globalStyles.icon}>
          <Ionicons
            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="grey"
          />
        </TouchableOpacity>
      </View>
      <Text style={{ color: "red" }}>{error}</Text>
      <TouchableOpacity style={[globalStyles.button, { marginTop: 15 }]} onPress={login}>
        <Text style={globalStyles.textButton}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
