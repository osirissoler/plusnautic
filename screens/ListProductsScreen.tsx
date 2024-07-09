import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
} from "react-native";
import { checkStorage, Loading } from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import { formatter } from "../utils";

export default function ListProductsScreen({ navigation, route }: any) {
  const [data, setData] = useState(route.params.data);
  const { translation } = React.useContext(LanguageContext);
  const [products, setProducts]: any = useState([]);
  const [productsSearch, setProductsSearch]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [limit, setLimit]: any = useState(100);
  const skip = useRef<number>(0);
  const text = useRef<any>("");
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    // setShowLoading(true);
    setFetching(true);
    const url = `/store/getProductByStoreId/${data.store_id}/${limit}/${skip.current}`;
    fetchData(url).then(async (response: any) => {
      // hideLoadingModal(async () => {
      if (response.ok) {
        if (skip.current == 0) {
          await setProducts([]);
          await setProducts([...response.products]);
        } else {
          setProducts([...products, ...response.products]);
        }
      } else {
        text.current = await "";
        skip.current = await 0;
        await setProducts([]);
      }
      // });
    });
    setFetching(false);
  };

  const searchProductApp = async () => {
    if (
      text.current !== "" &&
      text.current !== undefined &&
      text.current !== null
    ) {
      const url = `/store/searchProductApp/${text.current}/${data.store_id}/${limit}/${skip.current}`;
      fetchData(url).then(async (response: any) => {
        if (response.ok) {
          if (skip.current == 0) {
            await setProducts([]);
            await setProducts([...response.products]);
          } else {
            setProducts([...products, ...response.products]);
          }
        } else {
          skip.current = await 0;
          await setProducts([]);
          text.current = await "";
        }
      });
    } else {
      fetchProduct();
    }
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };

 

  const onRefresh = () => {
    fetchProduct();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loading showLoading={showLoading} translation={translation} />
      <View style={styles.body}>
        <View style={styles.formInputIcon}>
          <TextInput
            placeholder={translation.t("listProductsSearchPlaceholder")}
            placeholderTextColor={"gray"}
            style={[styles.textInput, { zIndex: 1 }]}
            onChangeText={(value) => {
              text.current = value
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
              skip.current = 0;
              searchProductApp();
            }}
          />
          <FontAwesome
            style={styles.inputIcon}
            name="search"
            color={"#5f7ceb"}
            size={20}
            onPress={() => {
              // setInitial(limit + );
            }}
          />
        </View>
        <FlatList
          data={products}
          refreshing={fetching}
          onRefresh={() => fetchProduct()}
          // ListEmptyComponent={
          //   <Text style={{ fontSize: 16, marginTop: 20 }}>
          //     {translation.t("homeNoProductsText")}
          //   </Text>
          // }
          // onEndReachedThreshold={0}
          style={{ padding: 20, flexDirection: "column" }}
          onEndReached={async () => {
            skip.current = (await skip.current) + limit;
            if (text.current !== "") {
              await searchProductApp();
            } else {
              await fetchProduct();
            }
          }}
          renderItem={({ item }) => (
            <View>
              <Pressable
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate("ProductDetailsStore", { item })
                }
              >
                <View style={styles.productImage}>
                  <Image
                    source={{
                      uri: item.img ? item.img : defaultProductImg,
                    }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                </View>
                <View style={{ justifyContent: "space-between", width: 160 }}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    <Text style={styles.productPrice}>
                      {formatter(item.price)}
                    </Text>
                    <Pressable style={styles.productAdd}>
                      <AntDesign
                        name="plus"
                        size={18}
                        style={styles.productAddIcon}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  body: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
    // paddingHorizontal: 20,
  },

  formInputIcon: {
    paddingHorizontal: 20,
    position: "relative",
    flexDirection: "row",
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingRight: 40,
    paddingLeft: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  inputIcon: {
    position: "absolute",
    right: 30,
    top: "35%",
    zIndex: 2,
  },
  productCard: {
    padding: 20,
    marginVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  productImage: {
    height: 100,
    width: 100,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  productAdd: {
    backgroundColor: "#5f7ceb",
    padding: 4,
    borderRadius: 100,
  },
  productAddIcon: {
    color: "white",
    fontSize: 20,
  },
});
