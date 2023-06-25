import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginHorizontal: 5,
            backgroundColor: selections[index] ? "#495E57" : "#edefee",
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 15,
          }}
        >
          <View>
            <Text
              style={{
                color: selections[index] ? "white" : "#495E57",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 15,
  },
});

export default Filters;
