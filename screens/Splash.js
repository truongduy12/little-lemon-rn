import { Image, StyleSheet, Text, View } from "react-native";
const Splash = () => {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};
export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
