import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign, Foundation, Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { deleteData, fetchData, sendData, sendDataPut } from "../httpRequests";
import { Container, Loading } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";
import Toast from "react-native-root-toast";
import { Button, Image } from "react-native-elements";
import HeaderComponent from "../components/Header";

export default function GuestDetailsScreen({ navigation, route }: any) {
  const { guest_id } = route.params;
  const { translation } = React.useContext(LanguageContext);
  const [fetching, setFetching]: any = useState(false);
  const [guestDetail, setGuestDetail]: any = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [inputNameValue, setInputNameValue] = useState("");
  const [inputEmailValue, setInputEmailValue] = useState("");
  const [inputPhoneValue, setInputPhoneValue] = useState("");
  const [idValue, setIdValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [namesArray, setNamesArray]: any = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (guest_id) {
      setShowLoading(true);
      hideLoadingModal(() => {
        getGuestDetails(guest_id);
      });
    }
  }, []);

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };

  const getGuestDetails = async (id: any) => {
    try {
      let url = `/guest/getGuestDetails/${id}`;
      await fetchData(url).then((response: any) => {
        if (response.ok) {
          console.log(response);
          setGuestDetail(response.guest);
        }
      });
    } catch (error) {
      console.log(error);
      showErrorToast(`Ha ocurrido un error: ${error}`);
    }
  };

  const sendDataToBackend = async (data: any) => {
    try {
      if (!editMode) {
        const url = `/guest/addGuest/`;
        await sendData(url, data).then((response: any) => {
          if (response.ok) {
            showGoodToast(`Invitado modificado correctamente`);
            getGuestDetails(guest_id);
            console.log(response);
            setModalVisible(!modalVisible);
            setNamesArray([]);
          } else {
            showErrorToast(response.mensaje);
          }
        });
      } else {
        const url = `/guest/updateGuestDetails/`;
        await sendDataPut(url, data).then((response: any) => {
          if (response.ok) {
            showGoodToast(`Invitado modificado correctamente`);
            getGuestDetails(guest_id);
            console.log(response);
            setModalEditVisible(!modalEditVisible);
            setInputNameValue("");
            setInputEmailValue("");
            setInputEmailValue("");
            setIdValue(0);
          } else {
            showErrorToast(response.mensaje);
          }
        });
      }
    } catch (error: any) {
      console.log(error);
      showErrorToast(`Ha ocurrido un error: ${error}`);
    }
  };

  const deleteGuestDetail = async (id: any) => {
    try {
      setShowLoading(true);
      const url = `/guest/deleteGuestDetails/${id}`;
      await deleteData(url).then((response: any) => {
        if (guestDetail.length === 1) {
          navigation.navigate("GuestScreen", { refresh: response });
        }
        if (response.ok) {
          showGoodToast(`Invitado eliminado correctamente`);
          getGuestDetails(guest_id);
          console.log(response);
        }
      });
      hideLoadingModal(() => {});
    } catch (error: any) {
      hideLoadingModal(() => {
        console.log(error);
        showErrorToast(`Ha ocurrido un error: ${error}`);
      });
    }
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

  const handleAddName = () => {
    if (name) {
      if (email || phone) {
        setNamesArray([...namesArray, { name, email, phone }]);
        setName("");
        setEmail("");
        setPhone("");
      } else {
        showErrorToast("Para agregar debe tener email o telefono");
      }
    }
  };

  const handleDeleteName = () => {
    setNamesArray(namesArray.slice(0, -1));
  };

  return (
    <View style={{ backgroundColor: "#F2F2F2", height: "100%" }}>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />
      <View
        style={{
          marginVertical: 10,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={styles.redirectButton}
          onPress={() => {
            setModalVisible(true);
            setEditMode(false);
          }}
        >
          <Text style={styles.buttonText}>{translation.t("add")}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditVisible}
        onRequestClose={() => {
          setModalEditVisible(!modalEditVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.optionText, { fontWeight: "bold" }]}>
              {translation.t("UpdateData")}
            </Text>
            <Text style={styles.labelInput}>{translation.t("FullName")}</Text>
            <TextInput
              style={styles.input}
              placeholder={translation.t("EnterName")}
              onChangeText={(text) => setInputNameValue(text)}
              value={inputNameValue}
            />
            <Text style={styles.labelInput}>Email</Text>
            <TextInput
              style={styles.input}
              value={inputEmailValue}
              onChangeText={(text) => {
                setInputEmailValue(text);
              }}
              placeholder={translation.t("TypeEmail")}
            />
            <Text style={styles.labelInput}>{translation.t("Phone")}</Text>
            <TextInput
              style={styles.input}
              value={inputPhoneValue}
              onChangeText={(text) => {
                setInputPhoneValue(text);
              }}
              placeholder={translation.t("TypePhone")}
              keyboardType="numeric"
              maxLength={10}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                title={translation.t("Cancel")}
                buttonStyle={{ borderRadius: 10, backgroundColor: "#DF4D49", padding: 10 }}
                onPress={() => {
                  setModalEditVisible(!modalEditVisible);
                  setInputNameValue("");
                  setInputEmailValue("");
                  setInputPhoneValue("");
                  setIdValue(0);
                }}
              />
              <Button
                buttonStyle={{ borderRadius: 10, backgroundColor: "#5f7ceb", padding: 10 }}
                title={translation.t("Send")}
                onPress={() => {
                  sendDataToBackend({
                    id: idValue,
                    name: inputNameValue,
                    email: inputEmailValue,
                    phone: inputPhoneValue,
                  });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            width: "100%",
            padding: 40,
            paddingTop: 70,
            height: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              marginBottom: 20,
              alignItems: "flex-end",
            }}
            onPress={() => {
              {
                setModalVisible(!modalVisible);
              }
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              X
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {translation.t("addGuests")}
          </Text>
          <View>
            <Text style={styles.labelInput}>{translation.t("FullName")}</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder={translation.t("TypeName")}
            />
            <Text style={styles.labelInput}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              placeholder={translation.t("TypeEmail")}
            />
            <Text style={styles.labelInput}>{translation.t("Phone")}</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
              }}
              placeholder={translation.t("TypePhone")}
              keyboardType="numeric"
              maxLength={10}
            />
            <View
              style={{
                justifyContent: "space-between",
                marginTop: 5,
                maxHeight: "70%",
              }}
            >
              <FlatList
                data={namesArray}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={{ fontSize: 15 }}>
                      ➤<Text style={{ fontWeight: "500" }}>Nombre: </Text>
                      {item.name}
                    </Text>
                    {item.email && (
                      <Text style={{ fontSize: 15, paddingLeft: 15 }}>
                        <Text style={{ fontWeight: "500" }}>Email: </Text>
                        {item.email}
                      </Text>
                    )}
                    {item.phone && (
                      <Text style={{ fontSize: 15, paddingLeft: 15 }}>
                        <Text style={{ fontWeight: "500" }}>Telefono:</Text>

                        {item.phone}
                      </Text>
                    )}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                title={translation.t("Delete")}
                buttonStyle={{
                  backgroundColor: "#DF4D49",
                  borderRadius: 10,
                  padding: 10,
                }}
                onPress={handleDeleteName}
                style={{ marginTop: 15, width: "100%" }}
              />
              <Button
                title={translation.t("add")}
                buttonStyle={{  borderRadius: 10, backgroundColor: "#5f7ceb", padding: 10 }}
                onPress={handleAddName}
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              />
            </View>

            <Button
            buttonStyle={{borderRadius: 10, backgroundColor: "#5f7ceb"}}
              style={{ marginTop: 15 }}
              title={translation.t("Send")}
              onPress={() => {
                sendDataToBackend({ guest_id: guest_id, name: namesArray });
              }}
            />
          </View>
        </View>
      </Modal>

      <Text style={{ fontWeight: "bold", fontSize: 20, paddingHorizontal: 20 }}>
        {translation.t("MyGuest")}
      </Text>
      <View style={styles.childBody}>
        <FlatList
          data={guestDetail}
          numColumns={1}
          refreshing={fetching}
          onRefresh={() => getGuestDetails(guest_id)}
          ListFooterComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {translation.t("TotalOfGuest")} {guestDetail.length}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() =>
                Alert.alert(
                  translation.t("alertWarningTitle"), // Alert
                  translation.t("alertUserAnonymousMessage"), // You need to be logged in to perfom this action.
                  [
                    {
                      text: "Editar",
                      onPress: () => {
                        setModalEditVisible(true);
                        setInputNameValue(item.name);
                        setInputEmailValue(item.email);
                        setInputPhoneValue(item.phone);
                        setIdValue(item.id);
                        setEditMode(true);
                      },
                    },
                    {
                      text: "Eliminar",
                      onPress: () => {
                        Alert.alert(
                          translation.t("Warning"),
                          `${
                            guestDetail.length !== 1
                              ? translation.t("MakeSureOnDeleteGuest")
                              : translation.t("LastGuestMsg")
                          }`,
                          [
                            {
                              text: translation.t("alertButtonYesText"),
                              onPress: () => {
                                deleteGuestDetail(item.id);
                              },
                            },
                            {
                              text: translation.t("alertButtonNoText"),
                            },
                          ]
                        );
                      },
                    },
                    {
                      text: "No",
                    },
                  ]
                )
              }
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20%",
                }}
              >
                <Image
                  source={require("../assets/images/invitados.png")}
                  style={{ height: 60, width: 60, resizeMode: "contain" }}
                />
              </View>
              <View
                style={{
                  gap: 10,
                  width: "70%",
                  paddingLeft: 15,
                  borderLeftColor: "gray",
                  borderLeftWidth: 1,
                }}
              >
                <Text style={[styles.optionText, { fontWeight: "bold" }]}>
                  {item.name}
                </Text>
                {item.email && (
                  <Text
                    style={[
                      styles.optionText,
                      { color: "gray", fontWeight: "500" },
                    ]}
                  >
                    {item.email}
                  </Text>
                )}
                {item.phone && (
                  <Text style={[styles.optionText, { fontWeight: "400" }]}>
                    {item.phone}
                  </Text>
                )}
                <View
                  style={[
                    styles.statusButton,
                    { backgroundColor: item.isAccepted ? "#29A744" : "#C63637" },
                  ]}
                >m
                  <AntDesign
                    name={`${item?.isAccepted ? "check" : "close"}`}
                    size={20}
                    style={{ color: "#FFF" }}
                  />

                  <Text
                    style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}
                  >
                    {item?.isAccepted ? "Aceptado" : "No aceptado"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childBody: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 20,
  },
  labelInput: {
    fontSize: 15,
    color: "#8B8B97",
    marginTop: 10,
  },
  textInput: {
    height: 50,
    width: "100%",
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    padding: 10,
  },
  item: {
    padding: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderColor: "#D4D5D5",
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  optionButton: {
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  optionIcon: {
    color: "rgba(0, 0, 0, 0.3)",
  },
  optionIconDelete: {
    color: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 15,
  },
  input: {
    height: 50,
    minWidth: 200,
    maxWidth: 250,
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    padding: 10,
  },
  statusButton: {
    padding: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "80%",
  },
  redirectButton: {
    width: "20%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    // marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
