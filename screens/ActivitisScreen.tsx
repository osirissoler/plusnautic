import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { Container, Loading } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";
import { hideLoadingModal } from "../utils";
import { fetchData } from "../httpRequests";
import moment from "moment";

export default function ActivityScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(true);
  const [events, setEvents] = useState([]);
  const [typeEvents, setTypeEvents]: any = useState([]);
  const [initialImg, setinitialImage] = useState(
    "https://i.pinimg.com/originals/3f/e5/32/3fe532c1bdc63084ab65c1427609a3bd.gif"
  );
  const [fetching, setFetching]: any = useState(false);

  useEffect(() => {
    setShowLoading(true);
    setFetching(true);

    hideLoadingModal(() => {
      getEvents();
    }, setShowLoading);

    setTimeout(() => {
      setFetching(false);
      setShowLoading(false);
    }, 100);
  }, []);

  const getEvents = async () => {
    const url = `/typeEvents/getTypeEvents`;
    fetchData(url).then((response: any) => {
      if (response.ok) {
        setEvents(response.boatShows);
        setTypeEvents(response.typeEvents);
      }
    });
  };

  return (
    <Container>
      <Loading showLoading={showLoading} translation={translation} />
      {events.length == 0 ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 15,
            marginVertical: 10,
            minHeight: 200,
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              There are no activities to show
            </Text>
          </View>
          <Image
            style={{
              // marginBottom: 20,
              height: 180,
              width: "90%",
              borderRadius: 100,
            }}
            source={{ uri: initialImg }}
          />
        </View>
      ) : (
        <View style={{ padding: 10, height: "95%" }}>
          <FlatList
            refreshing={fetching}
            data={events}
            onRefresh={() => {
              getEvents();
            }}
            ListHeaderComponent={
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Eventos disponibles
                  </Text>
                </View>
            }
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ActivitisDetailScreen", {
                    event_id: item.id,
                  })
                }
                style={{ paddingHorizontal: 5 }}
              >
                <View style={styles.cardContainer}>
                  <View
                    style={{
                      width: "30%",
                      padding: item.image ? 0 : 15,
                    }}
                  >
                    <Image
                      source={{
                        uri: item.image
                          ? item.image
                          : "https://plus-nautic.nyc3.digitaloceanspaces.com/yate.png",
                      }}
                      style={{
                        height: "100%",
                        width: "100%",
                        resizeMode: "cover",
                        borderRadius: 10,
                        borderColor: "gray",
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: "65%",
                      marginLeft: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                    }}
                  >
                    <View style={{ marginBottom: 10 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          marginVertical: 3,
                          fontWeight: "600",
                          fontSize: 17,
                          color: "#4f4f4f",
                        }}
                      >
                        {item.name} Hola que tal como está todo, yo solo estoy
                        probando
                      </Text>
                      <Text ellipsizeMode="tail" style={{ fontWeight: "500" }}>
                        {
                          typeEvents?.find(
                            (type: any) => type.id == item.typeEvent_id
                          )?.name
                        }
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        // justifyContent: "space-between",
                        gap: 50,
                        width: "100%",
                      }}
                    >
                      <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontWeight: "bold", color: "#777777" }}>
                          {translation.t("Date")} init:
                        </Text>

                        <Text style={{ fontWeight: "600", color: "#4f4f4f" }}>
                          {moment(item.dateInit).format("YYYY-MM-DD")}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontWeight: "bold", color: "#777777" }}>
                          {translation.t("Date")} final:
                        </Text>
                        <Text style={{ fontWeight: "600", color: "#4f4f4f" }}>
                          {moment(item.dateFinal).format("YYYY-MM-DD")}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: "#8B8B9720",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, // Ajusta la altura para ver mejor la sombra
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Asegura que esta propiedad esté presente para Android
    height: 110,
    overflow: "visible", // Cambia de "hidden" a "visible" o elimínala
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
});
