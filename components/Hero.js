import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const Hero = ({ searchBarText, setSearchBarText }) => {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Little Lemon</Text>
      <View style={styles.row}>
        <View style={styles.leftText}>
          <Text style={styles.subHeading}>Chicago</Text>
          <Text style={styles.text}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist
          </Text>
        </View>
        <Image
          source={require("../assets/Hero_image.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <TextInput
        style={styles.input}
        value={searchBarText}
        onChangeText={setSearchBarText}
        placeholder="Search here"
      />
    </View>
  );
};
export default Hero;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#495e57",
    padding: 15,
  },
  heading: {
    fontSize: 50,
    color: "#f4ce14",
    fontWeight: "bold",
    fontFamily: "MarkaziText",
  },
  subHeading: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    fontFamily: "MarkaziText",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
  },
  leftText: {
    width: "60%",
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "500",
    marginTop: 25,
    fontFamily: "Karla",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    borderRadius: 5,
  },
});
