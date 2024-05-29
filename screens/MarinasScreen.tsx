import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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

export default function MarinasScreen({ navigation, route }: any) {
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

  // useEffect(() => {
  // 	checkLoggedUser(
  // 	  (id: string) => {
  // 		setShowLoading(true);
  // 		const url = `/user/getUserById/${id}`;
  // 		const data = { user_id: id };
  // 		sendData(url, data).then((response) => {
  // 		  if (response.ok) {
  // 			//  setShowLoading(false);
  // 			hideLoadingModal(() => {
  // 			});
  // 		  } else {
  // 			hideLoadingModal(() => {
  // 				logout()
  // 			});

  // 		  }
  // 		});
  // 	  },
  // 	  navigation,
  // 	  translation
  // 	);

  //   }, []);

  //   const logout = () => {
  // 	const user = asyncStorage.getItem("USER_LOGGED");
  // 	if (!!user) {
  // 	  asyncStorage.removeItem("USER_LOGGED");
  // 	  redirectToLogin();
  // 	}
  //   };

  //   const redirectToLogin = () => {
  // 	navigation.reset({
  // 	  index: 0,
  // 	  routes: [{ name: "SignIn" }],
  // 	});
  //   };

  //   const hideLoadingModal = (callback: Function) => {
  // 	setTimeout(() => {
  // 	  setShowLoading(false);
  // 	  callback();
  // 	}, 1000);
  //   };

  useEffect(() => {
    getPharmaciesByUSer();
  }, []);

  const getPharmaciesByUSer = async () => {
    checkStorage("USER_LOGGED", async (id: any) => {
      setFetching(true);
      let url = `/userPharmacy/getUserPharmacyByUserId/${id}`;
      await fetchData(url).then((response) => {
        if (response.ok) {
          setListPharmacy(response.userPharmacy);
        } else {
        }
        setFetching(false);
      });
    });
  };
  const goMuelles = (id: number) => {
    navigation.navigate("Muelles", { id: id });
  };

  return (
    <Container>
      <HeaderComponent />
      <Loading showLoading={showLoading} translation={translation} />

      <View style={{ height: "100%" }}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-around" }}
          refreshing={fetching}
          data={listPharmacy}
          onRefresh={getPharmaciesByUSer}
          ListHeaderComponent={
            <View>
              {visible ? (
                <AdsScreen code={"MARINAS"} img={initialImg} />
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
                goMuelles(item.pharmacy_id);
              }}
              key={item.id}
            >
              <View style={{ height: 100, width: 100, marginBottom: 10 }}>
                {item.pharmacy_img ? (
                  <Image
                    source={{
                      uri: item.pharmacy_img,
                    }}
                    style={{ flex: 1, resizeMode: "contain" }}
                  />
                ) : (
                  <Image
                    source={require("../assets/images/plusnauticIcon.png")}
                    style={{ height: 100, width: 100, resizeMode: "contain" }}
                  />
                )}
              </View>
              <Text style={styles.categoryName}>{item.pharmacy_name}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
        ></FlatList>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
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
