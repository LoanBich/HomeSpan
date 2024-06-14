import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "../store";
import { globalStyles } from "../styles/globalStyles";

import Carousel from "react-native-reanimated-carousel";

export const RoomDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userAuth.id);

  const { id, title, address, information, images, author } = route.params;
  const width = Dimensions.get("window").width;
  console.log(width);

  const deleteRoom = () => {
    fetch(
      `http://${process.env.EXPO_PUBLIC_API_URL}/rooms?roomId=${id}&userId=${userId}`,
      {
        method: "DELETE",
      },
    ).then((res) => {
      fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/rooms`)
        .then((res) => res.json())
        .then((rooms) => dispatch(setRooms(rooms)));
      navigation.goBack();
    });
  };

  return (
    <View
      style={[
        globalStyles.container,
        { alignItems: "center", justifyContent: "flex-start" },
      ]}
    >
      <View style={globalStyles.titleBackground}>
        <Text style={[globalStyles.title, { textAlign: "center" }]}> {title} </Text>
      </View>

      <View style={{ maxHeight: 300 }}>
        <Carousel
          width={width}
          height={300}
          style={{ height: 300 }}
          mode="parallax"
          data={images}
          renderItem={({ item }: { item: string }) => (
            <Image
              source={{ uri: item }}
              style={{
                flex: 1,
              }}
            />
          )}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginVertical: 10,
          alignItems: "flex-start",
        }}
      >
        <Ionicons name="location-outline" size={22} color="grey" />
        <Text style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Address: </Text>
          {address}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginVertical: 10,
          alignItems: "flex-start",
        }}
      >
        <Ionicons name="information-circle-outline" size={22} color="grey" />
        <Text style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Information: </Text>
          {information}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          marginVertical: 10,
          alignItems: "center",
        }}
      >
        <Ionicons
          name="person-outline"
          size={22}
          color="grey"
          // style={styles.icon}
        />
        <Text style={{ flex: 1, alignItems: "center", marginBottom: 2 }}>
          <Text style={{ fontWeight: "bold" }}>Author: {}</Text>
          {author.username}
        </Text>
      </View>
      {userId === author.id ? (
        <TouchableOpacity
          style={[globalStyles.button, { flexDirection: "row", marginTop: 30 }]}
          onPress={deleteRoom}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
          <Text style={globalStyles.textButton}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
