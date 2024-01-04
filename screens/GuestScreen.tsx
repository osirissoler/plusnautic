import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  ImageBackground,
  Image,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import HeaderComponent from "../components/Header";
import { checkStorage, Container, Loading } from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Button } from "react-native-elements";
import moment from "moment";

export default function GuestScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [fetching, setFetching]: any = useState(false);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [namesArray, setNamesArray]: any = useState([]);
  const [boat, setBoats] = useState([]);
  const [guest, setGuests] = useState([]);

  useEffect(() => {
    checkStorage("USER_LOGGED", async (id: any) => {
      getGuestByUser(id);
    });
  }, []);

  const getGuestByUser = async (id: any) => {
    const url = `/guest/getGuestByUser/${id}`;
    fetchData(url).then((response) => {
      if (response.ok) {
        console.log(response.guest);
        setGuests(response.guest);
      }
    });
  };

  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  const showGoodToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <View style={{ height: "100%", marginBottom: 10 }}>
        {guest.length > 0 ? (
          <FlatList
            refreshing={fetching}
            data={guest}
            onRefresh={() => {
              getGuestByUser;
            }}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={{
                  borderColor: "#8B8B9720",
                  backgroundColor: "#F7F7F7",
                  marginBottom: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  navigation.navigate("GuestDetailsScreen", {
                    guest_id: item.id,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f3ecec",
                        borderRadius: 60,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        width: 70,
                        height: 70,
                      }}
                    >
                      {/* <Image
                      source={require("../../assets/images/logoFacilito.png")}
                      style={{ height: 50, width: 50, resizeMode: "contain" }}
                    /> */}
                      <AntDesign name="bells" size={50} />
                    </View>

                    <View style={{ width: "55%", overflow: "hidden" }}>
                      <Text
                        numberOfLines={1}
                        style={{ marginVertical: 5, fontWeight: "bold" }}
                      >
                        {item.title}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 5 }}>
                        {item.description}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 5 }}>
                        {item.date}
                      </Text>
                    </View>
                    <View style={{ width: "20%", alignItems: "center" }}>
                      <Text>${item.userServices_price}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View>
            <Text>No tienes invitados</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 16,
  },
  label: {
    flex: 1,
    paddingHorizontal: 16,
  },
  body: {
    marginHorizontal: 15,
    backgroundColor: "gray",
    borderRadius: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    marginBottom: 5,
    paddingLeft: 25,
  },
  labelInput: {
    fontSize: 15,
    color: "#8B8B97",
    marginTop: 10,
  },
  addButton: {
    marginVertical: 20,
    fontSize: 20,
    padding: 5,
  },
  textInput: {
    height: 50,
    width: "100%",
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#F7F7F7",
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 5,
  },
  textArea: {
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingRight: 45,
    paddingLeft: 20,
    textAlignVertical: "top", // Alineación vertical del texto
    minHeight: 100, // Altura mínima del área de texto
  },
  formInputIcon: {
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    position: "absolute",
    right: 5,
    top: "15%",
    zIndex: 2,
    padding: 10,
  },
  errorText: {
    maxHeight: 20,
    textAlign: "center",
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
  registerButtonDisabled: {
    width: "100%",
    height: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
  },
  loginLink: {
    padding: 5,
    color: "#5f7ceb",
  },
  dropdown: {
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  profilePicture: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
});
