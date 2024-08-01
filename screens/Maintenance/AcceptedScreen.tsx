import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import asyncStorage from "@react-native-async-storage/async-storage";
import { fetchData, sendData, sendDataPut } from "../../httpRequests";
import { Ionicons } from "@expo/vector-icons";
import { formatter } from "../../utils";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import ProfileScreen from "../ProfileScreen";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import { LanguageContext } from "../../LanguageContext";
import Toast from "react-native-root-toast";
import StepIndicator from "react-native-step-indicator";
import axios from "axios";
import WebView from "react-native-webview";
import { checkStorage, Loading } from "../../components/Shared";
import ServicesNotificationPayments from "./ServicesNotificationPayments";
import SendReview from "../gestor/Review";

export default function AcceptedScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [service_id, setService_id]: any = useState(route.params.service_id);
  const [minDate, setMinDate] = useState(moment().format("YYYY-MM-DD"));
  const [firstDate, setFirstDate]: any = useState(route.params.item.startDate);
  const [allDate, setAllDate]: any = useState(null);
  const [lastdate, setLastDate]: any = useState(route.params.item.finalDate);
  const [token, setToken]: any = useState("");
  const [userLogged, setUserLogged]: any = useState({});

  const [items, setItems]: any = useState(route.params.item);
  // console.log(items.driver_id, "item");
  const [priceP, setPriceP]: any = useState(route.params.item.price);
  const [currentPosition, setcurrentPosition]: any = useState(0);
  const URLToRiderect = "https://panel-plusnautic.netlify.app/success";
  const [placeToPayOperationFineshed, setplaceToPayOperationFineshed]: any =
    useState(false);
  const [showPlaceToPayview, setshowPlaceToPayview]: any = useState(false);
  const [placetoPayUrl, setplacetoPayUrl]: any = useState("");
  const [showLoading, setShowLoading]: any = useState(false);
  const [requestId, setrequestId]: any = useState("");
  const [contador, setContador]: any = useState(0);
  const [id, setId]: any = useState(0);
  // console.log("aqu", route.params.item.signatureUSer);
  useEffect(() => {
    fillMarkedDatesAll();
  }, []);

  const fillMarkedDatesAll = () => {
    let saveDAte: any = {};
    saveDAte[firstDate] = {
      startingDay: true,
      color: "#5f7ceb",
      textColor: "white",
    };
    saveDAte[lastdate] = {
      endingDay: true,
      color: "#5f7ceb",
      textColor: "white",
    };

    let fechas = [];
    let init = moment(firstDate);
    let fin = moment(lastdate);

    while (init.isSameOrBefore(fin)) {
      fechas.push(init.format("YYYY-MM-DD").toString());
      init.add(1, "days");
    }
    fechas.pop();
    fechas.shift();
    fechas.forEach((e) => {
      saveDAte[e] = { color: "#5f7ceb", textColor: "white" };
    });

    setAllDate(saveDAte);
  };

  const reload = () => {};
  const acceptRequest = async () => {
    const url = `/services/updateUserServicesAccepted`;
    const data = {
      user_id: items.user_id,
      service_id: items.service_id,
      id: items.id,
    };
    sendDataPut(url, data).then((response) => {
      if (response.ok) {
        showErrorToastGood("Request made correctly");
        // navigation.navigate("Profile");
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Service' }]
        // });
        navigation.goBack();
      }
    });
  };

  const showErrorToastGood = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "#128780", width: "80%" },
    });
  };

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  async function getIpClient() {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error(error);
    }
  }
  const sendPayments = async () => {
    setShowLoading(true);
    const url = `/placetopay/save/saveRequesIdFacilitoPay`;
    const data = {
      ipAdress: await getIpClient(),
      description: "Pago de mantenimiento",
      returnUrl: URLToRiderect,
      amount: priceP,
      reference: Math.random().toString(36).substring(2),
      userServices_id: items.id,
      paymentNumber: 1,
      pharmacy_id: 534,
      user_id: items.user_id,
      token_client: items.services_token,
      code: "PLUSNAUTIC"
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
        // console.log("Razon del  fallo", e);
        setShowLoading(false);
      });
    setShowLoading(false);
  };

  const reset = () => {
    // checkStorage("USER_PHARMACY", (response: any) => {
    //   const pharmacy = JSON.parse(response);
    //   navigation.reset({
    //     index: 0,
    //     routes: [
    //       {
    //         name: "Root",
    //         params: {
    //           phId: 566,
    //           phName: pharmacy.name,
    //         },
    //         screen: "Home",
    //       },
    //     ],
    //   });
    // });
    navigation.goBack();
  };

  const alerta = () => {
    Alert.alert(
      translation.t("pagoAlertTitle"),
      translation.t("pagoAlertConten"),
      [
        {
          text: "OK",
          onPress: () => {
            // navigation.goBack();
          },
        },
      ]
    );
  };

  const consulting = async () => {
    const url = `/placeToPay/consultSessionStripeFacilitoPay/${requestId}`;
    fetchData(url).then(async (res) => {
      if (res.payment_status == "REJECTED") {
        reset();
      } else if (res.payment_status == "PENDING") {
        consulting();
      } else if (res.payment_status == "APPROVED") {
        alerta();
        const url2 = `/services/updateUserServicesCompleted/${items.id}/${id}`;
        sendDataPut(url2, {}).then((res) => {
          if (res.ok) {
            showErrorToastGood("Request made correctly");
            // navigation.navigate("Profile");
            const data = {
              typeServices_id: items.Services.TypeServices.id,
              user_id: items.user_id,
              driver_id: items.driver_id,
              amountOfPayments: items.Services.TypeServices.amountOfPayments,
              userServices_id: items.id,
            };
            sendData(
              `/servicesNotification/createServicesNotificationPayment`,
              data
            ).then((res2) => {
              if (res2.ok) {
                // navigation.navigate("Profile");
                navigation.goBack();
              }
            });
          }
        });
      }
    });
  };

  const onNavigationStateChange = (state: any) => {
    if (state.navigationType === "other") {
      if (state.url != placetoPayUrl) {
        if (contador === 0) {
          setContador(contador + 1);
          consulting();
        }
      }
    }
  };
  return (
    <View
      style={{ height: "100%", backgroundColor: "#ffffff", borderWidth: 0 }}
    >
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
        <View style={{ height: "100%", backgroundColor: "white" }}>
          <ScrollView>
            <View
              style={{
                height: "auto",
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={styles.labelInput}>
                {translation.t("EstimatedPrice")} {formatter(items.price)}
              </Text>
            </View>

            <View style={{ height: "auto", paddingHorizontal: 10 }}>
              <Calendar
                style={{
                  borderColor: "gray",
                  height: 310,
                }}
                theme={{
                  backgroundColor: "#5f7ceb",
                  textSectionTitleColor: "#5f7ceb",
                  selectedDayBackgroundColor: "blue",
                  textDisabledColor: "grey",
                  arrowColor: "black",
                }}
                minDate={minDate}
                markingType={"period"}
                markedDates={allDate}
              ></Calendar>
            </View>

            <View
              style={{
                height: "auto",
                justifyContent: "center",
                borderWidth: 0,
                paddingVertical: 20,
              }}
            >
              <View
                style={{
                  height: "auto",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 20,
                }}
              >
                {firstDate == null ? (
                  <Text style={{ color: "#5f7ceb" }}>
                    {moment().format("LL").toUpperCase()}
                  </Text>
                ) : (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#5f7ceb" }}>
                      {/* <Text style={{ color: 'black' }}> Selected date </Text> */}
                      ({moment(firstDate).format("LL").toUpperCase()})
                    </Text>
                    <Text> {lastdate != null ? "to" : ""} </Text>
                    {lastdate != null ? (
                      <Text style={{ color: "#5f7ceb" }}>
                        ({moment(lastdate).format("LL").toUpperCase()})
                      </Text>
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                )}
              </View>
            </View>

            {items.Services.isPaid == true &&
              items.Services.servicesStatus_id != 3 && (
                <View style={{ height: "23%" }}>
                  <ServicesNotificationPayments
                    items={items}
                    navigation={navigation}
                  />
                </View>
              )}
            {/* evaluacion */}
            {items.Services.servicesStatus_id === 3 && (
              <View style={{ alignItems: "center" }}>
                <View>
                  <TouchableOpacity
                    style={styles.productCard2}
                    onPress={() => {
                      navigation.navigate("Gestor", {
                        img: items.driver_img,
                        name: items.driver_first_name,
                        lastName: items.driver_last_name,
                        id: items.driver_id,
                      });
                    }}
                  >
                    <ImageBackground
                      source={{
                        uri:
                          items.driver_img == null || items.driver_img == ""
                            ? "https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png"
                            : items.driver_img,
                      }}
                      style={{ height: 70, width: 70, borderRadius: 100 }}
                      resizeMode={"cover"}
                      imageStyle={{ borderRadius: 100 }}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontWeight: "bold", fontSize: 19 }}>
                  {items.driver_first_name} {items.driver_last_name}
                </Text>
                
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    backgroundColor: "#5f7ceb",
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  onPress={() => {
                    navigation.navigate("Gestor", {
                      img: items.driver_img,
                      name: items.driver_first_name,
                      lastName: items.driver_last_name,
                      id: items.driver_id,
                    });
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    {translation.t("review")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: "auto", alignItems: "center", marginTop: 15, }}>
              {items.Services.servicesStatus_id === 3 && (
                <View style={{ height: "23%", alignItems: "center" }}>
                  <Image
                    source={{
                      uri: items.signatureUSer,
                    }}
                    style={{ height: 90, width: 150 }}
                  />
                  <View>
                    <Text>-------------------------------</Text>
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Signature
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {items.Services.isPaid == false && (
            <View style={{ height: "15%" }}>
              {!items.accepted ? (
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#5f7ceb",
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopEndRadius: 15,
                    borderTopLeftRadius: 15,
                  }}
                  onPress={() => {
                    Alert.alert(
                      translation.t("alertWarningTitle"),
                      translation.t("acceptedRequest"),
                      [
                        {
                          text: "Yes",
                          onPress: () => {
                            acceptRequest();
                          },
                        },
                        {
                          text: "No",
                          onPress: () => {
                            handleBackButtonClick();
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign
                      name="checkcircleo"
                      size={26}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {translation.t("Accept")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    backgroundColor: "#5f7ceb",
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",

                    borderTopEndRadius: 15,
                    borderTopLeftRadius: 15,
                  }}
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
                          onPress: () => {
                            handleBackButtonClick();
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                      name="dollar"
                      size={26}
                      color="white"
                      style={{ marginRight: 5 }}
                    />
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {translation.t("checkoutPayNowText")}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    height: "85%",
    backgroundColor: "white",
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  productImage: {
    height: "69%",
    marginTop: "2%",
  },
  productCard2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3ecec",
    borderRadius: 60,
    marginVertical: 10,
    marginHorizontal: 10,
    width: 70,
    height: 70,
  },
  productTitle2: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  productAdd: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#DE221E",
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  productAddText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  labelInput: {
    fontSize: 18,
    color: "black",
    marginTop: 5,
    fontWeight: "700",
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingRight: 35,
    paddingLeft: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(243, 27, 27, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  picker: {
    color: "red",
  },
  calendar: {
    backgroundColor: "dark",
  },
});
