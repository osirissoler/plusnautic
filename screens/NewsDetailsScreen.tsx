import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  Dimensions,
} from "react-native";

import HeaderComponent from "../components/Header";
import { Container, Loading } from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import { Entypo, Ionicons, AntDesign } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import GoMap from "./GoMap";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import { hideLoadingModal } from "../utils";
import { Articles } from "../types/Articles";


export default function NewsDetailsScreen({ navigation, route }: any) {
  const scrollViewRef = useRef<ScrollView | null>(null); // Crea la referencia al ScrollView
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [error, setError] = useState(false);
  const [newsData, setNewsData] = useState<Articles>();
  const [next, setNext] = useState<number>(0);
  const [previous, setPrevious] = useState<number>(0);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    getNewsById();
  }, [route.params.news_id]);

  const getNewsById = async () => {
    setShowLoading(true);
    let url = `/news/getNewsByIdMobile/${route.params.news_id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        hideLoadingModal(() => {
          setNewsData(response.news);
          setNext(response.next_id);
          setPrevious(response.previous_id);
        }, setShowLoading);
      } else {
        setError(true);
      }
    });
    setShowLoading(false);
  };

  const getNewsDirections = async (id: number) => {
    setShowLoading(true);
    let url = `/news/getNewsByIdMobile/${id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        hideLoadingModal(() => {
          setNewsData(response.news);
          setNext(response.next_id);
          setPrevious(response.previous_id);
        }, setShowLoading);
      } else {
        setError(true);
      }
    });
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    setShowLoading(false);
  };

  const tagsStyles = {
    p: { color: "gray", fontSize: 15 }, // Aplica estilos personalizados
  };

  return (
    <Container style={{ backgroundColor: "#fff" }}>
      <Loading showLoading={showLoading} translation={translation} />

      <ScrollView
        ref={scrollViewRef}
        style={{
          paddingHorizontal: 30,
          backgroundColor: "#fff",
          height: "100%",
        }}
      >
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <Text style={styles.sectionTitle}>{newsData?.title}</Text>
          {newsData?.writer && (
            <Text style={styles.sectionText}>{newsData?.writer}</Text>
          )}
          <Text style={styles.sectionText}>
            {moment(newsData?.created_at).format("YYYY-MM-DD")} -{" "}
            {newsData?.elapsedTime}
          </Text>
        </View>

        <View style={{ paddingBottom: 50 }}>
          <RenderHTML
            contentWidth={width} // Define el ancho máximo del contenido HTML
            source={{ html: newsData?.description ?? "" }}
            // tagsStyles={{...tagsStyles}}
          />
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 10,
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          bottom: 25,
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={
            next ? styles.directionButtons : styles.disableDirectionButtons
          }
          disabled={!next}
          onPress={() => {
            if (next) getNewsDirections(next);
          }}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={
            previous ? styles.directionButtons : styles.disableDirectionButtons
          }
          disabled={!previous}
          onPress={() => {
            if (previous) getNewsDirections(previous);
          }}
        >
          <AntDesign name="arrowright" size={24} color="black" />
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
    height: 300,
    width: "100%",
    // borderRadius: 10,
  },
  locationMap: {
    marginBottom: 20,
    height: 190,
    width: "100%",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "500",
    marginBottom: 3,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.5,
    color: "grey",
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

  directionButtons: {
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
  },

  disableDirectionButtons: {
    width: "13%",
    height: 50,
    backgroundColor: "#d1d1d1",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginTop: 5,
    shadowColor: "#000", // color de la sombra
    shadowOffset: { width: 0, height: 2 }, // desplazamiento de la sombra
    shadowOpacity: 0.4, // opacidad de la sombra
    shadowRadius: 3.84, // radio de la sombra
    elevation: 5, // altura de la sombra (para Android)
  },
});
