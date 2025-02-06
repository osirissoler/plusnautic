import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { LanguageContext } from "../../LanguageContext";
import AdsScreen from "../../screens/AdsScreen";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { checkStorage, Loading } from "../Shared";
import { fetchData } from "../../httpRequests";

export default function AllStoreHome({ navigation, router }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [store, setStore]: any = useState([{}, {}, {}]);
  const [count, setCount]: any = useState(0);
  const [fetching, setFetching]: any = useState(false);

  const [visible, setVisible] = useState(true);
  const [initialImg, setinitialImage] = useState(
    "https://plus-nautic.nyc3.digitaloceanspaces.com/mosaico-para-destinos.jpg__1200.0x960.0_q85_subsampling-2.jpg"
  );
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";

  const skip = useRef<number>(0);

  useEffect(() => {
    //   navigation.addListener("focus", () => {
    getProductCartAmount();
    getAllStore();
  }, []);

  const getProductCartAmount = async () => {
    checkStorage("USER_LOGGED", (id: any) => {
      const url = `/store/getProductCartAmount/${id}`;
      fetchData(url).then(async (response) => {
        if (response.ok) {
          setCount(response.count);
        } else {
          setCount(0);
        }
      });
    });
  };

  const getAllStore = async () => {
    setShowLoading(true);
    checkStorage("USER_LOGGED_COUNTRY", (id: any) => {
      const url = `/store/getAllStoreByContry/${id}`;
      fetchData(url).then(async (response) => {
        if (response.ok) {
          setStore(response.store);
        } else {
          setStore([]);
        }
      });
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    });
  };
  return (
    <View style={{  backgroundColor: "white" }}>
      {/* <View style={styles.header}>
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
           
            <View></View>

            <TouchableOpacity
              style={styles.optionIcon}
              onPress={() => navigation.navigate("CartStoreScreen")}
            >
              <View style={styles.ticketsContainer}>
                <Text style={styles.ticketsAmount}>{count}</Text>
              </View>

              <AntDesign name="shoppingcart" size={35} />
            </TouchableOpacity>
          </View>
        </View>
      </View> */}
      <Loading showLoading={showLoading} translation={translation} />

      <View style={{ borderWidth: 0, marginBottom:10, marginEnd: 10 }}>
        <FlatList
          horizontal
          pagingEnabled
          data={store}
          onRefresh={() => {
            getAllStore();
          }}
          refreshing={fetching}
          ListEmptyComponent={
            <Text style={{ fontSize: 16, marginTop: 20 }}>
              {translation.t("homeNoProductsText")}
            </Text>
          }
          //   style={{ padding: 20, flexDirection: "column" }}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate("ProductStoreScreen", { item })
                }
              >
                <View style={{ width: "100%", height: "100%", borderWidth: 0 }}>
                  <Image
                    source={{
                      uri: item.img ? item.img : defaultProductImg,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      flex: 1,
                      resizeMode: "contain",
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  //   justifyContent: "space-between",
                  //   width: "100%",
                  //   borderWidth: 1,
                  //   paddingHorizontal: 20,

                  width: 160,
                  //   height: 80,
                  //   padding: 20,
                  //   marginVertical: 10,
                  marginHorizontal: 5,
                  //   borderRadius: 10,
                  //   borderWidth: 1,
                  //   borderColor: "rgba(0, 0, 0, 0.1)",
                  //   flexDirection: "row",
                }}
              >
                <Text style={styles.productTitle}>{item.name}</Text>
                {/* <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 20,
                    }}
                  >
                    
                    <Pressable style={styles.productAdd}>
                      <Entypo
                        name="eye"
                        size={24}
                        style={styles.productAddIcon}
                      />
                     
                    </Pressable>
                  </View> */}
              </View>
            </View>
          )}
        ></FlatList>
      </View>
    </View>
  );
}

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
    width: 160,
    height: 80,
    // padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    // shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  productImage: {
    // height: 100,
    // width: 100,
  },
  productTitle: {
    fontSize: 16,
    // fontWeight: "500",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  productAdd: {
    backgroundColor: "#60941A",
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
    // backgroundColor: '#F7F7F7',
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
