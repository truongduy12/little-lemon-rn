import { db } from "./db";
import { useEffect, useRef } from "react";

export function checkDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `select name from sqlite_master where type='table' and name='menuitems'`,
          [],
          (_, { rows }) => {
            console.log(rows._array);
            resolve(rows.length);
          }
        );
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export function createTables() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `
      create table if not exists menuitems (id integer primary key not null, name text not null, price text not null, description text not null, image text not null, category text not null);
      `,
          [],
          (_, rs) => {
            resolve(rs);
          }
        );
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export function getAllData() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`select * from menuitems`, [], (_, rs) => {
          resolve(rs.rows._array);
        });
      },
      (error) => {
        console.log(error);
        reject(error);
      }
    );
  });
}

export function insertData(items) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const query = `insert into menuitems (name, price, description, image, category) values ${items
          .map(
            (item) =>
              `("${item.name}","${item.price}","${item.description}","${item.image}","${item.category}")`
          )
          .join(",")};`;
        tx.executeSql(query, [], (_, rs) => {
          resolve(rs);
        });
      },
      (error) => {
        console.log("saveMenuItems Error: ", error);
        reject(error);
      }
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from menuitems where name like '%${query}%' and category in (${activeCategories
          .map((i) => `'${i}'`)
          .join(",")})`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        }
      );
    });
  });
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export function getSectionListData(data) {
  const sectionTitle = [...new Set(data.map((item) => item.category))];
  const sectionListData = sectionTitle.map((section) => ({
    name: section,
    data: data.filter((item) => item.category == section),
  }));
  return sectionListData;
}
