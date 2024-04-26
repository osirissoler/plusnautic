import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Modal,
} from "react-native";

import HeaderComponent from "../components/Header";
import {
  checkLoggedUser,
  checkStorage,
  Container,
  Loading,
} from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { formatter } from "../utils";
import Toast from "react-native-root-toast";
import { Dropdown } from "react-native-element-dropdown";

export default function BuyTicketsScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [ticketsArr, setTicketsArr] = useState(route.params.tickets)
  const [ticket, setTicket]: any =  useState({})
  const [showLoading, setShowLoading]: any = useState(false);
  const [error, setError] = useState(false);
  const [eventData, setEventData]: any = useState({});
  const [product, setProduct]: any = useState({});
  const [ticketPrice, setTicketPrice]: any = useState(0.0);
  const [ticketAmount, setTicketAmount]: any = useState(1);
  const [product_imgs, setProduct_imgs]: any = useState([]);
  const [product_img, setProduct_img]: any = useState({});

  useEffect(() => {
    getBoatShowById();
  }, [route.params.event_id]);

  const getBoatShowById = async () => {
    let url = `/typeEvents/getBoatShowById/${route.params.event_id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        setEventData(response.data.boatShows);
      } else {
        setError(true);
      }
    });
  };

  useEffect(() => fetchProduct(), []);

  const fetchProduct = () => {
    console.log("shodetail", route.params);
    setShowLoading(true);
    checkStorage("USER_PHARMACY", (response: any) => {
      const pharmacy = JSON.parse(response);
      const url = "/products/getPharmaciesProductByid";
      const params = route.params;
      const data = {
        id: params.productId,
        pharmacy_id: 566,
      };
      sendData(url, data).then((response: any) => {
        hideLoadingModal(() => {
          if (Object.keys(response).length > 0) {
            const product = response["pharmacyProduct"];
            setProduct(product);
            const url2 = `/gallery/getImgs/${product.product_id}`;
            fetchData(url2).then((response2: any) => {
              if (response2.ok) {
                setProduct_imgs([
                  { url: product.product_img },
                  ...response2.imagens,
                ]);
                setProduct_img({ url: product.product_img });
              }
            });
            setTicketPrice(product.price);
          } else {
            setProduct({});
            setProduct(0);
          }
        });
      });
    });
  };

  const modifyPrice = (type: number) => {
    let price: number = ticketPrice;
    let quantity: number = ticketAmount;
    if (type == 1) {
      price = +price + +ticket.price;
      quantity += 1;
    } else {
      price = price - ticket.price;
      quantity -= 1;
    }
    
    if (quantity <= ticket.amount) {
      console.log(price)
      if (price >= ticket.price) {
        setTicketAmount(quantity);
        setTicketPrice(roundNumber(price));
      }
    } else {
      showErrorToast(translation.t("productDetailsMaxQuantityError")); // The quantity is greater than the stock, please choose a lesser one.
    }
  };

  const roundNumber = (number: number) => {
    return Number.parseFloat((Math.round(number * 100) / 100).toFixed(2));
  };

  const addProductToShoppingCart = (id: string) => {
    const shoppingProduct = {
      user_id: id,
      ticket_id: ticket.id,
      amount: ticketAmount,
      price: ticketPrice,
    };
    console.log(shoppingProduct);
    const url = "/tickets/addToCart";
    sendData(url, shoppingProduct).then((response) => {
      if (response.ok) {
        Alert.alert(
          translation.t("alertInfoTitle"), // Information
          translation.t("productDetailsAddedProductText"), // Product added to shopping cart
          [
            {
              text: translation.t("productDetailsKeepBuyingText"), // Keep Buying
              onPress: () => {
                navigation.navigate("Root", { screen: "home" });
              },
            },
            {
              text: translation.t("productDetailsGoCartText"), // Go to Cart
              onPress: () => {
                navigation.navigate("Root", { screen: "ShoppingCart" });
              },
            },
          ]
        );
      } else {
        showErrorToast(translation.t("httpConnectionError"));
      }
    });
  };

  const addToCart = () => {
    setShowLoading(true);
    checkLoggedUser(
      (id: string) => {
        const url = "/tickets/getCartByids";
        const data = {
          user_id: id,
          ticket_id: ticket.id,
        };
        console.log("add to cart", data);
        sendData(url, data)
          .then((response: any) => {
            hideLoadingModal(() => {
              if (response.ok) {
                const ticketsCart = response["ticketsCart"];
                if (ticketAmount + ticketsCart?.amount <= ticket?.amount) {
                  addProductToShoppingCart(id);
                } else
                  showErrorToast(translation.t("productDetailsMaxStockError")); // The quantity of this product whithin the shopping cart has reached the maximum available, either choose a lesser quantity to add or remove it.
              } else {
                addProductToShoppingCart(id);
              }
            });
          })
          .catch((error) => {
            hideLoadingModal(() => {
              showErrorToast(translation.t("httpConnectionError"));
              console.log(error);
            });
          });
      },
      navigation,
      translation
    );
  };

  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };


  return (
    <Container>
      <ScrollView style={{ paddingHorizontal: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "flex-end",
              marginHorizontal: 5,
              borderWidth: 1,
              borderRadius: 10,
              padding: 2,
              borderColor: "#b2b9c9",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View
              style={{
                borderRadius: 5,
                marginHorizontal: 5,
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={33}
                style={{ color: "#000" }}
              />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: "center",
              fontSize: 23,
              fontWeight: "500",
              width: "70%",
            }}
          >
            Tickets
          </Text>
        </View>
        <Loading showLoading={showLoading} translation={translation} />

        <View>
          <Text style={{ fontWeight: "500", color: "#8B8B97" }}>
            Categorias
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={ticketsArr}
            search
            // value={rou}
            labelField="ticketCategory_name"
            valueField="id"
            maxHeight={300}
            placeholder={"Selecciona ticket"}
            searchPlaceholder={"Busca ticket"}
            onChange={(items: any) => {
              setTicket(
                ticketsArr.find((ticket: any) => ticket.id == items.id)
              );
              setTicketPrice(
                ticketsArr.find((ticket: any) => ticket.id == items.id)?.price
              );
            }}
          />
          <MaterialIcons
            style={styles.inputIconOther}
            name="location-pin"
            size={20}
            color="black"
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.productName}>{ticket.ticketCategory_name}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text style={styles.ticketPrice}>{formatter(ticketPrice)}</Text>
            {ticket.amount > 0 && (
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
                  {ticketAmount}
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
          {(ticket.amount > 0 && (
            <TouchableOpacity style={styles.productAdd} onPress={addToCart}>
              <Text style={styles.productAddText}>
                 Add to cart
              </Text>
            </TouchableOpacity>
          )) ||
            (ticket.amount == 0 && (
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
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    flexDirection: "column",
    marginBottom: 60,
  },
  headerImage: {
    marginBottom: 20,
    height: 220,
    width: "100%",
    borderRadius: 10,
  },
  locationMap: {
    marginBottom: 20,
    height: 190,
    width: "100%",
    borderRadius: 10,
  },
  sectionTitle: {
    fontWeight: "500",
    color: "gray",
    fontSize: 15,
  },
  sectionText: {
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#b2b9c9",
    paddingBottom: 10,
    marginTop: 6,
  },
  datesContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  // Tickets

  ticketDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: "#b2b9c9",
  },

  productImage: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderRadius: 20,
  },
  productName: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "600",
  },
  ticketPrice: {
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
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 5,
  },
  productAddText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },

  // DROPDOWN STYLES

  dropdown: {
    height: 55,
    borderBottomColor: "gray",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    paddingLeft: 40,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#CCCCCD",
    paddingLeft: 10,
    fontWeight: "500",
  },
  selectedTextStyle: {
    height: 50,
    width: "100%",
    borderColor: "#F7F7F7",
    borderWidth: 0.5,
    backgroundColor: "#F7F7F7",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 13,
    borderRadius: 5,
    marginBottom: 3,
    fontSize: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "#5f7ceb",
  },
  inputSearchStyle: {
    height: 50,
    borderColor: "#F7F7F7",
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
  },
  inputIconOther: {
    position: "absolute",
    left: 4,
    top: "35%",
    zIndex: 2,
    padding: 10,
    color: "#0F3D87",
  },
});
