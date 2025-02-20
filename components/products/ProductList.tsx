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

export const ProductList = ({ navigation }: any) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [skip, setKip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [areDiscountedProduct, setAreDiscountedProduct] =
    useState<boolean>(true);

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
    const url = `/store/getProductWithDiscounts/${limit}/${skip}`;
    const url2 = `/store/getProductsRandomly/${limit}/${skip}`;
    let response;
    response = await fetchData(url);
    console.log(response)
    if (response.ok) {
      setProducts([...products, ...response.products]);
      setFetching(false);
      setLoading(false);
      setAreDiscountedProduct(true);
      return;
    }

    if (response.count == 0) {
      response = await fetchData(url2);
      if (response.ok) {
        setProducts([...products, ...response.products]);
        setAreDiscountedProduct(false);
      }
      setFetching(false);
      setLoading(false);
      return;
    }
  };

  if (!loading && products.length == 0) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      {!loading && (
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {areDiscountedProduct
              ? "Productos en oferta"
              : "Productos en ventas"}
          </Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 15 }}>Ver todos</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        refreshing={fetching}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: Products, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={handlePress}
            isDiscounted={areDiscountedProduct}
          />
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
        ]}
      /> */}
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
    marginBottom: 5,
  },
});
