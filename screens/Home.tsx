import { FlatList, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RoomItem } from "../components/RoomItem";
import { setRooms } from "../store";
import { globalStyles } from "../styles/globalStyles";

export const Home = () => {
  const navigation = useNavigation();
  const rooms = useSelector((state) => state.rooms);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/rooms`)
      .then((res) => res.json())
      .then((rooms) => {
        dispatch(setRooms(rooms)), setRefreshing(false);
      });
  };

  useEffect(() => {
    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/rooms`)
      .then((res) => res.json())
      .then((rooms) => dispatch(setRooms(rooms)));
  }, []);

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={rooms}
        renderItem={({ item }) => (
          <RoomItem room={item} onPress={() => navigation.navigate("RoomDetail", item)} />
        )}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={{ width: "100%" }}
      />
    </View>
  );
};
