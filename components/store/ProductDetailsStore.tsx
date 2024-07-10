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
import { Loading, checkStorage } from "../Shared";
import ImageViewer from "react-native-image-zoom-viewer";
import { formatter } from "../../utils";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-root-toast";

export default function ProductDetailsStore({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);

  const [item, setItem]: any = useState(route.params.item);
  const [showLoading, setShowLoading]: any = useState(false);
  const [product, setProduct]: any = useState({});
  const [showModalImagen, setShowModalImagen]: any = useState(false);
  const [index, setIndex]: any = useState(0);
  const [product_imgs, setProduct_imgs]: any = useState([]);
  const [product_img, setProduct_img]: any = useState({});
  const [productQuantity, setProductQuantity]: any = useState(1);
  const [productPrice, setProductPrice]: any = useState(0.0);

  useEffect(() => fetchProduct(), []);

  const fetchProduct = () => {
    const url = `/store/getAllimgByProductStore/${item.id}`;
    setProductPrice(item.price);
    fetchData(url).then((response: any) => {
      if (response.ok) {
        console.log(response.imagens, "response.imagens");
        setProduct_imgs([{ url: item.img }, ...response.imagens]);
        setProduct_img({ url: item.img });
      }
    });
  };

  const roundNumber = (number: number) => {
    return Number.parseFloat((Math.round(number * 100) / 100).toFixed(2));
  };

  const addToCart = () => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (id: any) => {
      const url = "/store/addStoreProductCart";
      const data = {
        storeProduct_id: item.id,
        user_id: id,
        amount: productQuantity,
        store_id:item.store_id,
        // productPrice:0
      };

      sendData(url, data).then((response: any) => {
        hideLoadingModal(() => {
          if (response.ok) {
            addProductToShoppingCart();
          } else {
            showErrorToast(translation.t("productDetailsMaxQuantityError")); // The quantity is greater than the stock, please choose a lesser one.
          }
        });
      });
    });
  };

  const addProductToShoppingCart = () => {
    Alert.alert(
      translation.t("alertInfoTitle"), // Information
      translation.t("productDetailsAddedProductText"), // Product added to shopping cart
      [
        {
          text: translation.t("productDetailsKeepBuyingText"), // Keep Buying
          onPress: () => {
            navigation.goBack();
          },
        },
        {
          text: translation.t("productDetailsGoCartText"), // Go to Cart
          onPress: () => {
            navigation.navigate("CartStoreScreen");
          },
        },
      ]
    );
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  const modifyPrice = (type: number) => {
    let price: number = item.price;
    let quantity: number = productQuantity;
    if (type == 1) {
      quantity += 1;
    } else {
      quantity -= 1;
    }

    price = item.price * quantity;

    if (quantity <= item.amount) {
      if (price >= item.price) {
        setProductPrice(roundNumber(price));
        setProductQuantity(quantity);
      }
    } else {
      showErrorToast(translation.t("productDetailsMaxQuantityError")); // The quantity is greater than the stock, please choose a lesser one.
    }
  };

  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loading showLoading={showLoading} translation={translation} />
      <View style={styles.body}>
        {product_img.url != '' ? (
          <View style={styles.productImage}>
            <TouchableOpacity
              style={{ height: 150, width: "100%", alignItems: "center" }}
              onPress={() => setShowModalImagen(true)}
            >
              <Image
                source={product_img}
                style={{
                  flex: 1,
                  height: 170,
                  width: "100%",
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <Text>No hay imagen que mostrar</Text>
          </View>
        )}

        <View>
          {product_imgs.length > 0 ? (
            <FlatList
              horizontal={true}
              style={{ height: "15%", borderWidth: 0 }}
              data={product_imgs}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  onPress={() => {
                    let index = product_imgs.findIndex((e: any) => {
                      return e.url === item.url;
                    });

                    setIndex(index);
                    setProduct_img({ url: item.url });
                  }}
                >
                  <View
                    style={{
                      height: 70,
                      width: 70,
                      marginBottom: 10,
                      margin: 2,
                    }}
                  >
                    {item.url && (
                      <Image
                        source={{ uri: item.url }}
                        style={{
                          width: "100%",
                          flex: 1,
                          resizeMode: "contain",
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          ) : (
            <View>{/* <Text>No hay imagen que mostrar</Text> */}</View>
          )}
        </View>

        <View>
          <Modal visible={showModalImagen}>
            <ImageViewer
              imageUrls={product_imgs}
              saveToLocalByLongPress={true}
              enableSwipeDown={true}
              onCancel={() => {
                setShowModalImagen(false);
              }}
              index={index}
            />
          </Modal>
        </View>

        <Text style={styles.productName}>{item.name}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            borderWidth: 0,
          }}
        >
          <Text style={styles.productPrice}>{formatter(productPrice)}</Text>
          {item.amount > 0 && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <AntDesign
                name="minus"
                size={24}
                style={styles.priceIcon}
                onPress={() => modifyPrice(2)}
              />
              <Text style={{ fontSize: 20, alignSelf: "center" }}>
                {productQuantity}
              </Text>
              <AntDesign
                name="plus"
                size={24}
                style={styles.priceIcon}
                onPress={() => modifyPrice(1)}
              />
            </View>
          )}
        </View>

        <Text style={{ fontSize: 16 }}>
          {translation.t("headerTitleProductDetails")}
        </Text>

        <Text style={styles.productDescription}>{item.description}</Text>
        {(item.amount > 0 && (
          <TouchableOpacity style={styles.productAdd} onPress={addToCart}>
            <Text style={styles.productAddText}>
              {translation.t("productDetailsAddCartText")}
            </Text>
          </TouchableOpacity>
        )) ||
          (item.amount == 0 && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                color: "red",
              }}
            >
              {
                translation.t(
                  "productDetailsStockError"
                ) /* Product out of stock */
              }
            </Text>
          ))}
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: "55%",
  },
  productImage: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    // backgroundColor: 'rgba(213, 240, 219, 0.5)',
    borderRadius: 20,
    borderWidth: 0,
  },
  productName: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5f7ceb",
  },
  priceIcon: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    padding: 3,
    color: "#5f7ceb",
  },
  productDescription: {
    marginVertical: 15,
    color: "#8B8B97",
  },
  productAdd: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#5f7ceb",
    height: 60,
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  productAddText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
