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
  ScrollView
} from "react-native";
import { LanguageContext } from "../../LanguageContext";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { SafeAreaView } from "react-native-safe-area-context";
import { Addresses, Loading, checkLoggedUser, checkStorage } from "../Shared";
import ImageViewer from "react-native-image-zoom-viewer";
import { formatter } from "../../utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import HeaderComponent from "../Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AddressesScreen from "../../screens/AddressesScreen";
import NewAddressScreen from "../../screens/NewAddresssScreen";


export default function CartProductDetails({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [products, setProducts]: any = useState([]);
  const [driver_price, setDriver_price]: any = useState(0);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [total, setTotal]: any = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [storeRequestStatusSend, setStoreRequestStatusSend]: any = useState({});

  useEffect(() => fetchProduct(), []);

  const fetchProduct = () => {
    let a: any = [];
    setShowLoading(true);
    checkStorage("USER_LOGGED", () => {
      const url = `/store/getProductCartDetailsByStore/${route.params.data.user_id}/${route.params.data.store_id}`;
      fetchData(url).then(async (response: any) => {
        if (response.ok) {
          setDriver_price(response.driver_price);
          setProducts(response.products);
          setTotal(response.total);
          setIsChecked(response.driverActive);
          setStoreRequestStatusSend(response.storeRequestStatusSend);
            if (response.products.length == 0) {
              navigation.goBack();
            }
         
        } else {
          setProducts([]);
        }
      });
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const toggleBoolean = () => {
    const url = `/store/updateStoreRequestStatus/${storeRequestStatusSend.id}`;
    sendDataPut(url, { value: !isChecked }).then(async (response: any) => {
      if (response) {
        fetchProduct();
      }
    });
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

      <View style={{ maxHeight: "60%", borderWidth: 0 }}>
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
              <View style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => {
                    // deleteProductcartStore(item2.id);
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
                        uri: item.img
                          ? item.img
                          : "https://back.tiendainval.com/backend/admin/backend/web/archivosDelCliente/items/images/20210108100138no_image_product.png",
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
                      }}
                    >
                      <Text style={styles.productPrice}>{item.price}</Text>
                      <View style={styles.productAdd}>
                        <TouchableOpacity onPress={() => modifyPrice(2, item)}>
                          <AntDesign
                            name="minus"
                            size={24}
                            style={styles.productAddIcon}
                          />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 20, alignSelf: "center" }}>
                          {item.amount}
                        </Text>
                        <TouchableOpacity onPress={() => modifyPrice(1, item)}>
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
          )}
        ></FlatList>
      </View>

      {(isChecked)&&<View style={{borderWidth:0, height:'40%'}}>
        <Addresses navigation={navigation} translation={translation} />
      </View>}

      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              width: "94%",
              padding: 0,
              fontSize: 16,
              paddingRight: 10,
            }}
          >
            {/* {translation.t("checkoutPickupText")} */}
            Prefiere incluir envio
          </Text>
          <TouchableOpacity
            style={{
              height: 25,
              width: 25,
              borderRadius: 50,
              borderWidth: 0,
            }}
            onPress={() => {
              toggleBoolean();
            }}
          >
            {isChecked ? (
              <AntDesign name="checkcircle" size={24} color="#60941A" />
            ) : (
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 50,
                  borderColor: "gray",
                  borderWidth: 1,
                }}
              ></View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      

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
              {formatter(isChecked ? driver_price : 0)}
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
