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
import { Entypo, Ionicons } from "@expo/vector-icons";
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

  console.log(tickets);

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
            Event data
          </Text>
        </View>

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
          <Text style={styles.sectionTitle}>Event title</Text>
          <Text style={styles.sectionText}> {eventData.name}</Text>
        </View>

        <View style={styles.datesContainer}>
          <View style={{ width: "45%" }}>
            <Text style={styles.sectionTitle}>Start date</Text>

            <View style={styles.dateContainer}>
              <Text style={styles.sectionText}>{eventData.dateInit}</Text>
              <Ionicons name="calendar" size={23} color={"#b2b9c9"} />
            </View>
          </View>

          <View style={{ width: "45%" }}>
            <Text style={styles.sectionTitle}>Final date</Text>

            <View style={styles.dateContainer}>
              <Text style={styles.sectionText}>{eventData.dateInit}</Text>
              <Ionicons name="calendar" size={23} color={"#b2b9c9"} />
            </View>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Description</Text>
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
              Location
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
              <Ionicons name="location" size={14} color="#0F3D87" /> Get
              direwction - 4.2Km
            </Text>
          </View>

          <TouchableOpacity
            style={{ width: "30%", height: 110, borderRadius: 10 }}
          >
            <GoMap
              latitude={eventData?.latitude}
              longitude={eventData?.longitude}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Tickets</Text>
          {tickets?.map((item: any) => (
            <View key={item.id} style={styles.ticketDetail}>
              <Text style={{ fontWeight: "600" }}>
                {item.ticketCategory_name}
              </Text>

              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={{ fontWeight: "600" }}>Price:</Text>
                <Text>{item.price}.00$</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle, { fontSize: 17 }]}>
            Social media
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 25,
              paddingTop: 10,
              paddingBottom: 10,
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#5f7ceb",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginTop: 5,
          }}
          onPress={() =>
            navigation.navigate("BuyTicketsScreen", {
              tickets,
            })
          }
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            Buy tickets
          </Text>
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
