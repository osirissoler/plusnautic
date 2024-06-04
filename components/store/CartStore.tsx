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
import { LanguageContext } from "../../LanguageContext";
import { fetchData, sendData } from "../../httpRequests";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading, checkLoggedUser, checkStorage } from "../Shared";
import ImageViewer from "react-native-image-zoom-viewer";
import { formatter } from "../../utils";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import HeaderComponent from "../Header";

export default function CartStore({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [products, setProducts]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";

  useEffect(() => fetchProduct(), []);

  const fetchProduct = () => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (id: any) => {
      const url = `/store/getProductCartStoreByUser/${id}`;
      fetchData(url).then((response: any) => {
        if (response.ok) {
          setProducts(response.products);
        } else {
            setProducts([])
        }
      });
    });
    setTimeout(() => {
        setShowLoading(false);
      }, 1000);
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

      <View style={{ height: "80%", borderWidth: 0 }}>
        <FlatList
          extraData={products}
          style={{ height: "50%" }}
          refreshing={fetching}
          onRefresh={() => {
            fetchProduct();
          }}
          data={products}
          renderItem={({ item }) => (
            <View>
              <View style={styles.productCard}>
                <Ionicons
                  name="close-circle"
                  size={22}
                  style={styles.productCardDelete}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    position: "relative",
                  }}
                >
                  <View style={styles.productImage}>
                    <Image
                      source={{ uri: item.img }}
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
                        <AntDesign
                          name="minus"
                          size={24}
                          style={styles.productAddIcon}
                        />
                        <Text style={{ fontSize: 20, alignSelf: "center" }}>
                          {item.amount}
                        </Text>
                        <AntDesign
                          name="plus"
                          size={24}
                          style={styles.productAddIcon}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>

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
          }}
        >
          <Text style={{ fontSize: 16, color: "#fff", fontWeight: "500" }}>
            $ Pagar 6731
          </Text>
        </TouchableOpacity>
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
