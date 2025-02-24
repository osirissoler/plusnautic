import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";

import HeaderComponent from "../components/Header";
import { checkLoggedUser, Container } from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import asyncStorage from "@react-native-async-storage/async-storage";
import AllStoreHome from "../components/store/AllStoreHome";
import AdsHome from "./AdsHome";
import { ArticleList } from "../components/Articles/ArticleList";
import { ProductList } from "../components/products/ProductList";
import { OrderedProductsList } from "../components/products/OrderedProductsList";
import SkeletonPlaceholder from "../components/SkeletonPlaceholder";

export default function HomeScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    checkLoggedUser(
      (id: string) => {
        setShowLoading(true);
        const url = `/user/getUserById/${id}`;
        const data = { user_id: id };
        sendData(url, data).then((response) => {
          if (response.ok) {
            //  setShowLoading(false);
            hideLoadingModal(() => {});
          } else {
            hideLoadingModal(() => {
              logout();
            });
          }
        });
      },
      navigation,
      translation
    );
  }, []);

  const logout = () => {
    const user = asyncStorage.getItem("USER_LOGGED");
    if (!!user) {
      asyncStorage.removeItem("USER_LOGGED");
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };

  return (
    <Container>
      <HeaderComponent screen={"home"} navigation={navigation} />
      <ScrollView
        style={{
          gap: 5,
        }}
      >
        <View style={{ borderWidth: 0 }}>
          <Text
            style={{
              marginHorizontal: 5,
              fontSize: 17,
              fontWeight: 500,
              marginTop: 10,
            }}
          >
            Destacadas en plusnautic
          </Text>
          <AllStoreHome navigation={navigation} />
        </View>

        <AdsHome navigation={navigation} code="Home" />

        <ProductList navigation={navigation} />

        <ArticleList navigation={navigation} />

        <OrderedProductsList navigation={navigation} />

        <AdsHome navigation={navigation} code="Courses" />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    padding: 10,
    flexDirection: "column",
    marginBottom: 60,
  },
  headerImage: {
    marginBottom: 20,
    height: 180,
    width: "100%",
    borderRadius: 10,
    // aspectRatio:1/1
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },

  productCard: {
    padding: 8,
    marginVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  productImage: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    width: 120,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
