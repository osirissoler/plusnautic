import React, { useState } from "react";
import { fetchData, sendData } from "../../httpRequests";
import Toast from "react-native-root-toast";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { Loading } from "../Shared";
import { Button } from "react-native-elements";

export default function EnterTicketCodeModal({
  setShowModal,
  showModal,
  translation,
  userId,
  setActiveTab,
  getTicketUser,
}: any) {
  const [showLoading, setShowLoading]: any = useState(false);
  const [codeValue, setCodeValue] = useState("");

  const getGuestDetailsByCode = async () => {
    try {
      setShowLoading(true);
      if (!codeValue) {
        showErrorToast(translation.t("EnterCodeMsg"));
        return;
      }

      const url = `/tickets/redeemTickets`;
      const data = { code: codeValue, user_id: userId };

      sendData(url, data).then((res: any) => {
        if (res.ok) {
          setShowLoading(false);
          showSuccessToast(res.message);
          setShowModal(false);
          setActiveTab(1);
          setCodeValue("");
          getTicketUser(userId);
        } else {
          showErrorToast(res.message);
          setShowLoading(false);
          setCodeValue("");
        }
      });
    } catch (error) {
      showErrorToast(translation.t("CodeSentError"));
      setShowLoading(false);
    }
  };

  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  const showSuccessToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(!showModal);
      }}
    >
      <Loading showLoading={showLoading} translation={translation} />
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
                setShowModal(!showModal);
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
