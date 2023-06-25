import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const Item = ({ item }) => {
  return (
    <View>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text>${item.price}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            resizeMode="cover"
            style={styles.image}
          />
        </View>
      </View>
    </View>
  );
};

const ListMenuItem = ({ data }) => {
  const renderItem = ({ item }) => <Item item={item} />;
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={
        <View
          style={{
            borderBottomWidth: 1,
            marginVertical: 15,
            borderColor: "#edefee",
          }}
        />
      }
    />
  );
};
export default ListMenuItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
  },
  left: {
    paddingRight: 20,
    width: "70%",
    paddingTop: 20,
  },
  imageContainer: {
    width: "30%",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  description: {
    fontFamily: "Karla",
    marginBottom: 5,
  },
  price: {
    fontFamily: "Karla",
    fontSize: 15,
  },
});
