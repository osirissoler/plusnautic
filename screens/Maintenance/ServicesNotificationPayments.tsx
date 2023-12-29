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
} from "react-native";
import * as Progress from "react-native-progress";
import { fetchData, sendData } from "../../httpRequests";
import { LanguageContext } from "../../LanguageContext";
import Toast from "react-native-root-toast";

export default function ServicesNotificationPayments({
  items,
  navigation,
}: any) {
  const { translation } = React.useContext(LanguageContext);
  const [item, setItem]: any = useState(items);
  const [payNumber, setPayNumber]: any = useState(0);
  const [amountOfPayments, setAmountOfPayments]: any = useState(0);
  const [contador, setContador]: any = useState(0);

  useEffect(() => {
    getServicesNotificationPaymentByUserServices();
  }, []);

  const getServicesNotificationPaymentByUserServices = async () => {
    const url = `/servicesNotification/getServicesNotificationPaymentByUserServices/${item.id}`;
    fetchData(url).then((res) => {
      if (res.ok) {
        setAmountOfPayments(res.servicesNotificationPayment.amountOfPayments);
        setPayNumber(res.servicesNotificationPayment.payNumber);
        setContador(
            Math.round( (100 / res.servicesNotificationPayment.amountOfPayments) *
            res.servicesNotificationPayment.payNumber
        ));
      }
    });
  };
  const notifyServicesPayment = async () => {
    const url = `/servicesNotification/notifyServicesPayment`;
    await sendData(url, {
      typeServices_id: item.Services.TypeServices.id,
      user_id: item.user_id,
      driver_id: item.driver_id,
      amountOfPayments: item.Services.TypeServices.amountOfPayments,
      userServices_id: item.id,
      type:'NOTIFYSERVICES'
    }).then((res) => {
      if (res.ok) {
       
        showErrorToastGood("Solicitud enviada con exito")
        // navigation.navigate("Profile");
      }
    });
  };

  const showErrorToastGood = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "#128780", width: "80%" },
    });
  };

  const alerta = () => {
    Alert.alert(
      "Alerta",
      `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
      consectetur, adipisci velit..." "There is no one who loves pain itself,
      who seeks after it and wants to have it, simply because it is pain ${contador}`,
      [
        {
          text: "NOTIFICAR",
          onPress: () => {
            notifyServicesPayment();
          },
        },
        {
          text: "CANCEL",
          onPress: () => {
            console.log("notificar");
          },
        },
      ]
    );
  };

  return (
    <View style={{ alignItems: "center", paddingTop: 20 }}>
      <Text style={{ marginHorizontal: 5, paddingBottom: 5 }}>
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
        consectetur, adipisci velit..." "There is no one who loves pain itself,
        who seeks after it and wants to have it, simply because it is pain..."
      </Text>

      <View
        style={{
          height: 30,
          borderWidth: 2,
          borderRadius: 10,
          width: "95%",
        }}
      >
        <View
          style={{
            width: `${contador}%`,
            height: 26,
            backgroundColor: "#5f7ceb",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            {contador}%
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 10,
          alignSelf: "center",
          backgroundColor: "#5f7ceb",
          height: 50,
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={() => {
          alerta();
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Notificar</Text>
      </TouchableOpacity>
    </View>
  );
}
