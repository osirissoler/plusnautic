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
} from "react-native";
import { FloatingAction } from "react-native-floating-action";

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

  const actions = [
    {
      text: "Abordo",
      icon: require("../assets/images/abordo.png"),
      name: "abordo",
      position: 2,
      buttonSize: 55,
      color: "#5f7ceb",
      size: 100,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
      },
    },
    {
      text: "Store",
      icon: require("../assets/images/callcenter.png"),
      name: "store",
      position: 1,
      size: 100,
      color: "#5f7ceb",
      buttonSize: 55,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
      },
    },
    {
      // size: -100,
      text: "Call center",
      icon: require("../assets/images/callcenter.png"),
      name: "callcenter",
      position: 3,
      // color: "rgb(0,0,0,.1)",
      color: "#5f7ceb",
      buttonSize: 55,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
      },
    },
  ];

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
        console.log(response.menu[0]);
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
      <Loading showLoading={showLoading} translation={translation} />
      {error ? (
        <ServiceComponent />
      ) : (
        <View style={{ height: "100%" }}>
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-around" }}
            refreshing={fetching}
            data={listPharmacy}
            onRefresh={getPharmaciesByUSer}
            ListHeaderComponent={
              <View>
                {visible ? (
                  <AdsScreen code={"Home"} img={initialImg} />
                ) : (
                  <Image
                    style={styles.headerImage}
                    source={{ uri: initialImg }}
                  />
                )}
              </View>
            }
            style={styles.body}
            renderItem={({ item, index }: any) => (
              <TouchableOpacity
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "35%",
                }}
                onPress={() => {
                  navigation.navigate(item.router, { showBack: true });
                }}
                key={item.id}
              >
                <View style={{ height: 150, width: 150, marginBottom: 5 }}>
                  <Image
                    source={{ uri: item.img }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                </View>
                <Text style={styles.categoryName}>
                  {(translation.locale.includes("en") && item.name) ||
                    (translation.locale.includes("es") && item.nombre) ||
                    (translation.locale.includes("fr") && item.nom)}
                </Text>
              </TouchableOpacity>
            )}
            numColumns={2}
          ></FlatList>
        </View>
      )}

      {/* <FloatingAction
        actions={actions}
        onPressItem={(name) => {
          if (name == "abordo") return goAbordo();
          if (name == "store") return goAbordo();
          if (name == "callcenter") return console.log(name);
        }}
        // floatingIcon={require("./path-to-main-icon.png")}
        position="left" // Puedes cambiar la posición a 'left' o 'center'
        distanceToEdge={10}
        actionsPaddingTopBottom={0} // Remueve el padding entre los botones
        buttonSize={50}
        color="#5f7ceb"
        tintColor={"rgb(0,0,0)"}
        showBackground={false}
      /> */}
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
