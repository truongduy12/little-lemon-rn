import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const [profileInfo, setProfileInfo] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const getImage = async () => {
      try {
        const data = await AsyncStorage.getItem("auth");
        setProfileInfo(JSON.parse(data));
      } catch (error) {
        Alert.alert(error);
      }
    };
    getImage();
  }, [navigation.getState()]);
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.backButton, !navigation.canGoBack() && { opacity: 0 }]}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={16} color="white" />
      </Pressable>
      <Image
        style={styles.logo}
        source={require("../assets/Logo.png")}
        resizeMode="contain"
      />
      <Pressable onPress={() => navigation.navigate("Profile")}>
        {profileInfo?.image ? (
          <Image
            source={{ uri: profileInfo?.image }}
            style={styles.avt}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${profileInfo?.firstName}+${profileInfo?.lastName}`,
            }}
            style={styles.avt}
            resizeMode="cover"
          />
        )}
      </Pressable>
    </View>
  );
};
export default Header;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  logo: {
    height: 45,
  },
  avt: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
  },
  backButton: {
    backgroundColor: "#495e57",
    borderRadius: "50%",
    padding: 10,
  },
});
