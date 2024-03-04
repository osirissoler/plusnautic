import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import HeaderComponent from "../components/Header";
import {
  checkLoggedUser,
  checkStorage,
  Container,
  Loading,
} from "../components/Shared";
import { FontAwesome } from "@expo/vector-icons";
import { LanguageContext } from "../LanguageContext";
import { fetchData, sendData } from "../httpRequests";
import { CheckBox } from "react-native-elements";
import Toast from "react-native-root-toast";

export default function SelectMarinasScreen({ navigation, route }: any) {
  const { showBack } = route.params || {};
  const { translation } = React.useContext(LanguageContext);
  const defaultProductImg =
    "http://openmart.online/frontend/imgs/no_image.png?";
  const [listPharmacyFull, setListPharmacyFull]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [searchQuery, setSearchQuery]: any = useState("");
  const [list, setList]: any = useState([]);
  const [listByUser, setListByUser]: any = useState(new Set());

  useEffect(() => {
    getPharmacies();

    if (showBack) {
      navigation.setOptions({ headerShown: true });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, []);

  const getPharmacies = async () => {
    let listUserId: [];
    setFetching(true);

    checkStorage("USER_LOGGED", async (userId: any) => {
      checkStorage("USER_LOGGED_COUNTRY", async (country_id: any) => {
        let url = `/pharmacies/getPharmaciesByCountry/${country_id}`;
        let urlPharmacyByUser = `/userPharmacy/getUserPharmacyByUserId/${userId}`;
        await fetchData(urlPharmacyByUser).then(async (res: any) => {
          if (res.ok) {
            listUserId = await res.userPharmacy.map(
              (element: any) => element.pharmacy_id
            );
            setListByUser(listUserId);
          }
        });

        await sendData(url, { additional_ids: listUserId }).then((response) => {
          if (response.ok) {
            let list: any = response.pharmacy.map((element: any) => ({
              name: element.name,
              id: element.id,
              img: element.img,
              country: element.country_name,
              selected: listUserId.some((e: any) =>
                e === element.id ? true : false
              ),
            }));

            list.sort((a: any, b: any) => {
              if (a.selected && !b.selected) {
                return -1;
              } else if (!a.selected && b.selected) {
                return 1;
              } else {
                return 0;
              }
            });

            setListPharmacyFull(list);
            setList(list);
          }
          setFetching(false);
        });
      });
    });
  };

  const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 100);
	};

  const selectPharmacy = (index: any) => {
    sendPharmacyUser(
      index,
      !list.filter((item: any) => item.id == index)[0].selected
    );
    list.forEach((item: any) => {
      if (item.id === index) {
        item.selected = !item.selected;
      }
    });

    setTimeout(() => {
      setFetching(false);
    }, 100);
  };

  

  const sendPharmacyUser = async (pharmacy_id: any, bool: any) => {
    setShowLoading(true)
    checkStorage("USER_LOGGED", async (id: any) => {
      if (bool) {
        const url = "/userPharmacy/createUserPharmacy";
        hideLoadingModal(async () => {
          await sendData(url, { pharmacy_id, user_id: id }).then((response) => {
            if (response.ok) {
              setListByUser((prevState: any) => {
                // Verificar si el elemento ya está en el array
                if (!prevState.includes(pharmacy_id)) {
                  // Si no está presente, crear un nuevo array con el elemento añadido y devolverlo
                  return [...prevState, pharmacy_id];
                } else {
                  // Si ya está presente, devolver el estado anterior sin hacer cambios
                  return prevState;
                }
              });
            } else {
              showErrorToastGood(translation.t("httpConnectionError"))
            }
          });
        })
      } else {
        const urlDelete = `/userPharmacy/deleteUserPharmacyById`;
        hideLoadingModal(async () => {
          await sendData(urlDelete, { pharmacy_id, user_id: id }).then((res) => {
            if (res.ok) {
              setList((prevList: any) =>
                prevList.map((item: any) => {
                  if (item.id === pharmacy_id) {
                    // Retorna un nuevo objeto con el valor actualizado
                    return { ...item, selected: false };
                  }
                  return item; // Retorna el objeto sin cambios
                })
              );
  
              setListByUser([
                ...listByUser.filter((item: any) => item != pharmacy_id),
              ]);
            } else {
              showErrorToastGood(translation.t("httpConnectionError"))
            }
          });
        })
      }
    });
  };

  const handleChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const url = `/pharmacies/getPharmacyByText/${query}`;
      fetchData(url).then((res: any) => {
        const listResult: any = [];
        res.result.forEach((element: any) => {
          listResult.push({
            name: element.name,
            id: element.id,
            img: element.img,
            country: element.country_name,
            selected: listByUser.some((e: any) =>
              e === element.id ? true : false
            ),
          });
        });

        setList(
          listResult.sort((a: any, b: any) => {
            if (a.selected && !b.selected) {
              return -1;
            } else if (!a.selected && b.selected) {
              return 1;
            } else {
              return 0;
            }
          })
        );
      });
    } else {
      getPharmacies();
    }
  };

  const showErrorToastGood = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  return (
    <Container>
      {/* <HeaderComponent /> */}
      <Loading showLoading={showLoading} translation={translation} />
      {!showBack && <HeaderComponent />}
      <View style={{ height: "10%", padding: 10, gap: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            borderColor: "#ccc",
            // marginTop: 10,
            height: 50,
          }}
          placeholder={translation.t("Search")}
          clearButtonMode="always"
          autoCorrect={false}
          autoCapitalize="none"
          value={searchQuery}
          onChangeText={handleChange}
        />
        <FontAwesome
          style={styles.inputIcon}
          name={"search"}
          size={20}
          color={"#5f7ceb"}
        />
      </View>
      <View style={{ height: `${!showBack ? "70%" : "90%"}` }}>
        <FlatList
          refreshing={fetching}
          data={list}
          onRefresh={getPharmacies}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => {
                selectPharmacy(item.id);
                setFetching(true);
              }}
            >
              <View style={styles.productImage}>
                <Image
                  source={{ uri: item.img ? item.img : defaultProductImg }}
                  style={{ flex: 1, resizeMode: "contain" }}
                />
              </View>
              <View style={{ width: "60%", marginLeft: 10 }}>
                <Text style={styles.productTitle}>{item.name}</Text>
                <Text style={styles.productCountry}>{item.country}</Text>
              </View>
              <View style={{ width: "15%" }}>
                <View
                  style={
                    {
                      // flexDirection: "row",
                      // justifyContent: "space-between",
                    }
                  }
                >
                  <Pressable>
                    <CheckBox
                      checked={item.selected}
                      checkedColor="green"
                      onPress={() => {
                        selectPharmacy(item.id);
                        setFetching(true);
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            </TouchableOpacity>
          )}
        ></FlatList>
      </View>
      {!showBack && (
        <View style={{ height: "10%", marginHorizontal: 15, marginTop: 10 }}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Root",
                    params: {
                      phId: 536,
                    },
                    screen: "Home",
                  },
                ],
              });
            }}
            // disabled={
            //   list.filter((item: any) => item.selected == true).length == 0
            // }
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              {translation.t("home")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  productCard: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
  },
  productImage: {
    height: 80,
    width: "25%",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    alignItems: "center",
  },
  productCountry: {
    fontSize: 12,
    fontWeight: "600",
  },

  productAdd: {
    backgroundColor: "#FE6A00",
    padding: 4,
    borderRadius: 100,
  },
  productAddIcon: {
    // color: 'white',
    // fontSize: 20
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  inputIcon: {
    position: "absolute",
    right: 15,
    top: 12.5,
    zIndex: 2,
    padding: 10,
  },
});
