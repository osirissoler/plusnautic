import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductCard } from "./ProductCard";
import { fetchData } from "../../httpRequests";
import { Products } from "../../types/Products";
// import Skeleton from "react-native-reanimated-skeleton";
import { checkLoggedUser, checkStorage } from "../Shared";

export const OrderedProductsList = ({ navigation }: any) => {
  const [products, setProducts] = useState<any>([]);
  const [skip, setKip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (item: Products) => {
    navigation.navigate("ProductDetailsStore", {
      item,
    });
  };

  useEffect(() => {
    setLoading(true);
    getProducts();
  }, []);

  useEffect(() => {
    if (skip !== -1) {
      getProducts();
    }
  }, [skip]);

  const getProducts = async () => {
    setFetching(true);
    checkStorage("USER_LOGGED", async (id: string) => {
      const url = `/store/getProductsOrdered/${id}`;
      const response = await fetchData(url);
      if (response.ok) {
        setProducts([...products, ...response.products]);
      } else {
        setProducts([]);
        setFetching(false);
      }
      setFetching(false);
      setLoading(false);
    });
  };

  const groupProducts = (products: Products[]) => {
    const grouped = [];
    for (let i = 0; i < products.length; i += 2) {
      if (i + 1 < products.length) {
        grouped.push([products[i], products[i + 1]]);
      } else {
        grouped.push([products[i], null]); // Si queda solo uno, el segundo es `null`
      }
    }
    return grouped;
  };

  if (!loading && products.length == 0) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      {!loading && (
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Volver a comprar
          </Text>
          {/* <TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Ver todos</Text>
        </TouchableOpacity> */}
        </View>
      )}

      <FlatList
        refreshing={fetching}
        data={products} // Ya viene como array de arrays
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Products[] }) => (
          <View style={{ flexDirection: "column" }}>
            {item.length === 1 ? (
              <>
                <ProductCard
                  key={item[0].id}
                  item={item[0]}
                  onPress={handlePress}
                  isDiscounted={false}
                />
                <View style={{ height: 170, width: 140 }} />
              </>
            ) : (
              item?.map((product) => (
                <ProductCard
                  key={product.id}
                  item={product}
                  onPress={handlePress}
                  isDiscounted={false}
                />
              ))
            )}
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 5, alignItems: "center" }}
      />

      {/* <Skeleton
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          gap: 10,
        }}
        isLoading={loading}
        layout={[
          { key: "1", height: 20, width: 170, borderRadius: 15 },
          {
            key: "group", // Grupo para las tres cajas inferiores
            flexDirection: "row", // Hace que estén en fila
            gap: 10,
            children: [
              { key: "2", height: 170, width: 140, borderRadius: 15 },
              { key: "3", height: 170, width: 140, borderRadius: 15 },
              { key: "4", height: 170, width: 140, borderRadius: 15 },
            ],
          },
          {
            key: "group", // Grupo para las tres cajas inferiores
            flexDirection: "row", // Hace que estén en fila
            gap: 10,
            children: [
              { key: "2", height: 170, width: 140, borderRadius: 15 },
              { key: "3", height: 170, width: 140, borderRadius: 15 },
              { key: "4", height: 170, width: 140, borderRadius: 15 },
            ],
          },
        ]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 10
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});
