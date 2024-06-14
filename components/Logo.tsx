import { Image } from "react-native";

export const Logo = () => {
  return (
    <Image
      source={require("../assets/Logo.png")}
      style={{
        height: 50,
        resizeMode: "contain",
        width: 140,
      }}
    />
  );
};
