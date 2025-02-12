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

export const ProductList = ({ navigation }: any) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [skip, setKip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [fetching, setFetching] = useState<boolean>(false);

  const handlePress = (item: Products) => {
    navigation.navigate("ProductDetailsStore", {
      item,
    });
    // console.log("Artículo seleccionado:", article.title);
  };

  useEffect(() => {
    // setShowLoading(true);
    getProducts();
  }, []);

  useEffect(() => {
    if (skip !== -1) {
      getProducts();
    }
  }, [skip]);

  const getProducts = async () => {
    setFetching(true);
    const url = `/store/getProductWithDiscounts/${limit}/${skip}`;
    await fetchData(url).then((response) => {
      console.log(response);
      if (response.ok) {
        // hideLoadingModal(() => {
        setProducts([...products, ...response.products]);
        // }, setFetching);
      } else {
        setProducts([]);
        setFetching(false);
        // setError(true);
      }
    });
    setFetching(false);
    // setShowLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Productos en oferta
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        refreshing={fetching}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: Products) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard item={item} onPress={handlePress} />
        )}
        onRefresh={() => {
          setFetching(true);
          setProducts([]);
          setTimeout(async () => {
            await setKip(-1);
            await setKip(0);
            console.log("entro");
          }, 100);
        }}
        onEndReached={() => {
          if (!fetching && products.length > 3) {
            setKip(skip + limit);
          }
        }}
        ListFooterComponent={() =>
          products.length > 3 && fetching == false ? (
            <View style={{ alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0F3D87" />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingVertical: 5, alignItems: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },
});
