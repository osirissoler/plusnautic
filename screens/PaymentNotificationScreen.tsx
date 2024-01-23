import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Foundation, Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { fetchData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";

export default function PaymentNotificationScreen({ navigation, route }: any) {
  const { router_id } = route.params;
  const { translation } = React.useContext(LanguageContext);
  const [paymentData, setPaymentData]: any = useState({});
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setShowLoading(true);
    });
    if (router_id) {
      getPaymentNotificationData(router_id);
    }
  }, []);

  const getPaymentNotificationData = (id: any) => {
    let url = `/notification/getPaymentNotificationData/${id}`;
    fetchData(url).then((response: any) => {
      if (response.ok) {
        setPaymentData(response.paymentData);
        console.log(response);
      }
    });
  };

  return (
    <View style={{ backgroundColor: "#F2F2F2", height: "100%" }}>
      <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }}>
        {translation.t("PaymentDetail")}
      </Text>

      {/* Client name */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Feather name="user" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
          {translation.t("ClientName")}
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>
          {paymentData.user_first_name}
        </Text>
      </TouchableOpacity>

      {/* Type services */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Foundation name="graph-pie" size={19} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
            {translation.t("Description")}
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>
          {paymentData.description}
        </Text>
      </TouchableOpacity>

      {/* status */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <AntDesign name="infocirlce" size={15} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>{translation.t("Status")}</Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            color:
              paymentData.paymentStatus === "PENDING"
                ? "orange"
                : paymentData.paymentStatus === "REJECTED"
                ? "red"
                : "green",
          }}
        >
          {paymentData.paymentStatus}
        </Text>
      </View>

      {/* Amount of payments */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Entypo name="forward" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>{translation.t("Amount")}</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{paymentData.amount}$</Text>
      </View>

      {/* Date */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Feather name="pocket" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>{translation.t("Date")}</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{paymentData?.date?.split(" ")[0]}</Text>
      </View>
    </View>
  );
}
