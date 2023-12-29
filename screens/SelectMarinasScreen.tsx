import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
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
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { LanguageContext } from "../LanguageContext";
import * as ImagePicker from "expo-image-picker";
import { fetchData, sendData } from "../httpRequests";
import Toast from "react-native-root-toast";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import filter from "lodash.filter";

let list: any[] = [];
let listByUser: any[] = [];
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
          list = [];
          response.pharmacy.forEach((element: any) => {
            list.push({
              name: element.name,
              id: element.id,
              img: element.img,
              selected: listByUser.some((e) =>
                e === element.id ? true : false
              ),
            });
          });
        } else {
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
      const newList = list.filter((element: any) => {
        return element.selected === true;
      })
      .map((e) => {
        return {
          pharmacy_id: e.id,
          user_id: id,
        };
      });
      if (list.some((e) => e.selected === false)) {
        const listFalse = list.filter((e) => {
          return e.selected === false;
        });

        const newListDelete = listFalse.map((e) => {
          return e.id;
        });

        const urlDelete = `/userPharmacy/deleteUserPharmacyById`;
        sendData(urlDelete, { data: newListDelete })
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
    list = filteredData;
  };

  const contains = ({ name }: any, query: any) => {
    if (name.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  };

  return (
    <Container>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />
      <View style={{ height: "10%", padding: 10, gap: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
            borderColor: "#ccc",
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
      </View>
      <View style={{ height: "75%" }}>
        <FlatList
          // columnWrapperStyle={{ justifyContent: 'space-around' }}
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
                  style={{ flex: 1, resizeMode: "contain" }}
                />
              </View>
              <View style={{ justifyContent: "space-between", width: 160 }}>
                <Text style={styles.productTitle}>{item.name}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Pressable>
                    {/* <AntDesign name='plus' size={18} style={styles.productAddIcon} /> */}
                    {/* {(item.selected == true) ? <AntDesign name="checksquareo" size={24} color="green" style={styles.productAddIcon} />
                                            : <AntDesign name="minussquareo" size={24} color="black" style={styles.productAddIcon} />} */}
                    {/* <CheckBox
                                            checked={true}
                                            color={"red"}
                                            // disabled={false}
                                            onPress={() => {selectPharmacy(index) }}
                                        /> */}
                    {/* <InputController value={{ index: index, selected: item.selected }} ></InputController> */}
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
          // numColumns={1}
        ></FlatList>
      </View>
      <View style={{ height: "10%", marginHorizontal: 15, marginTop: 10 }}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            sendPharmacyUser();
          }}
        >
          <Text>Save</Text>
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  productImage: {
    height: 80,
    width: 80,
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
});
