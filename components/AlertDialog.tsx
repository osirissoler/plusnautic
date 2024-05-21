import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const AlertDialog = ({
  modalVisible= false,
  setModalVisible,
  iconName,
  title = '',
  description = '' ,
  color='',
  confirmation,
  confirmButtonText,
  cancelButtonText,
}: {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  color: string;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmation: any;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalContainer}
        // onPress={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ borderWidth: 0 }}>
              <Ionicons name={iconName} size={85} color={color} />
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                borderWidth: 0,
              }}
            >
              {(title != '')&& <Text style={styles.title}>{title}</Text>}
              <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { borderColor: color }]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={[styles.buttonText, { color: color }]}>
                  {cancelButtonText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: color, borderWidth: 0 },
                ]}
                onPress={() => {
                  confirmation(true);
                }}
              >
                <Text style={styles.buttonText}>{confirmButtonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    height: "auto",
    gap: 20
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 10
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
