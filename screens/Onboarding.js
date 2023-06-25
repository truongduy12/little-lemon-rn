import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";

const Onboarding = ({ navigation }) => {
  const [name, handleChangeName] = useState("");
  const [email, handleChangeEmail] = useState("");
  const [formValid, setFormValid] = useState(false);
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    if (/\w/.test(name) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      setFormValid(true);
    else setFormValid(false);
  }, [name, email]);

  const handleClick = () => {
    const data = JSON.stringify({
      firstName: name,
      email: email,
    });
    AsyncStorage.setItem("auth", data);
    signIn(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.formWrapper}>
        <Text style={styles.text}>Let us get to know you</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          keyboardType="default"
          value={name}
          onChangeText={handleChangeName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={handleChangeEmail}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={[styles.button, !formValid && styles.invalid]}
          disabled={!formValid}
          onPress={handleClick}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    padding: 20,
  },
  logo: {
    height: 50,
    width: "100%",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 100,
    fontFamily: "Karla",
  },
  label: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Karla",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 30,
    fontFamily: "Karla",
  },
  buttonWrapper: {
    margin: 30,
  },
  button: {
    backgroundColor: "#495e57",
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginLeft: "auto",
  },
  invalid: {
    backgroundColor: "#edefee",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Karla",
  },
  formWrapper: {
    flex: 1,
    backgroundColor: "#dcdedd",
    justifyContent: "center",
  },
});
