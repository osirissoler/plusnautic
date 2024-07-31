import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { checkLoggedUser, Container, Loading } from "../components/Shared";
import HeaderComponent from "../components/Header";
import { fetchData, sendData, sendDataPut } from "../httpRequests";
import { checkStorage } from "../components/Shared";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { formatter } from "../utils";
import WebView from "react-native-webview";
import axios from "axios";

export default function ShoppingCartScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [user_id, setUser_id] = useState("");
  const [tickets, setTickets]: any = useState([]);
  const [isFetching, setIsFetching]: any = useState(false);
  const [totalPrice, setTotalPrice]: any = useState("");
  const [placetoPayUrl, setplacetoPayUrl]: any = useState("");
  const [contador, setContador]: any = useState(0);
  const URLToRiderect = "https://panel-plusnautic.netlify.app/success";
  const [showPlaceToPayview, setshowPlaceToPayview]: any = useState(false);
  const [requestId, setrequestId]: any = useState("");
  const [id, setId]: any = useState(0);
  const [showLoading, setShowLoading]: any = useState(false);
  const [placeToPayOperationFineshed, setplaceToPayOperationFineshed]: any =
    useState(false);

  useEffect(() => {
    const unsuscribe = navigation.addListener("focus", () => {
      checkLoggedUser(() => getTicketsCart(), navigation, translation);
    });
    return unsuscribe;
  }, []);

  const getTicketsCart = () => {
    checkStorage("USER_LOGGED", (id: any) => {
      setUser_id(id);
      const url = `/tickets/getCart/${id}`;
      fetchData(url).then((response: any) => {
        console.log(response);
        if (response.ok) {
          setTickets(response.ticketsCart);
          setTotalPrice(response.totalPrices);
          // calculatePrices(products);
        } else {
          setTickets([]);
          //   calculatePrices([]);
        }
        setIsFetching(false);
      });
    });
  };

  const deleteTicket = (ticket: any) => {
    Alert.alert(
      translation.t("alertWarningTitle"),
      translation.t("shoppingCartRemoveItemText"), // Do you want to remove this item?
      [
        {
          text: translation.t("alertButtonYesText"), // Yes
          onPress: () => {
            const url = `/tickets/removeFromCart/${ticket.id}`;
            sendData(url, {}).then(() => onRefresh());
          },
        },
        {
          text: translation.t("alertButtonNoText"), // No
        },
      ]
    );
  };

  const modifyPrice = (type: number, ticket: any) => {
    let price: number = ticket.tickets_price;
    let quantity: number = ticket.amount;
    const url = `/tickets/updateTicketCartAmount/${ticket.id}`;

    if (type == 1) {
      price = price + ticket.tickets_price;
      quantity += 1;
    } else {
      if (quantity == 1) {
        return;
      }

      price = price - ticket.tickets_price;
      quantity -= 1;
    }

    if (quantity <= ticket.tickets_amount) {
      // console.log(ticket.tickets_price * quantity);
      sendDataPut(url, {
        amount: quantity,
        price: roundNumber(parseInt(ticket.tickets_price) * quantity),
      }).then(() => onRefresh());
      //  setTicketAmount(quantity);
      //  setTicketPrice(roundNumber(price));
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

  const onRefresh = () => {
    setIsFetching(true);
    getTicketsCart();
  };

  const roundNumber = (number: number) => {
    //por que lo multiplicas y lo divides? parace inecesario. Nota: revisar esta funcion
    return Number.parseFloat((Math.round(number * 100) / 100).toFixed(2));
  };

  const onNavigationStateChange = (state: any) => {
    console.log(state.url, "state", "placetoPayUrl", placetoPayUrl);
    // if (state.navigationType === "other") {
    if (state.url != placetoPayUrl) {
      if (contador === 0) {
        setContador(contador + 1);
        consulting();
      }
    }
    // }
  };

  const sendPayments = async () => {
    setShowLoading(true);
    const url = `/placetopay/save/saveRequesIdFacilitoPay`;
    const data = {
      ipAdress: await getIpClient(),
      description: "Pago de tickets",
      returnUrl: URLToRiderect,
      amount: totalPrice,
      reference: Math.random().toString(36).substring(2),
      paymentNumber: 1,
      code: "PLAU",
    };
    await sendData(url, data)
      .then((response) => {
        setplacetoPayUrl(response.data.processUrl);
        setshowPlaceToPayview(true);
        setrequestId(response.data.requestId);
        setId(response.id);
        setShowLoading(false);
      })
      .catch((e) => {
        console.log("Razon del  fallo", e);
        setShowLoading(false);
      });
    setShowLoading(false);
  };

  async function getIpClient() {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error(error);
    }
  }

  const alerta = () => {
    Alert.alert(
      translation.t("pagoAlertTitle"),
      translation.t("pagoAlertConten"),
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Root");
          },
        },
      ]
    );
  };

  const consulting = async () => {
    const url = `/placeToPay/consultSessionStripeFacilitoPay/${requestId}`;
    const urlApproved = `/tickets/createOrUpdateTicketUser`;

    fetchData(url).then(async (res: any) => {
      if (res.payment_status == "REJECTED") {
        console.log("REJECTED");
        navigation.goBack();
      } else if (res.payment_status == "PENDING") {
        console.log("PENDING");
        consulting();
      } else if (res.payment_status == "APPROVED") {
        const mappedData = tickets.map((ticket: any) => {
          return {
            user_id: ticket.user_id,
            ticket_id: ticket.ticket_id,
            placeToPayRequestId_id: id,
            price: ticket.price,
            amount: ticket.amount,
            category_code: ticket.ticketCategory_code
          };
        });

        await sendData(urlApproved, { mappedData, user_id }).then(
          (response) => {
            alerta();
          }
        );
      }
    });
  };

  return (
    <Container>
      <View style={{ paddingHorizontal: 15 }}>
        <Loading showLoading={showLoading} translation={translation} />

        {!placeToPayOperationFineshed && showPlaceToPayview && (
          <View style={{ height: "100%" }}>
            <WebView
              source={{ uri: placetoPayUrl }}
              onNavigationStateChange={onNavigationStateChange}
            />
          </View>
        )}
        {!(!placeToPayOperationFineshed && showPlaceToPayview) && (
          <View style={{ height: "100%" }}>
            <HeaderComponent />
            <View style={styles.body}>
              {tickets?.length == 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    // flex: 1,
                    alignItems: "center",
                    // backgroundColor: '#128780',
                    borderRadius: 5,
                    height: "100%",
                  }}
                >
                  <View style={styles.imageParent}>
                    <Image
                      style={styles.image}
                      source={require("../assets/images/non-tickets.png")}
                    />
                  </View>
                  <Text style={styles.productCount}>
                    {translation.t("shoppingCartTicketsCountText")}
                  </Text>
                </View>
              ) : (
                <FlatList
                  style={{
                    paddingHorizontal: 15,
                    backgroundColor: "#F2F2F2",
                    maxHeight: "75%",
                    paddingTop: 5,
                    borderRadius: 10,
                  }}
                  refreshing={isFetching}
                  onRefresh={onRefresh}
                  data={tickets}
                  renderItem={({ item }) => (
                    <TicketCard
                      item={item}
                      deleteTicket={deleteTicket}
                      modifyPrice={modifyPrice}
                    />
                  )}
                />
              )}

              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  height: "25%",
                }}
              >
                <View style={{ width: "100%" }}>
                  {tickets?.length != 0 && (
                    <View style={styles.cartPrices}>
                      <Text style={{ fontWeight: "700", fontSize: 16 }}>
                        Total
                      </Text>
                      <Text
                        style={[
                          styles.cartPrice,
                          { fontWeight: "700", fontSize: 16 },
                        ]}
                      >
                        {formatter(totalPrice)}
                      </Text>
                    </View>
                  )}

                  {tickets?.length != 0 && (
                    <Pressable
                      style={[
                        styles.buttonCheckout,
                        Object.keys(tickets).length == 0
                          ? { backgroundColor: "#12878050" }
                          : null,
                      ]}
                      disabled={Object.keys(tickets).length == 0}
                      onPress={() => {
                        Alert.alert(
                          translation.t("alertWarningTitle"),
                          translation.t("acceptedRequest"),
                          [
                            {
                              text: "Yes",
                              onPress: () => {
                                sendPayments();
                              },
                            },
                            {
                              text: "No",
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.buttonCheckoutText}>
                        {
                          translation.t(
                            "shoppingCartFinalizeText"
                          ) /* Finalize Purchase */
                        }
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </Container>
  );
}

function TicketCard({ item, deleteTicket, modifyPrice }: any) {
  return (
    <>
      <View style={styles.productCard}>
        <Ionicons
          name="close-circle"
          size={25}
          style={styles.productCardDelete}
          onPress={() => deleteTicket(item)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            position: "relative",
          }}
        >
          <View style={styles.productImage}>
            {item.event_code == "BOAT_SHOW" ? (
              <Image
                source={require("../assets/images/invitados.png")}
                style={{ resizeMode: "cover", height: "100%", width: "100%" }}
              />
            ) : (
              <Image
                source={require("../assets/images/ticket.png")}
                style={{ resizeMode: "cover", height: "100%", width: "100%" }}
              />
            )}
          </View>
          <View style={{ justifyContent: "space-between", width: 160 }}>
            <Text style={styles.productTitle}>{item.event_name}</Text>
            <Text style={styles.productTitle}>{item.ticketCategory_name}</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.productPrice}>{formatter(item.price)}</Text>
              <View style={styles.productAdd}>
                <AntDesign
                  name="minus"
                  size={24}
                  style={styles.productAddIcon}
                  onPress={() => modifyPrice(2, item)}
                />
                <Text style={{ fontSize: 20, alignSelf: "center" }}>
                  {item.amount}
                </Text>
                <AntDesign
                  name="plus"
                  size={24}
                  style={styles.productAddIcon}
                  onPress={() => modifyPrice(1, item)}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ ...styles.circle, top: "35%", left: -20 }} />
      <View style={{ ...styles.circle, top: "35%", right: -20 }} />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: 20,
    backgroundColor: "#fff",
    height: "100%",
  },
  productCount: {
    fontSize: 20,
    marginBottom: 10,
    marginVertical: 20,
    color: "red",
    textAlign: "center"
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
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    position: "relative",
    backgroundColor: "#fff",
  },
  circle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    position: "absolute",
  },
  productCardDelete: {
    color: "red",
    position: "absolute",
    right: 1,
    top: 0,
  },
  productImage: {
    height: 80,
    width: 80,
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
    color: "#5f7ceb",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    borderRadius: 10,
    padding: 2,
  },
  cartPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  cartPrice: {
    textAlign: "right",
  },
  buttonCheckout: {
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
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
