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
import SkeletonPlaceholder from "../SkeletonPlaceholder";
import { checkStorage } from "../Shared";
// import Skeleton from "react-native-reanimated-skeleton";

export const ProductList = ({ navigation }: any) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [areDiscountedProduct, setAreDiscountedProduct] =
    useState<boolean>(true);
  const [country_id, setCountry_id] = useState<string>("");

  const handlePress = (item: Products) => {
    navigation.navigate("ProductDetailsStore", {
      item,
    });
  };

  useEffect(() => {
    checkStorage("DATA_COUNTRY", (country: any) => {
      const countryData = JSON.parse(country);
      
      if (skip == 0) {
        setLoading(true);
      }
      if (skip !== -1) {
        getProducts(countryData.id);
      }

      // setCountry_id(countryData.id);
    });
  }, [skip]);

  // useEffect(() => {
  //   if (skip !== -1) {
  //     getProducts();
  //     console.log("skip", skip);
  //   }
  // }, [skip]);

  const getProducts = async (country: string) => {
    setFetching(true);
    const url = `/store/getProductWithDiscounts/${limit}/${skip}/${country}`;
    const url2 = `/store/getProductsRandomly/${limit}/${skip}/${country}`;
    let response;
    response = await fetchData(url);

    if (response.ok) {
      if (skip == 0) {
        setProducts(response.products);
      } else {
        setProducts([...products, ...response.products]);
      }
      if (response.count > 0) {
        setFetching(false);
        setLoading(false);
        setAreDiscountedProduct(true);
        return;
      }
    }

    if (response.count == 0) {
      response = await fetchData(url2);
      if (response.ok) {
        if (skip == 0) {
          setProducts(response.products);
        } else {
          setProducts([...products, ...response.products]);
        }
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
          {/* <TouchableOpacity>
            <Text style={{ fontSize: 15 }}>Ver todos</Text>
          </TouchableOpacity> */}
        </View>
      )}

      <FlatList
        refreshing={fetching}
        data={products}
        horizontal
        keyExtractor={(item: Products, index) => index.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={handlePress}
            isDiscounted={areDiscountedProduct}
          />
        )}
        onRefresh={() => {
          // setFetching(true);
          // setLoading(true);
          // setProducts([]);
          setSkip(-1);
          setTimeout(() => {
            setSkip(0);
          }, 100);
        }}
        onEndReached={() => {
          if (!fetching && products.length > 3) {
            setSkip(skip + limit);
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

      <SkeletonPlaceholder
        isLoading={loading}
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          gap: 10,
        }}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
});
