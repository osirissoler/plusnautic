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
import { formatter } from "../../utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import HeaderComponent from "../Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CartStore({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [products, setProducts]: any = useState([]);
  const [listPrices, setListPrices]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [total, setTotal]: any = useState(0);
  const [driver_price, setDriver_price]: any = useState(0);

  useEffect(() => fetchProduct(), []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      fetchProduct();
    });
  }, []);

  const fetchProduct = () => {
    let a: any = [];
    setShowLoading(true);
    checkStorage("USER_LOGGED", (id: any) => {
      const url = `/store/getProductCartStoreByUser/${id}`;
      fetchData(url).then((response: any) => {
        if (response.ok) {
          setProducts(response.products);
          setTotal(response.total);
          setDriver_price(response.driver_price);
          // response.products.map((e: any) => {
          //   a.push(e.amount * e.price);
          // });
        } else {
          setProducts([]);
        }
      });
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
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

  const booleanRef = useRef<boolean>(false);
  const toggleBoolean = (value: any) => {
    booleanRef.current = value;
    fetchProduct();
  };

  const modifyPrice = (type: number, item: any) => {
    const url = `/store/addAndReduceProductCart/${item.id}/${item.storeProduct_id}`;
    sendDataPut(url, { type, amount: item.amount }).then((response: any) => {
      if (response.ok) {
        fetchProduct();
      }
    });
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
    >
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />

      {products.length > 0 ? (
        <View style={{ height: "60%", borderWidth: 0 }}>
          <FlatList
            extraData={products}
            style={{ height: "50%" }}
            refreshing={fetching}
            onRefresh={() => {
              fetchProduct();
            }}
            data={products}
            renderItem={({ item, index }: any) => (
              <View>
                {item?.map((item2: any, index2: any) => (
                  <View key={item2.id}>
                    {0 == index2 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginVertical: 10,
                        }}
                      >
                        <Text>{item2.store_name}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("CartProductDetails", {
                              data: item2,
                            });
                          }}
                        >
                          <Text>Ver detalle</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.productCard}>
                      <TouchableOpacity
                        onPress={() => {
                          console.log(item2);
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
                                : "https://back.tiendainval.com/backend/admin/backend/web/archivosDelCliente/items/images/20210108100138no_image_product.png",
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
                              {item2.price}
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
              <Text>IVU Municipal</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>
                {formatter(total.municipalTax)}
              </Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text>Costo de Transaccion</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>
                {formatter(total.transationFee)}
              </Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text>Costo por Envio</Text>
            </View>
            <View>
              <Text style={styles.cartPrice}>
                {/* {formatter(booleanRef.current == false ? total.send : 0)} */}
                {formatter(driver_price)}
              </Text>
            </View>
          </View>
          <View style={styles.cartPrices}>
            <View>
              <Text style={{ fontWeight: "bold" }}>Total</Text>
            </View>
            <View>
              <Text style={{ ...styles.cartPrice, fontWeight: "bold" }}>
                {/* {formatter(
                booleanRef.current == true
                  ? total.total - total.send
                  : total.total
              )} */}
                {formatter(total.total)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {products.length > 0 && (
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            //   onPress={() => changeGiftStatus()}
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
              Finalizar compra
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
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
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
