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
import filter from "lodash.filter";

export default function SelectMarinasScreen({ navigation, route }: any) {
  const { showBack } = route.params || {};
  const { translation } = React.useContext(LanguageContext);
  const defaultProductImg =
    "http://openmart.online/frontend/imgs/no_image.png?";
  const [listPharmacy, setListPharmacy]: any = useState([]);
  const [listPharmacyFull, setListPharmacyFull]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [searchQuery, setSearchQuery]: any = useState("");
  const [list, setList]: any = useState([]);
  const [listByUser, setListByUser]: any = useState([]);

  useEffect(() => {
    getPharmacies();
    if (showBack) {
      navigation.setOptions({ headerShown: true });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, []);

  const getPharmacies = async () => {
    setFetching(true);
    checkStorage("USER_LOGGED", async (userId: any) => {
      let url = `/pharmacies/getPharmacies`;
      let urlPharmacyByUser = `/userPharmacy/getUserPharmacyByUserId/${userId}`;
      await fetchData(urlPharmacyByUser).then((res) => {
        if (res.ok) {
          res.userPharmacy.map((element: any) => {
            listByUser.push(element.pharmacy_id);
          });
        }
      });

      await fetchData(url).then((response) => {
        if (response.ok) {
          setListPharmacy(response.pharmacy);
          setListPharmacyFull(response.pharmacy);
          const list: any = [];
          response.pharmacy.forEach((element: any) => {
            list.push({
              name: element.name,
              id: element.id,
              img: element.img,
              selected: listByUser.some((e: any) =>
                e === element.id ? true : false
              ),
            });
          });
          setList(list);
        }
        setFetching(false);
      });
    });
  };

  const selectPharmacy = (index: any) => {
    list[index].selected = !list[index].selected;
    setTimeout(() => {
      setFetching(false);
    }, 100);
  };

  const sendPharmacyUser = async () => {
    checkStorage("USER_LOGGED", async (id: any) => {
      const url = "/userPharmacy/createUserPharmacy";
      const newList = list
        .filter((element: any) => {
          return element.selected === true;
        })
        .map((e: any) => {
          return {
            pharmacy_id: e.id,
            user_id: id,
          };
        });
      if (list.some((e: any) => e.selected === false)) {
        const listFalse = list.filter((e: any) => {
          return e.selected === false;
        });

        const newListDelete = listFalse.map((e: any) => {
          return e.id;
        });

        const urlDelete = `/userPharmacy/deleteUserPharmacyById`;
        sendData(urlDelete, { data: newListDelete });
      }

      await sendData(url, { data: newList }).then((response) => {
        if (response.ok) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Root",
                params: { phId: 536 },
                screen: "Home",
              },
            ],
          });
        }
      });
    });
  };

  const handleChange = (query: string) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(listPharmacyFull, (data: any) => {
      return contains(data, formattedQuery);
    });
    setList(filteredData);
  };

  const contains = ({ name }: any, query: any) => {
    if (name.toLowerCase().includes(query)) {
      return true;
    }

    return false;
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
          placeholder="Search"
          clearButtonMode="always"
          autoCorrect={false}
          autoCapitalize="none"
          value={searchQuery}
          onChangeText={(query) => {
            handleChange(query);
          }}
        />
        <FontAwesome
          style={styles.inputIcon}
          name={"search"}
          size={20}
          color={"#5f7ceb"}
        />
      </View>
      <View style={{ height: "70%" }}>
        <FlatList
          refreshing={fetching}
          data={list}
          onRefresh={getPharmacies}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => {
                selectPharmacy(index);
                setFetching(true);
              }}
            >
              <View style={styles.productImage}>
                <Image
                  source={{ uri: item.img ? item.img : defaultProductImg }}
                  style={{ flex: 1, resizeMode: "contain"}}
                />
              </View>
              <View style={{width:'60%', alignItems:'center'}}>
                <Text style={styles.productTitle}>{item.name}</Text>
              </View>
              <View style={{width:'15%' }}>
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
                          selectPharmacy(index);
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
      <View style={{ height: "10%", marginHorizontal: 15, marginTop: 10 }}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            sendPharmacyUser();
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {translation.t("Save")}
          </Text>
        </TouchableOpacity>
      </View>
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
    width: '25%',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
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
