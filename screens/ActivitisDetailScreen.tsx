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
  Platform,
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
import { Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import GoMap from "./GoMap";
import Navigation from "../navigation";

export default function ActivitisDetailScreen({ navigation, route }: any) {
  const [initialImg, setinitialImage] = useState(
    "https://plus-nautic.nyc3.digitaloceanspaces.com/mosaico-para-destinos.jpg__1200.0x960.0_q85_subsampling-2.jpg"
  );
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [error, setError] = useState(false);
  const [eventData, setEventData]: any = useState({});
  const [tickets, setTickets]: any = useState([]);
  const [countries, setCountries]: any = useState([]);

  useEffect(() => {
    getCountryActive();
  }, []);

  useEffect(() => {
    getBoatShowById();
  }, [route.params.event_id]);

  const getCountryActive = async () => {
    let url = `/country/getCountryActive`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        setCountries(response.country);
      }
    });
  };

  const getBoatShowById = async () => {
    let url = `/typeEvents/getBoatShowById/${route.params.event_id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        setEventData(response.data.boatShows);
        setTickets(response.data.tickets);
      } else {
        setError(true);
      }
    });
  };

  const OpenURLButton = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <Container>
      <ScrollView style={{ paddingHorizontal: 30 }}>
        <HeaderComponent />
        <Loading showLoading={showLoading} translation={translation} />

        <Image
          style={styles.headerImage}
          source={{ uri: eventData.image ? eventData.image : initialImg }}
        />

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#b2b9c9",
            marginBottom: 20,
            paddingBottom: 10,
            gap: 6,
          }}
        >
          <Text style={styles.sectionTitle}>{translation.t("EventTitle")}</Text>
          <Text style={styles.sectionText}> {eventData.name}</Text>
        </View>

        <View style={styles.datesContainer}>
          <View style={{ width: "45%" }}>
            <Text style={styles.sectionTitle}>
              {translation.t("StartDate")}
            </Text>

            <View style={styles.dateContainer}>
              <Text style={styles.sectionText}>{eventData.dateInit}</Text>
              <Ionicons name="calendar" size={23} color={"#b2b9c9"} />
            </View>
          </View>

          <View style={{ width: "45%" }}>
            <Text style={styles.sectionTitle}>
              {translation.t("FinalDate")}
            </Text>

            <View style={styles.dateContainer}>
              <Text style={styles.sectionText}>{eventData.dateInit}</Text>
              <Ionicons name="calendar" size={23} color={"#b2b9c9"} />
            </View>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {translation.t("Description")}
          </Text>
          <Text style={{ color: "gray", marginTop: 10, fontSize: 15 }}>
            {eventData.description}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingBottom: 30,
            marginTop: 30,
          }}
        >
          <View style={{ width: "70%" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {translation.t("Location")}
            </Text>

            <Text style={{ color: "gray", fontSize: 15 }}>
              {
                countries.find((item: any) => item.id == eventData.country_id)
                  ?.name
              }
            </Text>
            <Text style={{ color: "gray", fontSize: 15 }}>
              {eventData.city}
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                marginTop: 8,
                fontSize: 14,
                color: "#0F3D87",
              }}
            >
              {/* <Ionicons name="location" size={14} color="#0F3D87" /> Get
              direction - 4.2Km */}
            </Text>
          </View>

          <TouchableOpacity
            style={{ width: "30%", height: 110, borderRadius: 10 }}
            onPress={() => {
              if (Platform.OS == "ios") {
                Linking.openURL(
                  `maps://app?daddr=${eventData?.latitude},${
                    eventData?.longitude
                  }&dirflg=d&t=m&q=${encodeURIComponent(eventData?.name)}`
                );
              } else {
                Linking.openURL(
                  `google.navigation:q=${eventData?.latitude}+${eventData?.longitude}`
                );
              }
            }}
          >
            <GoMap
              latitude={parseFloat(eventData?.latitude)}
              longitude={parseFloat(eventData?.longitude)}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {translation.t("Tickets")}
          </Text>
          {tickets?.map((item: any) => (
            <View key={item.id} style={styles.ticketDetail}>
              <Text style={{ fontWeight: "600" }}>
                {item.ticketCategory_name}
              </Text>

              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={{ fontWeight: "600" }}>
                  {translation.t("price")}:
                </Text>
                <Text>{item.price}.00$</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { fontSize: 17 }]}>
            {translation.t("SocialMedia")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 25,
              paddingTop: 10,
              paddingBottom: Platform.OS == "ios" ? 60 : 100,
            }}
          >
            {eventData.facebook_url && (
              <TouchableOpacity
                onPress={() => OpenURLButton(eventData.facebook_url)}
              >
                <Image
                  source={require("../assets/images/facebook.png")}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>
            )}

            {eventData.instagram_url && (
              <TouchableOpacity
                onPress={() => OpenURLButton(eventData.instagram_url)}
              >
                <Image
                  source={require("../assets/images/instagram.png")}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>
            )}

            {eventData.website_url && (
              <TouchableOpacity
                onPress={() => OpenURLButton(eventData.website_url)}
              >
                <Image
                  source={require("../assets/images/internet.png")}
                  style={{ height: 40, width: 40 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 10,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 25,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            width: "13%",
            height: 50,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
            marginTop: 5,
            shadowColor: "#000", // color de la sombra
            shadowOffset: { width: 0, height: 2 }, // desplazamiento de la sombra
            shadowOpacity: 0.4, // opacidad de la sombra
            shadowRadius: 3.84, // radio de la sombra
            elevation: 5, // altura de la sombra (para Android)
          }}
          onPress={() =>
            navigation.navigate("EventCalendarScreen", {
              id: eventData?.id,
              eventData,
            })
          }
        >
          {/* <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            Booths
          </Text> */}
          <Ionicons name="calendar" size={23} color={"grey"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "13%",
            height: 50,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
            marginTop: 5,
            shadowColor: "#000", // color de la sombra
            shadowOffset: { width: 0, height: 2 }, // desplazamiento de la sombra
            shadowOpacity: 0.4, // opacidad de la sombra
            shadowRadius: 3.84, // radio de la sombra
            elevation: 5, // altura de la sombra (para Android)
          }}
          onPress={() =>
            navigation.navigate("EventBoothsScreen", {
              id: eventData?.id,
            })
          }
        >
          {/* <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            Booths
          </Text> */}
          <AntDesign name="isv" size={23} color={"gray"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor: "#5f7ceb",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            marginTop: 5,
            flexDirection: "row",
            gap: 10,
          }}
          onPress={() =>
            navigation.navigate("BuyTicketsScreen", {
              tickets,
            })
          }
        >
          <Text
            style={{
              color: "#fff",
              fontSize:
                translation.locale.includes("es") ||
                translation.locale.includes("fr")
                  ? 13
                  : 15,
              fontWeight: "600",
            }}
          >
            {translation.t("BuyTickets")}
          </Text>
          <Entypo name="ticket" size={23} color={"#fff"} />
        </TouchableOpacity>
      </View>
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
});
