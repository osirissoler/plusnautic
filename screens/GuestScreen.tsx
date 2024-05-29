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
import MyGuests from "../components/MyGuests/MyGuests";
import ReceivedGuests from "../components/MyGuests/ReceivedGuests";
import TypeCodeModal from "../components/MyGuests/TypeCodeModal";

export default function GuestScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [fetching, setFetching]: any = useState(false);
  const [guest, setGuests] = useState([]);
  const [userId, setUserId] = useState(0);
  const [boat, setBoats]: any = useState([]);
  const [dockValues, setDockValues]: any = useState([{ label: "" }]);
  const [activeTab, setActiveTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [guestDetailsData, setGuestDetailsData]: any = useState([]);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [userGuest, setUserGuest] = useState([]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setShowLoading(true);
      setFetching(true);

      hideLoadingModal(() => {
        checkStorage("USER_LOGGED", async (id: any) => {
          setUserId(id);
          getGuestByUser(id);
          searchDock();
          getGuestDetailsByUserId(id);
          const url = `/boatsRecords/getBoatRecordByUser/${id}`;
          fetchData(url).then(async (res: any) => {
            if (res.ok) {
              const mappedValues = res.boatsRecord.map((boatsRecord: any) => ({
                label: boatsRecord.boat_name,
                value: boatsRecord.id,
                dock: boatsRecord.dock,
              }));
              setBoats(mappedValues);
            }
          });
        });
      });
      setTimeout(() => {
        setFetching(false);
        setShowLoading(false);
      }, 1000);
    });
  }, []);

  const getGuestDetailsByUserId = async (id: any) => {
    const url = `/guest/getGuestDetailsByUserId/${id}`;
    fetchData(url).then((response) => {
      if (response.ok) {
        setUserGuest(response.guestDetails);
      }
    });
  };

  const handleTabPress = (index: any) => {
    setActiveTab(index);
  };

  const searchDock = async () => {
    const url = `/products/getProducts`;
    fetchData(url).then(async (res: any) => {
      if (res.ok) {
        const mappedValues = await res.product.map((product: any) => ({
          label: product.name,
          value: product.id,
        }));
        setDockValues(mappedValues);
      }
    });
  };

  const filterDock = (dockId: any) => {
    const data = dockValues.find((b: any) => b.value == dockId);
    return [data];
  };

  const getGuestByUser = async (id: any) => {
    const url = `/guest/getGuestByUser/${id}`;
    fetchData(url).then((response) => {
      if (response.ok) {
        setGuests(response.guest);
      }
    });
  };

  const getBoatRecordByUser = (boat_id: any) => {
    const foundDocksFromMapped = boat.find(
      (a: any) => a.value === boat_id
    ).dock;
    console.log(foundDocksFromMapped);
    return foundDocksFromMapped;
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
      setShowLoading(false);
      callback();
  };

  const deleteGuest = async (id: any) => {
    try {
      setShowLoading(true);
      const url = `/guest/deleteGuest/${id}`;
      await deleteData(url).then((response: any) => {
        if (response.ok) {
          showGoodToast(translation.t("GuestDeleted"));
          getGuestByUser(userId);
          console.log(response);
        }
      });
      hideLoadingModal(() => {});
    } catch (error: any) {
      hideLoadingModal(() => {
        console.log(error);
        showErrorToast(`${error}`);
      });
    }
  };

  const getGuestDetailsByCode = async () => {
    try {
      if (!codeValue) {
        showErrorToast(translation.t("EnterCodeMsg"));
        return;
      }

      const urlGet = `/guest/getGuestDetailsByCode/${codeValue}`;
      fetchData(urlGet).then((res: any) => {
        if (res.ok) {
          if (res.guestDetails.ServiceStatus_code != "PENDING") {
            showErrorToast(translation.t("CodeIsUsedMsg"));
            return;
          }
          setGuestDetailsData(res.guestDetails);
          setModalVisible(false);
          setGuestModalVisible(true);
        } else {
          showErrorToast(translation.t("WrongCode"));
        }
      });
    } catch (error) {
      showErrorToast(translation.t("CodeSentError"));
    }
  };

  const updateStatusToGuest = async (servicesStatusCode: any) => {
    try {
      const url = "/guest/updateUserDetailByCode";
      const data = {
        code: codeValue,
        user_id: userId,
        servicesStatusCode: servicesStatusCode,
      };
      sendDataPut(url, data).then((response: any) => {
        if (response.ok) {
          showGoodToast(translation.t("CodeSent"));
          setCodeValue("");
          setGuestModalVisible(false);
          getGuestDetailsByUserId(userId);
          setActiveTab(1)
        } else {
          showErrorToast(response.message);
        }
      });
    } catch (error) {
      showErrorToast(translation.t("CodeSentError"));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />
      <Text
        style={{
          alignItems: "center",
          fontWeight: "600",
          textAlign: "center",
          fontSize: 15,
        }}
      >
        {translation.t("GuestScreenMsg")}
      </Text>
      <View
        style={{
          alignItems: "center",
          marginBottom: 3,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{
            width: "20%",
            height: 50,
            backgroundColor: "#5f7ceb",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginVertical: 10,
          }}
          onPress={() =>
            navigation.navigate("CreateInvitations", { showBack: true })
          }
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {translation.t("add")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: "20%",
            height: 50,
            backgroundColor: "#5f7ceb",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginVertical: 10,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {translation.t("Code")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Text style={styles.tabText}>Mis invitaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={styles.tabText}>Invitaciones recibidas</Text>
        </TouchableOpacity>
      </View>

      <TypeCodeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        translation={translation}
        setCodeValue={setCodeValue}
        codeValue={codeValue}
        getGuestDetailsByCode={getGuestDetailsByCode}
        updateStatusToGuest={updateStatusToGuest}
        guestModalVisible={guestModalVisible}
        setGuestModalVisible={setGuestModalVisible}
        guestDetailsData={guestDetailsData}
        dockValues={dockValues}
      />

      {activeTab === 0 && (
        <MyGuests
          getGuestByUser={getGuestByUser}
          filterDock={filterDock}
          getBoatRecordByUser={getBoatRecordByUser}
          deleteGuest={deleteGuest}
          guest={guest}
          fetching={fetching}
          userId={userId}
          dockValues={dockValues}
          translation={translation}
          navigation={navigation}
        />
      )}

      {activeTab === 1 && (
        <ReceivedGuests
          translation={translation}
          showLoading={showLoading}
          setShowLoading={setShowLoading}
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          guestDetailsData={guestDetailsData}
          guest={userGuest}
          setGuests={setUserGuest}
          userId={userId}
          dockValues={dockValues}
        />
      )}
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

  // Tabs

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#5f7ceb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
