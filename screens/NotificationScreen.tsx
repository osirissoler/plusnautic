import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { checkStorage, Container, Loading } from "../components/Shared";
import { deleteData, fetchData, sendData, sendDataPut } from "../httpRequests";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { Button } from "react-native-elements";
import HeaderComponent from "../components/Header";

export default function NotificationScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [fetching, setFetching]: any = useState(false);
  const [userId, setUserId] = useState(0);
  const [dockValues, setDockValues]: any = useState([{ label: "" }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    navigation.addListener('focus', () => {
    setShowLoading(true);
    setFetching(true);

    hideLoadingModal(() => {
      checkStorage("USER_LOGGED", async (id: any) => {
        setUserId(id);
        getNotification();
      });
    });
    setTimeout(() => {
      setFetching(false);
      setShowLoading(false);
    }, 2000);
  });
  }, []);

  const getNotification = async () => {
    const url = `/notification/getNotification`;
    fetchData(url).then((response) => {
      if (response.ok) {
        setNotifications(response.notification);
        console.log(response.notification)
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

  const sendCodeToGuest = async () => {
    try {
      if(!codeValue){
        showErrorToast("Debes ingresar el código")
        return
      }

      const url = '/guest/updateUserDetailByCode'
      const data = {code: codeValue, user_id: userId}
      sendDataPut(url, data).then((response: any) => {
        if (response.ok) {
          showGoodToast("Código enviado correctamente");
          setCodeValue("")
          setModalVisible(false)
        } else {
          showErrorToast(response.message);
        }
      });
    } catch (error) {
      showErrorToast("Ha occurido un error al enviar codigo");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <HeaderComponent />
      <Loading showLoading={showLoading} translation={translation} />
      <View style={{alignItems:'center', marginBottom: 30 }}>
        <Text style={{alignItems:'center', fontWeight: "600", textAlign: "center", fontSize: 15}}>{translation.t("GuestInvitedMsg")}</Text>
      </View>
      <View style={{ height: "83%", marginBottom: 0 }}>
        {notifications?.length > 0 ? (
          <FlatList
            refreshing={fetching}
            data={notifications}
            onRefresh={() => {
                getNotification();
            }}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={{
                  borderColor: "#8B8B9720",
                  backgroundColor: "#F7F7F7",
                  marginBottom: 10,
                  borderRadius: 10,
                  padding: 5,
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
                        borderRadius: 60,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        width: 70,
                        height: 70,
                      }}
                    >
                      <Image
                        source={require("../assets/images/invitacion.png")}
                        style={{ height: 50, width: 50, resizeMode: "contain" }}
                      />
                    </View>

                    <View style={{ width: "80%", overflow: "hidden" }}>
                      <Text
                        numberOfLines={1}
                        style={{ marginVertical: 3, fontWeight: "bold" }}
                      >
                        {item.title}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                        {item.description}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          Tipo de notification:
                        </Text>
                        {item.typeNotification}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          {translation.t("Date")}:
                        </Text>
                        {item.date}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{alignItems:'center'}}>
            <Text>{translation.t("NoGuest")}</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.optionText}>{"Ingresar código"}</Text>
            <TextInput
              style={styles.input}
              placeholder={"Ingresar código"}
              onChangeText={(text) => setCodeValue(text)}
              value={codeValue}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title={translation.t("Cancel")}
                buttonStyle={{ backgroundColor: "red" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setCodeValue("");
                }}
              />
              <Button
                title={translation.t("Send")}
                onPress={() => {
                  sendCodeToGuest()
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
