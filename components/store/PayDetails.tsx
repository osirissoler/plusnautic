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
  ScrollView,
} from "react-native";
import { LanguageContext } from "../../LanguageContext";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { Loading } from "../Shared";
import WebView from "react-native-webview";

export default function PayDetails({ navigation, route }: any) {
  console.log(route.params.item);
  const [item, setItem]: any = useState(route.params.item);
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const URLToRiderect = "https://panel-plusnautic.netlify.app/success";
  const [placetoPayUrl, setplacetoPayUrl]: any = useState("");
  const [showPlaceToPayview, setshowPlaceToPayview]: any = useState(false);
  const [requestId, setrequestId]: any = useState("");
  const [id, setId]: any = useState(0);
  const [placeToPayOperationFineshed, setplaceToPayOperationFineshed]: any =
    useState(false);
  const [contador, setContador]: any = useState(0);

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
      amount: item.total,
      reference: Math.random().toString(36).substring(2),
      user_id: item.user_id,
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

  const consulting = async () => {
    const url = `/placeToPay/consultSessionStripeFacilitoPay/${requestId}`;
    fetchData(url).then(async (res) => {
      if (res.payment_status == "REJECTED") {
        navigation.goBack();
      } else if (res.payment_status == "PENDING") {
        consulting();
      } else if (res.payment_status == "APPROVED") {
        const url = `/store/createOrder/${item.user_id}`;
        sendData(url, { ...item }).then((res) => {
          if(res.ok){
          navigation.goBack();
          }
        });
        // navigation.goBack();
        // alerta();
        // const url2 = `/services/updateUserServicesCompleted/${items.id}/${id}`;
        // sendDataPut(url2, {}).then((res) => {
        //   if (res.ok) {
        //     showErrorToastGood("Request made correctly");
        //     // navigation.navigate("Profile");
        //     const data = {
        //       typeServices_id: items.Services.TypeServices.id,
        //       user_id: items.user_id,
        //       driver_id: items.driver_id,
        //       amountOfPayments: items.Services.TypeServices.amountOfPayments,
        //       userServices_id: items.id,
        //     };
        //     sendData(
        //       `/servicesNotification/createServicesNotificationPayment`,
        //       data
        //     ).then((res2) => {
        //       if (res2.ok) {
        //         // navigation.navigate("Profile");
        //         navigation.goBack();
        //       }
        //     });
        //   }
        // });
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
    <View style={{ height: "100%" }}>
      <Loading showLoading={showLoading} translation={translation} />
      {!placeToPayOperationFineshed && showPlaceToPayview && (
        <View style={{ height: "100%" }}>
          <WebView
            source={{ uri: placetoPayUrl }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </View>
      )}
      <View style={{ height: "13%" }}>
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
                    //   handleBackButtonClick();
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
      </View>
    </View>
  );
}