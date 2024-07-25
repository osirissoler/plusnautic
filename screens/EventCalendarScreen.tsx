import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

import { Container, Loading, checkStorage } from "../components/Shared";

import { LanguageContext } from "../LanguageContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { formatter, hideLoadingModal } from "../utils";
import { fetchData } from "../httpRequests";
import moment from "moment";
import HeaderComponent from "../components/Header";

export default function EventCalendarScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [agendaArr, setAgendaArr] = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [initialImg, setinitialImage] = useState(
    "https://plus-nautic.nyc3.digitaloceanspaces.com/mosaico-para-destinos.jpg__1200.0x960.0_q85_subsampling-2.jpg"
  );

  useEffect(() => {
    setShowLoading(true);

    hideLoadingModal(() => {
      getBoothsByBoatShow(route.params.id);
    }, setShowLoading);

    setTimeout(() => {
      setShowLoading(false);
    }, 100);
  }, []);

  const getBoothsByBoatShow = async (id: number) => {
    let url = `/agenda/getAgendaDetailsByBoatShow/${id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        setAgendaArr(response.agendaDetails);
        console.log(response.agendaDetails);
      }
    });
  };

  return (
    <View style={{ backgroundColor: "#425fc9" }}>
      <Loading showLoading={showLoading} translation={translation} />

      <View style={styles.upperContainer}>
        <HeaderComponent />
        <Image
          style={styles.headerImage}
          source={{
            uri: route.params.eventData.image
              ? route.params.eventData.image
              : initialImg,
          }}
        />

        <View
          style={{
            borderColor: "#b2b9c9",
            marginBottom: 20,
            gap: 6,
          }}
        >
          <Text
            style={[styles.sectionText, { textAlign: "center", fontSize: 20 }]}
          >
            {route.params.eventData.name}
          </Text>
        </View>
      </View>
      {/* 
      <Text
        style={{
          fontSize: 23,
          fontWeight: "500",
          marginTop: 15,
          paddingHorizontal: 20,
          color: "#fff",
        }}
      >
        Agenda
      </Text> */}

      {agendaArr?.length > 0 ? (
        <FlatList
          style={{
            height: "65%",
            paddingTop: 5,
            borderRadius: 10,
            // backgroundColor: "#5f7ceb",
          }}
          // refreshing={isFetching}
          // onRefresh={onRefresh}
          data={agendaArr}
          renderItem={({ item, index }) => (
            <TicketCard key={index} item={item} translation={translation} />
          )}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            height: "80%",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              textAlign: "center",
              color: "#fff",
            }}
          >
            {translation.t("NoAgenda")}
          </Text>
        </View>
      )}
    </View>
  );
}

function TicketCard({ item, translation }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "#fff",
          width: 10,
          height: "50%",
          borderRadius: 10,
          marginLeft: 5,
        }}
      />
      <TouchableOpacity style={styles.productCard}>
        <View style={{ width: "80%", paddingLeft: 10, gap: 10 }}>
          <View style={styles.productDataContainer}>
            <Text style={[styles.productTitle, { fontSize: 20 }]}>
              {item.day}
            </Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={[styles.productName, { fontWeight: "700" }]}>
              {item.title}
            </Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productName}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.datesContainer}>
          <AntDesign name="clockcircle" size={23} color={"#fff"} />

          <View style={{ gap: 10 }}>
            <View style={styles.dateContainer}>
              <Text style={[styles.sectionText, { color: "#fff" }]}>
                {item.hourInit}
              </Text>
            </View>

            <Text style={{ fontSize: 17, fontWeight: "600", color: "#fff" }}>
              To
            </Text>

            <View style={styles.dateContainer}>
              <Text style={[styles.sectionText, { color: "#fff" }]}>
                {item.hourFinal}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  upperContainer: {
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    backgroundColor: "#fff",
  },

  productDataContainer: {
    flexDirection: "row",
    gap: 5,
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
    flexShrink: 1,
    color: "#fff",
  },
  optionText: {
    fontSize: 16,
  },

  dateContainer: {},
  datesContainer: {
    gap: 5,
    paddingVertical: 10,
    alignItems: "center",
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
  headerImage: {
    marginBottom: 20,
    height: 170,
    width: "100%",
    borderRadius: 10,
  },
});
