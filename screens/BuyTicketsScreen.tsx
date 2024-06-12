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
  Pressable,
} from "react-native";

import HeaderComponent from "../components/Header";
import {
  checkLoggedUser,
  checkStorage,
  Container,
  Loading,
} from "../components/Shared";
import { sendData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import { AntDesign } from "@expo/vector-icons";
import { formatter } from "../utils";
import Toast from "react-native-root-toast";
import { Dropdown } from "react-native-element-dropdown";
import { CheckBox } from "react-native-elements";

export default function BuyTicketsScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [ticketsArr, setTicketsArr] = useState(route.params.tickets);
  const [ticket, setTicket]: any = useState({});
  const [showLoading, setShowLoading]: any = useState(false);
  const [ticketPrice, setTicketPrice]: any = useState(0.0);
  const [ticketAmount, setTicketAmount]: any = useState(1);
  const [selectedIndex, setSelectedIndex] = useState("");


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
      console.log(price);
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
              // onPress: () => {
              //   navigation.navigate("Root", { screen: "home" });
              // },
            },
            {
              text: translation.t("productDetailsGoCartText"), // Go to Cart
              onPress: () => {
                navigation.navigate("ShoppingCart");
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
      <View style={{ paddingHorizontal: 25 }}>
        <Loading showLoading={showLoading} translation={translation} />

        <Text
          style={{
            fontSize: 20,
            fontWeight: "500",
            marginVertical: 12,
            marginTop: 15,
          }}
        >
          {translation.t("SelectTicketsMsg")}
        </Text>

        <FlatList
          style={{
            paddingHorizontal: 15,
            backgroundColor: "#F2F2F2",
            height: "65%",
            marginTop: 10,
            paddingTop: 5,
            borderRadius: 10,
          }}
          // refreshing={isFetching}
          // onRefresh={onRefresh}
          data={ticketsArr}
          renderItem={({ item, index }) => (
            <TicketCard
              key={index}
              item={item}
              index={index}
              selectedIndex={selectedIndex}
              setTicket={setTicket}
              setTicketPrice={setTicketPrice}
              setSelectedIndex={setSelectedIndex}
              setTicketAmount={setTicketAmount}
            />
          )}
        />

        {parseInt(selectedIndex) >= 0 && (
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
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
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
            {ticket.amount > 0 ? (
              <TouchableOpacity style={styles.productAdd} onPress={addToCart}>
                <Text style={styles.productAddText}>
                  {translation.t("AddProductCar")}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                {translation.t("productDetailsStockError")}
              </Text>
            )}
          </View>
        )}
      </View>
    </Container>
  );
}

function TicketCard({
  item,
  index,
  selectedIndex,
  setTicket,
  setTicketPrice,
  setSelectedIndex,
  setTicketAmount,
}: any) {
  const isSelected = index === selectedIndex;

  return (
    <TouchableOpacity
      onPress={() => {
        setTicket(item);
        setTicketPrice(item?.price);
        setSelectedIndex(index);
        setTicketAmount(1)
      }}
    >
      <View style={styles.productCard}>
        <Pressable>
          <CheckBox
            checked={isSelected}
            checkedColor="#5f7ceb"
            onPress={() => {
              setTicket(item);
              setTicketPrice(item?.price);
              setSelectedIndex(index);
              setTicketAmount(1)
            }}
          />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            position: "relative",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/invitados.png")}
            style={{ resizeMode: "cover", height: 80, width: 80 }}
          />
          <View>
            <Text style={styles.productTitle}>{item.ticketCategory_name}</Text>
            <Text style={styles.productPrice}>{formatter(item.price)}</Text>
          </View>
        </View>
      </View>
      <View style={{ ...styles.circle, top: "35%", left: -20 }} />
      <View style={{ ...styles.circle, top: "35%", right: -20 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    flexDirection: "column",
    height: "20%",
  },

  // Tickets

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

  // TICKET CARD

  productCard: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    position: "relative",
    backgroundColor: "#fff",
    height: 150,
  },
  circle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    position: "absolute",
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
