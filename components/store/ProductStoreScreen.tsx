import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Linking,
  Alert,
  Text,
  FlatList,
  Pressable,
  Modal,
} from "react-native";
import { Loading } from "../Shared";
import { LanguageContext } from "../../LanguageContext";
import AdsScreen from "../../screens/AdsScreen";
import { formatter, formatter2 } from "../../utils";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchData } from "../../httpRequests";
import FloatingButton from "../FloatingButton";

const ProductStoreScreen = ({ navigation, route }: any) => {
  const { translation } = React.useContext(LanguageContext);
  const [fetchingCategories, setFetchingCategories]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [product, setProduct]: any = useState([{}, {}, {}]);
  const [fetching, setFetching]: any = useState(false);
  const [store, setStore]: any = useState(route.params.item);
  const [openModal, setOpenModal]: any = useState(false);
  const [visible, setVisible] = useState(true);
  const [initialImg, setinitialImage] = useState(
    "https://plus-nautic.nyc3.digitaloceanspaces.com/mosaico-para-destinos.jpg__1200.0x960.0_q85_subsampling-2.jpg"
  );
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [category, setCategory]: any = useState([{}, {}, {}]);
  const [initial, setInitial]: any = useState(0);
  const [category_id, setCategory_id]: any = useState(0);
  const limit = 10;

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    setShowLoading(true);
    const url = `/store/getAllProductStore/${store.id}/10/0`;
    fetchData(url).then(async (response) => {
      if (response.ok) {
        setProduct(response.products);
      } else {
        setProduct([]);
      }
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const getProductByCategoryStore = async (id: any) => {
    setShowLoading(true);
    const url = `/store/getProductByCategoryStore/${id}/${limit}/${initial}`;
    fetchData(url).then(async (response) => {
      if (response.ok) {
        setProduct(response.products);
      } else {
        setProduct([]);
      }
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };
  const getCategoryByStoreIdApp = async () => {
    const url = `/store/getCategoryByStoreIdApp/${store.id}`;
    fetchData(url).then(async (response) => {
      if (response.ok) {
        setCategory(response.category);
      } else {
        setCategory([]);
      }
    });
  };
  const setActiveCategory = (category: any) => {
    setCategory_id(category.id);
    setOpenModal(false);
    setInitial(0);
    getProductByCategoryStore(category.id);
  };
  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={styles.header}>
        <Image
          style={{ height: 50, width: "50%", resizeMode: "contain" }}
          source={require("../../assets/images/slogan.png")}
        />
        <View style={[styles.screenOptions, { justifyContent: "flex-end" }]}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row",
            }}
          >
            {/* <FloatingButton navigation={navigation} /> */}
            <Pressable
              style={styles.optionIcon}
              onPress={() =>
                navigation.navigate("ListProducts", {
                  data: { store_id: store.id },
                })
              }
            >
              <AntDesign name="search1" size={22} color="#5f7ceb" />
            </Pressable>

            <View style={{ alignItems: "center", borderWidth: 0 }}>
              <TouchableOpacity
                style={styles.optionIcon}
                onPress={() => {
                  setOpenModal(true), getCategoryByStoreIdApp();
                }}
              >
                <AntDesign name="filter" size={22} color="#5f7ceb" />
              </TouchableOpacity>
              <View>
                <Text style={{ color: "#5f7ceb" }}>Category</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Loading showLoading={showLoading} translation={translation} />
      <Modal visible={openModal} animationType="slide">
        <View style={{ paddingVertical: 40, paddingHorizontal: 20 }}>
          <View style={{ position: "relative", justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginTop: 20,
                marginBottom: 30,
              }}
            >
              {translation.t("homeModalFilterLabel") /* Filter */}
            </Text>
            <View style={{ position: "absolute", right: 0 }}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                style={styles.categoryIcon}
                onPress={() => setOpenModal(false)}
              />
            </View>
          </View>
          <Text style={{ fontSize: 16, marginVertical: 10 }}>
            {translation.t("homeModalCategoriesLabel") /* Categories */}
          </Text>
        </View>
        <FlatList
          style={{ height: "85%" }}
          data={category}
          columnWrapperStyle={{ justifyContent: "space-around" }}
          refreshing={fetchingCategories}
          onRefresh={() => {}}
          renderItem={({ item }: any) => (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                item.active ? styles.categoryCardActive : null,
              ]}
              onPress={() => setActiveCategory(item)}
              key={item.id}
            >
              <View style={{ height: 50, width: 50, marginBottom: 10 }}>
                <Image
                  source={{ uri: item.img }}
                  style={{ flex: 1, resizeMode: "contain" }}
                />
              </View>
              <Text style={styles.categoryName}>
                {(translation.locale.includes("en") && item.name) ||
                  (translation.locale.includes("es") && item.nombre) ||
                  (translation.locale.includes("fr") && item.nom)}
              </Text>
            </TouchableOpacity>
          )}
          numColumns={2}
        ></FlatList>
      </Modal>
      <View style={{ borderWidth: 0, height: "90%", marginEnd: 10 }}>
        <FlatList
          data={product}
          refreshing={fetching}
          onRefresh={() => {}}
          ListEmptyComponent={
            <Text style={{ fontSize: 16, marginTop: 20 }}>
              {translation.t("homeNoProductsText")}
            </Text>
          }
          ListHeaderComponent={
            <View>
              <View>
                {visible ? (
                  <AdsScreen code={"Home"} img={initialImg} />
                ) : (
                  <Image
                    style={{
                      marginBottom: 20,
                      height: 180,
                      width: "100%",
                      borderRadius: 10,
                    }}
                    source={{ uri: initialImg }}
                  />
                )}
              </View>
            </View>
          }
          onEndReachedThreshold={0}
          style={{ padding: 20, flexDirection: "column" }}
          renderItem={({ item }) => (
            <View>
              <Pressable style={styles.productCard} onPress={() =>
                        navigation.navigate("ProductDetailsStore", { item })
                      }>
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
                    <Pressable
                      style={styles.productAdd}
                    >
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  body: {
    padding: 20,
    flexDirection: "column",
  },
  locationTitle: {
    marginHorizontal: 5,
    alignSelf: "flex-end",
  },
  locationText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(22, 22, 46, 0.3)",
  },
  headerImage: {
    marginBottom: 20,
    height: 180,
    width: "100%",
    borderRadius: 10,
    // aspectRatio:1/1
  },
  listCategories: {},
  categoryCard: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    marginVertical: 10,
    width: "43%",
    height: 120,
  },
  categoryCardActive: {
    borderWidth: 1,
    borderColor: "#000",
  },
  categoryIcon: {
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },
  productsContainer: {},
  productsContainerHeader: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsContainerBody: {
    marginBottom: 30,
  },
  productsPopularTitle: {
    fontSize: 16,
  },
  productsViewAll: {
    color: "#40AA54",
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
  formInputIcon: {
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
    right: 15,
    top: "35%",
    zIndex: 2,
  },
  screenOptions: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    position: "absolute",
    flexDirection: "row",
  },
  optionIcon: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "relative",
    backgroundColor: "#F7F7F7",
  },
  ticketsContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    borderRadius: 100,
    backgroundColor: "#5f7ceb",
    paddingVertical: 3,
    paddingHorizontal: 7,
    minWidth: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketsAmount: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductStoreScreen;
