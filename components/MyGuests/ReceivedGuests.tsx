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
import Toast from "react-native-root-toast";
import { Button } from "react-native-elements";
import { Loading, checkStorage } from "../Shared";
import { fetchData, sendDataPut } from "../../httpRequests";
import TypeCodeModal from "./TypeCodeModal";

export default function ReceivedGuests({
  navigation,
  translation,
  showLoading,
  setShowLoading,
  guest,
  setGuests,
  userId,
  dockValues,
}: any) {
  const [fetching, setFetching]: any = useState(false);

  const getGuestDetailsByUserId = async (id: any) => {
    const url = `/guest/getGuestDetailsByUserId/${id}`;
    fetchData(url).then((response) => {
      if (response.ok) {
        setGuests(response.guestDetails);
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <Loading showLoading={showLoading} translation={translation} />

      <View style={{ height: "83%", marginBottom: 0 }}>
        {guest?.length > 0 ? (
          <FlatList
            refreshing={fetching}
            data={guest}
            onRefresh={() => {
              getGuestDetailsByUserId(userId);
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
                        source={require("../../assets/images/invitacion.png")}
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
                          {translation.t("Boat")}:{" "}
                        </Text>
                        {item.boat_name}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          {translation.t("Date")}:{" "}
                        </Text>
                        {item.date}
                      </Text>
                      <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          {translation.t("Dock")}:{" "}
                        </Text>
                        {
                          dockValues?.find((a: any) => a.value == item.dock)
                            ?.label
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              paddingHorizontal: 10,
              gap: 20,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}
            >
              {translation.t("NoGuest")}
            </Text>
            <Image
              source={require("../../assets/images/prohibido.png")}
              style={{ height: 80, width: 80 }}
            />
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
