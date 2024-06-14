import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export const RoomItem = ({ room, onPress }) => {
  const { id, title, address, information, images, author } = room;

  return (
    <TouchableOpacity
      style={[
        globalStyles.item,
        { justifyContent: "flex-start", alignItems: "flex-start" },
      ]}
      onPress={onPress}
    >
      <Image
        source={{ uri: images[0] }}
        style={{ width: 150, height: 130, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
          <Ionicons name="location-outline" size={16} color="grey" />
          <Text style={{ flex: 1 }} numberOfLines={1}>
            <Text style={{ fontWeight: "bold" }}>Address: </Text>
            {address}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
          <Ionicons name="information-circle-outline" size={16} color="grey" />
          <Text style={{ flex: 1 }} numberOfLines={1}>
            <Text style={{ fontWeight: "bold" }}>Information: </Text>
            {information}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
          <Ionicons
            name="person-outline"
            size={16}
            color="grey"
            // style={styles.icon}
          />
          <Text style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>Author: {}</Text>
            {author.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
