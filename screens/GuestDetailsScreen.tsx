import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Foundation, Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { fetchData } from "../httpRequests";

export default function GuestDetailsScreen({ navigation, route }: any) {
  const {guest_id} = route.params
  const [infoPriceService, setInfoPriceService] = useState({
    Services: {}
  });
  const [guestDetail, setGuestDetail] = useState({
    name: "",
    isDeleted: "",
    typeServices_name: "",
    servicesStatus_name: "",
    amountOfPayments: 0,
    payNumber: 0,
    userServices_price: 0,
    userServices_id: 0,
  });

  useEffect(() => {
    if (guest_id) {
        getGuestDetails(guest_id)
    }
  }, []);

  const getGuestDetails = (id: any) => {
    let url = `/guest/getGuestDetails/${id}`
    fetchData(url).then((response: any) => {
        if (response.ok) {
            console.log(response)
            setGuestDetail(response.guest)
        }
      });
  }

  return (
    <View style={{ backgroundColor: "#F2F2F2", height: "100%" }}>
      <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }}>
        Services Payment Details
      </Text>

{/* Client name */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}
        // onPress={() => {navigation.navigate('userDetails', {item: infoPriceService})}}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Feather name="user" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>Client name</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{guestDetail.name}</Text>
      </TouchableOpacity>

      {/* Type services */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 15,
        }}

        onPress={() => {navigation.navigate('Status', {item: infoPriceService})}}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>
            <Foundation name="graph-pie" size={19} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
            Type services
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{guestDetail.typeServices_name}</Text>
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
          <Text style={{ color: "gray", marginHorizontal: 8 }}>Status</Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            color:
            guestDetail.servicesStatus_name === "PROCESSING"
                ? "orange"
                : "green",
          }}
        >
          {guestDetail.servicesStatus_name}
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
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
            Amount of payments
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{guestDetail.amountOfPayments}</Text>
      </View>

      {/* Payments made */}
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
            <Entypo name="credit-card" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
            Payments made
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>{guestDetail.payNumber}</Text>
      </View>
      
      {/* Amount paid */}
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
          <Text style={{ color: "gray", marginHorizontal: 8 }}>
            Amount paid
          </Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>
          $
          {(
            (guestDetail.userServices_price / guestDetail.amountOfPayments) *
            guestDetail.payNumber
          ).toFixed(2)}
        </Text>
      </View>

      {/* Fees */}

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
            <Entypo name="tag" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8 }}>FEES</Text>
        </View>
        <Text style={{ fontWeight: "bold" }}>
          {" "}
          $
          {(guestDetail.userServices_price / guestDetail.amountOfPayments).toFixed(2)}
        </Text>
      </View>

{/* Payment progress */}
      <View style={{ marginHorizontal: 8, marginVertical: 15 }}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text>
            <Entypo name="progress-full" size={16} color="gray" />
          </Text>
          <Text style={{ color: "gray", marginHorizontal: 8, fontSize: 15 }}>Payment progress</Text>
        </View>
        <View style={{flexDirection: "row"}}>
          <Text style={{marginLeft: 10}}>
            {((100 / guestDetail.amountOfPayments) * guestDetail.payNumber).toFixed(
              2
            )}%
          </Text>
        </View>
      </View>
    </View>
  );
}
