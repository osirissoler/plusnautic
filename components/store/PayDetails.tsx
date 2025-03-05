import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, Text } from "react-native";
import { LanguageContext } from "../../LanguageContext";
import { fetchData, sendData } from "../../httpRequests";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { Loading } from "../Shared";
import WebView from "react-native-webview";
import AddressesScreen from "../../screens/AddressesScreen";
import { formatter, showGoodToast } from "../../utils";
import { StripeProvider } from "@stripe/stripe-react-native";
import usePayment from "../../hooks/usePayment";

export default function PayDetails({ navigation, route }: any) {
  const { item } = route.params;
  const { translation } = React.useContext(LanguageContext);
  // const [showLoading, setShowLoading]: any = useState(false);
  const URLToRiderect = "https://panel-plusnautic.netlify.app/success";
  const [placetoPayUrl, setplacetoPayUrl]: any = useState("");
  const [showPlaceToPayview, setshowPlaceToPayview]: any = useState(false);
  const [requestId, setrequestId]: any = useState("");
  const [id, setId]: any = useState(0);
  const [placeToPayOperationFineshed, setplaceToPayOperationFineshed]: any =
    useState(false);
  const [contador, setContador]: any = useState(0);
  const [clientDirection_id, setClientDirection_id]: any = useState(null);

  const { publishableKey, initializePaymentSheet, showLoading, setShowLoading } =
    usePayment(item);

  async function getIpClient() {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error(error);
    }
  }

  // console.log(item)

  const sendPayments = async () => {
    setShowLoading(true);
    const url = `/placetopay/save/saveRequesIdFacilitoPay`;
    const data = {
      ipAdress: await getIpClient(),
      description: "Pago de producto de tiendas",
      returnUrl: URLToRiderect,
      amount: item.total,
      reference: Math.random().toString(36).substring(2),
      user_id: item.user_id,
      code: "PLUSNAUTICSTORE",
    };
    console.log(data, "pli");
    await sendData(url, data)
      .then((response) => {
        setplacetoPayUrl(response.data.processUrl);
        setshowPlaceToPayview(true);
        setrequestId(response.data.requestId);
        setId(response.id);
        setShowLoading(false);
      })
      .catch((e) => {
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
        setShowLoading(true);
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

  const createOrder = () => {
    try {
      const url = `/store/createOrder/${item.user_id}`;
      sendData(url, { ...item, clientDirection_id }).then((res) => {
        if (res.ok) {
          showGoodToast(res.mensaje)
          navigation.navigate("Home");
        }
      });
    } catch (err) {

    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <Loading showLoading={showLoading} translation={translation} />

      <StripeProvider publishableKey={publishableKey}>
        <View></View>
      </StripeProvider>

      {!placeToPayOperationFineshed && showPlaceToPayview && (
        <View style={{ height: "100%" }}>
          <WebView
            source={{ uri: placetoPayUrl }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </View>
      )}
      <View style={{ borderWidth: 0, height: "69%" }}>
        {item.shippingPrice !== 0 ? (
          <AddressesScreen
            navigation={navigation}
            translation={translation}
            direction={(value: any) => {
              console.log(value)
              setClientDirection_id(value);
            }}
          />
        ) : (
          <View style={{}}>
            <Text>
              Las direcione de entrenga no estan dispoble ya que no tienen envio
              agregados
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          marginTop: 10,
          height: "18%",
          borderWidth: 0,
          paddingHorizontal: 8,
        }}
      >
        <View style={styles.cartPrices}>
          <Text>Sub Total</Text>
          <Text style={styles.cartPrice}>{formatter(item.amount)}</Text>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text>IVU Estatal</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>{formatter(item.stateTax)}</Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            {item.isoCode === "DO" ? (
              <Text>ITBIS </Text>
            ) : (
              <Text>IVU Municipal</Text>
            )}
          </View>
          <View>
            <Text style={styles.cartPrice}>{formatter(item.municipalTax)}</Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text> {translation.t("TransactionCost")}</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>
              {formatter(item.transationFee)}
            </Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text> {translation.t("ShippingCost")}</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>
              {formatter(item.shippingPrice)}
            </Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Total</Text>
          </View>
          <View>
            <Text style={{ ...styles.cartPrice, fontWeight: "bold" }}>
              {formatter(item.total)}
            </Text>
          </View>
        </View>
      </View>
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
                    // sendPayments();
                    initializePaymentSheet(createOrder);
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
const styles = StyleSheet.create({
  cartPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  cartPrice: {
    textAlign: "right",
  },
});
