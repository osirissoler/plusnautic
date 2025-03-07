import React, { useEffect, useRef, useState } from "react";
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
import { LanguageContext } from "../../LanguageContext";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading, checkLoggedUser, checkStorage } from "../Shared";
import ImageViewer from "react-native-image-zoom-viewer";
import { formatter, showErrorToast } from "../../utils";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import HeaderComponent from "../Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Tooltip from "react-native-walkthrough-tooltip";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function CartStore({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [products, setProducts]: any = useState([]);
  const [listPrices, setListPrices]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [total, setTotal]: any = useState(0);
  const [driver_price, setDriver_price]: any = useState(0);
  const [toolTipVisible, setToolTipVisible]: any = useState(0);
  const [user_id, setUser_id]: any = useState(null);
  const [isoCode, setIsoCode]: any = useState(null);
  useEffect(() => {
    fetchProduct();
    getContrycode();
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      fetchProduct();
      getContrycode();
    });
  }, []);

  const fetchProduct = () => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (id: any) => {
      setUser_id(id);
      checkStorage("DATA_COUNTRY", (country: any) => {
        const countryData = JSON.parse(country);
        const url = `/store/getProductCartStoreByUser/${id}/${countryData.id}`;
        fetchData(url).then((response: any) => {
          if (response.ok) {
            setProducts(response.products);
            setTotal(response.total);
            setDriver_price(response.driver_price);
          } else {
            setProducts([]);
          }
        });
      });
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const getContrycode = () => {
    checkStorage("DATA_COUNTRY", (data: any) => {
      setIsoCode(JSON.parse(data).isoCode);
    });
  };

  const deleteProductcartStore = (id: number) => {
    setShowLoading(true);
    const url = `/store/deleteProductcartStore/${id}`;
    deleteData(url).then((response: any) => {
      if (response.ok) {
        fetchProduct();
      }
    });
  };

  const modifyPrice = (type: number, item: any) => {
    const url = `/store/addAndReduceProductCart/${item.id}/${item.storeProduct_id}`;
    sendDataPut(url, { type, amount: item.amount }).then((response: any) => {
      if (response.ok) {
        fetchProduct();
      } else {
        showErrorToast(response.mensaje);
      }
    });
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        paddingVertical: 10,
        paddingHorizontal: 8,
      }}
    >
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />

      {products.length > 0 ? (
        <View style={{ height: "66%", borderWidth: 0 }}>
          <FlatList
            extraData={products}
            style={{ height: "50%" }}
            refreshing={fetching}
            onRefresh={() => {
              fetchProduct();
            }}
            data={products}
            renderItem={({ item, index }: any) => (
              <View
                style={{
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                {item?.map((item2: any, index2: any) => (
                  <View key={item2.id}>
                    {0 == index2 && (
                      <View>
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ fontWeight: "400", fontSize: 19 }}>
                            {item2.store_name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: 7,
                          }}
                        >
                          <Tooltip
                            isVisible={toolTipVisible}
                            content={<Text>{translation.t("optionSend")}</Text>}
                            placement="top"
                            onClose={() => setToolTipVisible(false)}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setToolTipVisible(true);
                              }}
                            >
                              <FontAwesome
                                name="info-circle"
                                size={20}
                                color="#5f7ceb"
                              />
                            </TouchableOpacity>
                          </Tooltip>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("CartProductDetails", {
                                data: { ...item2, isoCode },
                              });
                            }}
                          >
                            <Text style={{ color: "#5f7ceb" }}>
                              {translation.t("SeeShippingOptions")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    <View style={styles.productCard}>
                      <TouchableOpacity
                        onPress={() => {
                          deleteProductcartStore(item2.id);
                        }}
                        style={styles.productCardDelete}
                      >
                        <Ionicons name="close-circle" size={22} color="red" />
                      </TouchableOpacity>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          position: "relative",
                        }}
                      >
                        <View style={styles.productImage}>
                          <Image
                            source={{
                              uri: item2.img
                                ? item2.img
                                : "https://plus-nautic.nyc3.digitaloceanspaces.com/noProduct.png",
                            }}
                            style={{ flex: 1, resizeMode: "contain" }}
                          />
                        </View>

                        <View
                          style={{
                            justifyContent: "space-between",
                            width: 160,
                          }}
                        >
                          <Text style={styles.productTitle}>{item2.name}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* <Text>{item2.name}</Text> */}
                            <Text style={styles.productPrice}>
                              {formatter(item2.price)}
                            </Text>

                            <View style={styles.productAdd}>
                              <TouchableOpacity
                                onPress={() => modifyPrice(2, item2)}
                              >
                                <AntDesign
                                  name="minus"
                                  size={24}
                                  style={styles.productAddIcon}
                                />
                              </TouchableOpacity>

                              <Text
                                style={{ fontSize: 20, alignSelf: "center" }}
                              >
                                {item2.amount}
                              </Text>
                              <TouchableOpacity
                                onPress={() => modifyPrice(1, item2)}
                              >
                                <AntDesign
                                  name="plus"
                                  size={24}
                                  style={styles.productAddIcon}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {Boolean(item2.isDiscounted) && (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={[
                                  styles.productTitle,
                                  { color: "#FC808E", fontWeight: "bold" },
                                ]}
                              >
                                - {item2.discountPercentage}%
                              </Text>

                              <Text style={styles.productTitle}>
                                {formatter(item2.totalPriceWithDiscount)}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text>No hay productos en el carrito</Text>
        </View>
      )}

      {products.length > 0 && (
        <View style={{ width: "100%", marginTop: 10 }}>
          <View style={styles.cartPrices}>
            <Text>Sub Total</Text>
            <Text style={styles.cartPrice}>{formatter(total.amount)}</Text>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text>IVU Estatal</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>{formatter(total.stateTax)}</Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              {isoCode === "DO" ? (
                <Text>ITBIS </Text>
              ) : (
                <Text>IVU Municipal</Text>
              )}
            </View>
            <View>
              <Text style={styles.cartPrice}>
                {formatter(total.municipalTax)}
              </Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text>{translation.t("TransactionCost")}</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>
                {formatter(total.transationFee)}
              </Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text>{translation.t("ShippingCost")}</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>{formatter(driver_price)}</Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text style={{ fontWeight: "bold" }}>Total</Text>
            </View>
            <View>
              <Text style={{ ...styles.cartPrice, fontWeight: "bold" }}>
                {formatter(total.total)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {products.length > 0 && (
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PayDetails", {
                item: {
                  ...total,
                  isoCode,
                  user_id: Number(user_id),
                  shippingPrice: driver_price,
                },
              })
            }
            style={{
              width: "100%",
              backgroundColor: "#5f7ceb",
              height: 45,

              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
              {translation.t("CompletePurchase")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    flex: 1,
  },
  productCount: {
    fontSize: 20,
    marginBottom: 10,
    marginVertical: 20,
    color: "red",
    fontWeight: "bold",
  },
  imageParent: {
    height: 330,
  },
  image: {
    width: 300,
    height: 330,
  },
  productCard: {
    padding: 13,
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    justifyContent: "space-around",
    position: "relative",
  },
  productCardDelete: {
    color: "red",
    position: "absolute",
    right: 0,
    top: -10,
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
    alignSelf: "center",
  },
  productAdd: {
    borderRadius: 100,
    flexDirection: "row",
  },
  productAddIcon: {
    color: "#60941A",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    padding: 2,
  },
  cartPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  cartPrice: {
    textAlign: "right",
  },
  buttonCheckout: {
    width: "100%",
    height: 50,
    backgroundColor: "#60941A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonCheckoutText: {
    color: "#ffffff",
    fontSize: 18,
  },
  buttonGift: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0 , 0.3)",
    width: 190,
    justifyContent: "center",
    padding: 5,
    borderRadius: 12,
  },
});
