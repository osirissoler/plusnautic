import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { checkStorage } from "./Shared";
import { LanguageContext } from "../LanguageContext";
import { fetchData } from "../httpRequests";
import FloatingButton from "./FloatingButton";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function HeaderComponent({
  screen,
  navigation,
  openFilterModal,
}: any) {
  const [ticketsLength, setTicketsLength] = useState(0);
  const { translation } = React.useContext(LanguageContext);

  useEffect(() => {
    navigation?.addListener("focus", () => {
      getTicketsCart();
    });
  }, []);

  const getTicketsCart = () => {
    checkStorage("USER_LOGGED", (id: number) => {
      const url = `/store/getProductCartStoreByUser/${id}`;
      fetchData(url).then((response) => {
        if (response.ok) {
          setTicketsLength(response.products.length);
        } else {
          setTicketsLength(0);
        }
      });
    });
  };

  const displayTicketsLength = ticketsLength > 99 ? "99+" : ticketsLength;

  return (
    <View style={styles.header}>
      <Image
        style={styles.logo}
        source={require("../assets/images/slogan.png")}
      />

      {screen === "home" && (
        <View style={[styles.screenOptions, { justifyContent: "flex-end" }]}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row",
            }}
          >
            {/* <FloatingButton navigation={navigation} /> */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("YoutubeVideosScreen");
              }}
            >
              <Icon name="youtube" size={35} color="red" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionIcon}
              onPress={() =>
                navigation.navigate("CartStoreScreen", { showBack: true })
              }
            >
              <View style={styles.ticketsContainer}>
                <Text style={styles.ticketsAmount}>{displayTicketsLength}</Text>
              </View>

              <AntDesign name="shoppingcart" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? 0 : 10,
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  logo: {
    height: 50,
    width: "50%",
    resizeMode: "contain",
  },
  screenOptions: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    position: "absolute",
    flexDirection: "row",
  },
  optionIcon: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "relative",
  },
  ticketsContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    borderRadius: 100,
    backgroundColor: "#5f7ceb",
    paddingVertical: 3,
    paddingHorizontal: 7,
    minWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketsAmount: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
