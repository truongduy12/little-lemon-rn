import { useEffect, useState, useMemo, useCallback } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Hero from "../components/Hero";
import {
  createTables,
  filterByQueryAndCategories,
  getAllData,
  getSectionListData,
  insertData,
  useUpdateEffect,
} from "../utils";
import Filters from "../components/Filter";
import ListMenuItem from "../components/ListMenuItem";

const Home = () => {
  const [sections, setSections] = useState([]);
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  useEffect(() => {
    (async () => {
      try {
        await createTables();
        let menuItems = await getAllData();

        if (!menuItems.length) {
          const res = await fetch(
            "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
          );
          const data = await res.json();
          const items = data.menu.map((i) => ({
            name: i.name,
            price: i.price,
            description: i.description,
            image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${i.image}?raw=true`,
            category: i.category,
          }));
          await insertData(items);
        }
        setData(menuItems);
        setSections([...new Set(menuItems.map((i) => i.category))]);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    lookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <View style={styles.container}>
      <View>
        <Hero
          searchBarText={searchBarText}
          setSearchBarText={handleSearchChange}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.section}>Order for delivery!</Text>
        <Filters
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />
        <ListMenuItem data={data} />
      </View>
    </View>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
