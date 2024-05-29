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

export default function TypeCodeModal({
  modalVisible,
  setModalVisible,
  translation,
  setCodeValue,
  codeValue,
  getGuestDetailsByCode,
  updateStatusToGuest,
  guestModalVisible,
  setGuestModalVisible,
  guestDetailsData,
  dockValues,
}: any) {
  return (
    <>
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
            <Text style={styles.optionText}>{translation.t("EnterCode")}</Text>
            <TextInput
              style={styles.input}
              placeholder={"######"}
              onChangeText={(text) => setCodeValue(text)}
              value={codeValue}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title={translation.t("Cancel")}
                buttonStyle={{ backgroundColor: "#DF4D49", borderRadius: 10 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setCodeValue("");
                }}
              />
              <Button
                buttonStyle={{ backgroundColor: "#5f7ceb", borderRadius: 10 }}
                title={translation.t("Send")}
                onPress={() => {
                  getGuestDetailsByCode();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={guestModalVisible}
        onRequestClose={() => {
          setGuestModalVisible(!guestModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {guestDetailsData && (
              <>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
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

                  <View
                    style={{
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{ marginVertical: 3, fontWeight: "bold" }}
                    >
                      {guestDetailsData.title}
                    </Text>
                    <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                      {guestDetailsData.description}
                    </Text>
                    <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {translation.t("Boat")}:{" "}
                      </Text>
                      {guestDetailsData.boat_name}
                    </Text>
                    <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {translation.t("Date")}:{" "}
                      </Text>
                      {guestDetailsData.date}
                    </Text>
                    <Text ellipsizeMode="tail" style={{ marginVertical: 0 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {translation.t("Dock")}:{" "}
                      </Text>
                      {
                        dockValues?.find(
                          (a: any) => a.value == guestDetailsData.dock
                        )?.label
                      }
                    </Text>
                  </View>
                </View>
              </>
            )}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Button
                title={translation.t("Reject")}
                buttonStyle={{ backgroundColor: "#DF4D49", borderRadius: 10 }}
                onPress={() => {
                  updateStatusToGuest("RECHAZADO");
                }}
              />
              <Button
                buttonStyle={{ backgroundColor: "#5f7ceb", borderRadius: 10 }}
                title={translation.t("Accept")}
                onPress={() => {
                  updateStatusToGuest("ACEPTADO");
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
