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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import asyncStorage from "@react-native-async-storage/async-storage";
import { fetchData, sendData } from "../../httpRequests";
import { Ionicons } from "@expo/vector-icons";
import { formatter } from "../../utils";
import { LanguageContext } from "../../LanguageContext";
import { checkStorage, Container, Loading } from "../../components/Shared";
import HeaderComponent from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

export default function ListScreen({ navigation }: any) {
  const navigationn = useNavigation();
  const [fetching, setFetching]: any = useState(false);
  const [typeServices, setTypeServices] = useState([]);
  const [userServicesPrice, setUserServicesPrice] = useState([]);
  const [userServicesPrice1, setUserServicesPrice1] = useState([]);
  const [text, setText] = useState("All request");
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    getInfoPriceService();
    getTypeServices();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getInfoPriceService();
      getTypeServices();
    });

    return unsubscribe;
  }, [navigation]);

  const getTypeServices = async () => {
    setFetching(true);
    let url = `/services/getTypeService`;
    await fetchData(url).then(async (res) => {
      if (res.ok) {
        setTypeServices(res.services);
        // console.log(res.services[0], 'jejeje')
      }
    });
    setFetching(false);
  };

  const getInfoPriceService = async () => {
    setFetching(true);
    checkStorage("USER_LOGGED", (response: any) => {
      const id = response;
      setText("All request");
      let url = `/services/getInfoPriceService/${id}`;
      fetchData(url).then((response: any) => {
        if (response.ok) {
          setUserServicesPrice(response.service);
          setUserServicesPrice1(response.service);
          console.log(response.service);
        }
      });
      setFetching(false);
    });
  };

  const filterServicesPrice = async (id: any) => {
    const data = userServicesPrice1.filter((e: any) => {
      return e.Services.TypeServices.id === id;
    });
    setUserServicesPrice(data);
  };

  return (
    <Container>
      <HeaderComponent />
      <View style={styles.body}>
        <Loading showLoading={showLoading} translation={translation} />
        <View style={{ height: "20%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Text style={styles.productTitle2}>
              {translation.t("TypeServices")}
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Text style={styles.seeAll}>{translation.t("home")}</Text>
              <Ionicons name="md-exit-outline" size={20} color="#5f7ceb" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            refreshing={fetching}
            data={typeServices}
            onRefresh={getTypeServices}
            renderItem={({ item }: any) => (
              <View>
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.productCard}
                    onPress={() => {
                      filterServicesPrice(item.id);
                      setText(
                        (translation.locale.includes("en") && item.name) ||
                          (translation.locale.includes("es") && item.nombre) ||
                          (translation.locale.includes("fr") && item.nom)
                      );
                    }}
                  >
                    <View style={{ height: 40, width: 40, marginBottom: 10 }}>
                      <Image
                        source={{ uri: item.img }}
                        style={{ height: "100%", width: 45 }}
                      />
                    </View>
                    <Text style={styles.productTitle}>
                      {(translation.locale.includes("en") && item.name) ||
                        (translation.locale.includes("es") && item.nombre) ||
                        (translation.locale.includes("fr") && item.nom)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          ></FlatList>
        </View>
        <View style={{ height: "80%", marginBottom: 10 }}>
          <Text style={styles.productTitle2}>
            {translation.t("maintenance")}
          </Text>
          {/* <Text style={styles.seeAll}>aaaaa</Text> */}
          <FlatList
            refreshing={fetching}
            data={userServicesPrice}
            onRefresh={getInfoPriceService}
            renderItem={({ item }: any) => (
              <View
                style={{
                  height: 100,
                  borderColor: "#8B8B9720",
                  backgroundColor: "#F7F7F7",
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={styles.productCard2}
                      onPress={() => {
                        navigation.navigate("Gestor", {
                          img: item.driver_img,
                          name: item.driver_first_name,
                          lastName: item.driver_last_name,
                          id: item.driver_id,
                        });
                      }}
                    >
                      <ImageBackground
                        source={{
                          uri:
                            item.driver_img == null || item.driver_img == ""
                              ? "https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png"
                              : item.driver_img,
                        }}
                        style={styles.profilePicture}
                        resizeMode={"cover"}
                        imageStyle={{ borderRadius: 100 }}
                      />
                      
                    </TouchableOpacity>
                    <View style={{ width: "60%" }}>
                      <Text style={{ fontWeight: "bold", marginVertical: 5 }}>
                        {item.driver_first_name} {item.driver_last_name}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>
                          {translation.t("price")}
                          {""}
                        </Text>
                        <Text>{formatter(item.price)}</Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>
                          Services status{" "}
                        </Text>

                        <Text>
                          {(translation.locale.includes("en") &&
                            item.ServicesStatus_name) ||
                            (translation.locale.includes("es") &&
                              item.ServicesStatus_nombre) ||
                            (translation.locale.includes("fr") &&
                              item.ServicesStatus_nom)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>
                          Tipo de servicios{" "}
                        </Text>

                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{ maxWidth: "50%"}}
                        >
                          {(translation.locale.includes("en") &&
                            item.typeServices_name) ||
                            (translation.locale.includes("es") &&
                              item.typeServices_nombre) ||
                            (translation.locale.includes("fr") &&
                              item.typeServices_nom)}
                        </Text>
                      </View>

                      {item.ServicesStatus_code == "COMPLETADO" && (
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            {(translation.locale.includes("en") &&
                              "Finish date") ||
                              (translation.locale.includes("es") &&
                                "Fecha de finalizacion") ||
                              (translation.locale.includes("fr") &&
                                "Date de fin")}{" "}
                          </Text>

                          <Text>
                            {moment(item.servicesEndData).format("DD/MM/YYYY")}
                          </Text>
                        </View>
                      )}

                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      </View>

                      {item.ServicesStatus_code == "PROCCESING" && (
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontWeight: "bold" }}>
                            Prices status:
                          </Text>
                          <Text>Pago completado</Text>
                        </View>
                      )}
                    </View>

                    <View style={{ paddingRight: 10, width: "20%"}}>
                      <TouchableOpacity
                        style={{ marginHorizontal: 10 }}
                        onPress={() => {
                          navigation.navigate("Accept", { item: item });
                        }}
                      >
                        <Ionicons
                          name="md-exit-outline"
                          size={25}
                          color="#5f7ceb"
                        />
                      </TouchableOpacity>
                      {item.ServicesStatus_code == "ACEPTADO" && (
                        <View>
                          <Text>{translation.t("checkoutPayNowText")}</Text>
                        </View>
                      )}

                      {item.ServicesStatus_code == "PENDING" && (
                        <View>
                          <Text>{translation.t("Accept")}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
          ></FlatList>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  productCard: {
    // padding: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#dcecf2",
    // borderRadius: 20,
    marginVertical: 10,
    width: 135,
    height: 115,
    marginLeft: 10,
  },
  productCard2: {
    // padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dcecf2",
    borderRadius: 60,
    marginVertical: 10,
    marginHorizontal: 10,
    width: 70,
    height: 70,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  productTitle2: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  seeAll: {
    fontSize: 14,
    marginRight: 2,
    color: "gray",
    marginBottom: 3,
  },
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },
});
