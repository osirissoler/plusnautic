import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
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
import AdsScreen from "./AdsScreen";
import asyncStorage from "@react-native-async-storage/async-storage";
import FloatingButton from "../components/FloatingButton";
import AllStoreHome from "../components/store/AllStoreHome";
import AdsHome from "./AdsHome";
import { ArticleList } from "../components/Articles/ArticleList";
import ProductHome from "../components/store/ProductHome";
import { ProductList } from "../components/products/ProductList";
import { OrderedProductsList } from "../components/products/OrderedProductsList";

export default function HomeScreen({ navigation, route }: any) {
  const defaultProductImg =
    "http://openmart.online/frontend/imgs/no_image.png?";
  const [initialImg, setinitialImage] = useState(
    "https://plus-nautic.nyc3.digitaloceanspaces.com/mosaico-para-destinos.jpg__1200.0x960.0_q85_subsampling-2.jpg"
  );
  const { translation } = React.useContext(LanguageContext);
  const [fetching, setFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [listPharmacy, setListPharmacy]: any = useState([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(false);

  const supportedURL = "https://abordo.page.link/abordoapp";
  const goAbordo = async () => {
    const supported = await Linking.canOpenURL(supportedURL);
    if (supported) {
      await Linking.openURL(supportedURL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
    }
  };

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

  useEffect(() => {
    getPharmaciesByUSer();
  }, []);

  const getPharmaciesByUSer = async () => {
    // checkStorage('USER_LOGGED', async (id: any) => {
    setFetching(true);
    let url = `/menu/getMenuApp`;
    await fetchData(url).then((response) => {
      if (response.ok) {
        setListPharmacy(response.menu);
      } else {
        setListPharmacy([]);
        setFetching(false);
        setError(true);
      }
      setFetching(false);
    });
    // })
  };
  const goMuelles = (id: number) => {
    navigation.navigate("Muelles", { id: id });
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

function ServiceComponent() {
  return (
    <View>
      <Text>Error vuelva a intentar mas tarde</Text>
    </View>
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
