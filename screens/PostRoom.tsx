import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Carousel from "react-native-reanimated-carousel";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "../store";
import { globalStyles } from "../styles/globalStyles";

export const PostRoom = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userAuth.id);

  const width = Dimensions.get("window").width;
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [information, setInformation] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need photo access to upload images.");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        base64: true,
      });

      if (!result.canceled) {
        setImages(result.assets.map((image) => "data:image/jpeg;base64," + image.base64));
      }
    }
  };

  const addNewRoom = () => {
    if (title.trim() === "" || address.trim() === "") {
      setError("Title, address and information cannot be empty");
      return;
    } else {
      setError("");
    }

    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        address,
        information,
        images,
        authorId: userId,
      }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        setTitle("");
        setAddress("");
        setInformation("");

        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/rooms`)
          .then((res) => res.json())
          .then((rooms) => dispatch(setRooms(rooms)));

        navigation.navigate("HomeUser");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to create a new post. Please try again.");
      });
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={[globalStyles.inputTitle]}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={globalStyles.inputAddress}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={globalStyles.inputInformation}
        placeholder="Enter information"
        value={information}
        onChangeText={setInformation}
      />
      <TouchableOpacity style={globalStyles.inputImage} onPress={pickImage}>
        <Ionicons name="image-outline" size={24} color="grey" />
        <Text>Click to push your image</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={{ maxHeight: width * 0.25 }}>
          <Carousel
            width={width * 0.5}
            height={width * 0.25}
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
      )}

      <Text style={{ color: "red" }}>{error}</Text>
      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 20 }]}
        onPress={addNewRoom}
      >
        <Text style={globalStyles.textButton}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};
