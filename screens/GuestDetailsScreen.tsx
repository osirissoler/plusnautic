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

export default function GuestDetailsScreen({ navigation, route }: any) {
  const { guest_id } = route.params;
  const { translation } = React.useContext(LanguageContext);
  const [fetching, setFetching]: any = useState(false);
  const [guestDetail, setGuestDetail]: any = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [idValue, setIdValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [namesArray, setNamesArray]: any = useState([]);
  const [name, setName] = useState("");

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
      setShowLoading(true);
      if (!editMode) {
        const url = `/guest/addGuest/`;
        await sendData(url, data).then((response: any) => {
          if (response.ok) {
            showGoodToast(`Invitado modificado correctamente`);
            getGuestDetails(guest_id);
            console.log(response);
            setModalVisible(!modalVisible);
            setNamesArray([]);
          }
        });
      } else {
        const url = `/guest/updateGuestDetails/`;
        await sendDataPut(url, data).then((response: any) => {
          if (response.ok) {
            showGoodToast(`Invitado modificado correctamente`);
            getGuestDetails(guest_id);
            console.log(response)
            setModalEditVisible(!modalEditVisible);
            setInputValue("");
            setIdValue(0);
          }
        });
      }
      hideLoadingModal(() => {
        
      })
    } catch (error: any) {
      hideLoadingModal(() => {
        console.log(error);
        showErrorToast(`Ha ocurrido un error: ${error}`);
      });
    }
  };

  const deleteGuestDetail = async (id: any) => {
    try {
      setShowLoading(true);
      const url = `/guest/deleteGuestDetails/${id}`;
      await deleteData(url).then((response: any) => {
        if (guestDetail.length === 1) {
          navigation.navigate("GuestScreen", {refresh: response});
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
      setNamesArray([...namesArray, name]);
      setName("");
    }
  };

  const handleDeleteName = () => {
    setNamesArray(namesArray.slice(0, -1));
  };

  return (
    <View style={{ backgroundColor: "#F2F2F2", height: "100%" }}>
      <Loading showLoading={showLoading} translation={translation} />
      <View
        style={{
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginRight: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{translation.t("addGuest")}</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditMode(false);
            }}
          >
            <AntDesign name="adduser" size={35} style={{ color: "#000" }} />
          </TouchableOpacity>
        </View>
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
            <Text style={styles.optionText}>{translation.t("updateName")}</Text>
            <TextInput
              style={styles.input}
              placeholder={translation.t("EnterName")}
              onChangeText={(text) => setInputValue(text)}
              value={inputValue}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title={translation.t("Cancel")}
                buttonStyle={{ backgroundColor: "red" }}
                onPress={() => {
                  setModalEditVisible(!modalEditVisible);
                  setInputValue("");
                  setIdValue(0);
                }}
              />
              <Button
                title={translation.t("Send")}
                onPress={() => {
                  sendDataToBackend({ id: idValue, name: inputValue });
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
          <Text style={{fontWeight: "bold", fontSize: 20}}>{translation.t("addGuests")}</Text>
          <View>
            <Text style={styles.labelInput}>{translation.t("Name")}</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder={translation.t("TypeName")}
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
                    <Text style={{ fontSize: 15 }}> ➤ {item}</Text>
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
                buttonStyle={{ backgroundColor: "red", borderRadius: 5  }}
                onPress={handleDeleteName}
                style={{ marginTop: 15, width: "100%" }}
              />
              <Button
                title={translation.t("add")}
                buttonStyle={{ borderRadius: 5 }}
                onPress={handleAddName}
                style={{
                  marginTop: 15,
                  width: "100%",
                }}
              />
            </View>

            <Button
            style={{marginTop: 15}}
                title={translation.t("Send")}
                onPress={() => {
                  sendDataToBackend({ guest_id: guest_id, name: namesArray });
                }}
              />
          </View>
        </View>
      </Modal>

      <View style={styles.childBody}>
        <FlatList
          data={guestDetail}
          numColumns={2}
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
            <View style={styles.option}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                      source={require("../assets/images/invitados.png")}
                      style={{ height: 50, width: 50, resizeMode: "contain" }}
                    />
              </View>
              <Text style={styles.optionText}>{item.name}</Text>

              <View
                style={{ flexDirection: "row", gap: 30, paddingHorizontal: 20 }}
              >
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setModalEditVisible(true);
                    setInputValue(item.name);
                    setIdValue(item.id);
                    setEditMode(true);
                  }}
                >
                  <AntDesign name="edit" size={25} style={{ color: "#000" }} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
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
                  }}
                >
                  <AntDesign name="delete" size={25} style={{ color: "red" }} />
                </TouchableOpacity>
              </View>
            </View>
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
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  option: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderColor: "rgba(0, 0, 0,  0.1)",
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    maxWidth: 240
  },
  optionButton: {
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
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
    alignItems: "center",
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
    height: 40,
    borderColor: "gray",
    width: 200,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
