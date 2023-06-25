import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useReducer, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import CheckBox from "expo-checkbox";
import { AuthContext } from "../Context";

const Profile = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [profileInfo, dispatch] = useReducer(
    (prev, action) => {
      switch (action.type) {
        case "FIRST_NAME":
          return {
            ...prev,
            firstName: action.firstName,
          };
        case "LAST_NAME":
          return {
            ...prev,
            lastName: action.lastName,
          };
        case "EMAIL":
          return {
            ...prev,
            email: action.email,
          };
        case "PHONE":
          return {
            ...prev,
            phone: action.phone,
          };
        case "NOTIFICATION":
          return {
            ...prev,
            notification: action.notification,
          };
        case "IMAGE":
          return {
            ...prev,
            image: action.image,
          };
        case "ALL":
          return {
            ...prev,
            ...action.data,
          };
      }
    },
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      image: "",
      notification: {
        orderStatuses: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
      },
    }
  );
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      dispatch({ type: "IMAGE", image: result.assets[0].uri });
    }
  };
  useEffect(() => {
    const getInfo = async () => {
      const info = await AsyncStorage.getItem("auth");
      const parseInfo = JSON.parse(info);
      // dispatch({ type: "FIRST_NAME", firstName: parseInfo.firstName });
      // dispatch({ type: "EMAIL", email: parseInfo.email });
      dispatch({ type: "ALL", data: parseInfo });
    };
    getInfo();
  }, []);
  const handleSave = async () => {
    let error = [];
    for (const prop in profileInfo) {
      if (prop !== "image" && !profileInfo[prop]) {
        error.push(`${prop} is required.`);
      } else if (prop == "phone" && profileInfo[prop].length !== 14)
        error.push("Phone is invalid");
    }
    if (error.length) return Alert.alert(error.join("\n"));
    await AsyncStorage.setItem("auth", JSON.stringify(profileInfo), (error) => {
      navigation.navigate("Profile");
      if (error) Alert.alert(error);
      else Alert.alert("Changes saved successfully");
    });
  };
  const handleLogout = async () => {
    await AsyncStorage.clear();
    signOut();
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Personal information</Text>
      <Text style={styles.subheading}>Avatar</Text>
      <View style={styles.avatarContainer}>
        {profileInfo.image ? (
          <Image
            source={{ uri: profileInfo.image }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${profileInfo.firstName}+${profileInfo.lastName}`,
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}
        <Pressable style={styles.greenBtn} onPress={pickImage}>
          <Text style={styles.greenBtnText}>Change</Text>
        </Pressable>
        <Pressable
          style={styles.outlineBtn}
          onPress={() => dispatch({ type: "IMAGE", image: "" })}
        >
          <Text style={styles.outlineBtnText}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.subheading}>First name</Text>
      <TextInput
        style={styles.input}
        value={profileInfo.firstName}
        onChangeText={(txt) => dispatch({ type: "FIRST_NAME", firstName: txt })}
      />
      <Text style={styles.subheading}>Last name</Text>
      <TextInput
        style={styles.input}
        value={profileInfo.lastName}
        onChangeText={(txt) => dispatch({ type: "LAST_NAME", lastName: txt })}
      />
      <Text style={styles.subheading}>Email</Text>
      <TextInput
        style={styles.input}
        value={profileInfo.email}
        onChangeText={(txt) => dispatch({ type: "EMAIL", email: txt })}
        keyboardType="email-address"
      />
      <Text style={styles.subheading}>Phone number</Text>
      <MaskedTextInput
        mask="(999) 999-9999"
        style={styles.input}
        value={profileInfo.phone}
        onChangeText={(txt) => dispatch({ type: "PHONE", phone: txt })}
        keyboardType="phone-pad"
      />
      <Text style={styles.heading}>Email notifications</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={profileInfo.notification.orderStatuses}
          onValueChange={(val) =>
            dispatch({
              type: "NOTIFICATION",
              notification: { ...profileInfo.notification, orderStatuses: val },
            })
          }
          color={profileInfo.notification.orderStatuses ? "#495e57" : null}
        />
        <Text>Order statuses</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={profileInfo.notification.passwordChanges}
          onValueChange={(val) =>
            dispatch({
              type: "NOTIFICATION",
              notification: {
                ...profileInfo.notification,
                passwordChanges: val,
              },
            })
          }
          color={profileInfo.notification.passwordChanges ? "#495e57" : null}
        />
        <Text>Password changes</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={profileInfo.notification.specialOffers}
          onValueChange={(val) =>
            dispatch({
              type: "NOTIFICATION",
              notification: { ...profileInfo.notification, specialOffers: val },
            })
          }
          color={profileInfo.notification.specialOffers ? "#495e57" : null}
        />
        <Text>Special offers</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={profileInfo.notification.newsletter}
          onValueChange={(val) =>
            dispatch({
              type: "NOTIFICATION",
              notification: { ...profileInfo.notification, newsletter: val },
            })
          }
          color={profileInfo.notification.newsletter ? "#495e57" : null}
        />
        <Text>Newsletter</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>Discard changes</Text>
        </Pressable>
        <Pressable style={styles.greenBtn} onPress={handleSave}>
          <Text style={styles.greenBtnText}>Save changes</Text>
        </Pressable>
      </View>
      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
};
export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  subheading: {
    color: "#777",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#333",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  greenBtn: {
    backgroundColor: "#495e57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  greenBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: "#495e57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  outlineBtnText: {
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  logout: {
    backgroundColor: "#f4ce14",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#777",
    marginVertical: 10,
  },
  logoutText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
