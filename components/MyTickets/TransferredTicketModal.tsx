import React, { useEffect, useState } from "react";
import { fetchData, sendData } from "../../httpRequests";
import Toast from "react-native-root-toast";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Loading } from "../Shared";
import { Button } from "react-native-elements";
import { MultiSelect } from "react-native-element-dropdown";
import { formatter } from "../../utils";
import { AlertDialog } from "../AlertDialog";

export default function TransferredTicketModal({
  setShowModal,
  showModal,
  translation,
  ticketData,
}: any) {
  const [showLoading, setShowLoading]: any = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [transferredTicketsArr, setTransferredTicketsArr] = useState<
    Array<any>
  >([]);
  const [ticketDetails, setTicketDetails]: any = useState([]);
  const [ticketDetailsFilter, setTicketDetailsFilter]: any = useState([]);
  const [selectedTickets, setSelectedTickets]: any = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    getTicketUserDetails(ticketData.id);
  }, [ticketData]);

  const getTicketUserDetails = async (id: number) => {
    const url = `/tickets/getTicketsDetailsToSend/${id}`;
    fetchData(url).then(async (response: any) => {
      if (response.ok) {
        const mappedValues = response.ticketDetails
          .filter((item: any) => !item.hasNonRedeemedTransfer) // Filter items first
          .map((item: any) => ({
            label: item.serialNumber,
            value: item.id,
          }));
        setTicketDetails(mappedValues);
        setTicketDetailsFilter(mappedValues);
      }
    });
  };

  const handleAddTransferredTickets = () => {
    if (selectedTickets.length > 0) {
      if (email || phone) {
        const removeSelected = ticketDetails.filter(
          (item: any) => !selectedTickets.includes(item.value)
        );
        setTicketDetails(removeSelected);

        setTransferredTicketsArr([
          ...transferredTicketsArr,
          { email, phone, selectedTickets: [...selectedTickets] },
        ]);

        setEmail("");
        setPhone("");
        setSelectedTickets([]);

        ticketData.amount = ticketData.amount - selectedTickets.length;
      } else {
        showErrorToast("Para agregar debe tener email o telefono");
      }
    }
  };

  const handleDeleteTransferredTickets = () => {
    const selectedTicketsToAdd =
      transferredTicketsArr.slice(-1)[0].selectedTickets;
    const addSelectedTickets = ticketDetailsFilter.filter((item: any) =>
      selectedTicketsToAdd.includes(item.value)
    );

    setTicketDetails((prev: any) => [...prev, ...addSelectedTickets]);

    if (transferredTicketsArr.length > 0) {
      ticketData.amount = ticketData.amount + selectedTicketsToAdd.length;
      setTransferredTicketsArr(transferredTicketsArr.slice(0, -1));
    }
  };

  const transferTicketsFunction = async () => {
    setShowLoading(true);
    const url = `/tickets/TransferTicketsToUsers`;
    await sendData(url, { ticketsArr: transferredTicketsArr, language: translation.locale }).then(
      (response: any) => {
        if (response.ok) {
          setShowLoading(false);
          setShowModal(false);
          setEmail("");
          setPhone("");
          setSelectedTickets([]);
          setTransferredTicketsArr([]);
          showSuccessToast("Solicitud para transferir tickets correctamente");
        } else {
          setShowLoading(false);
          showSuccessToast(response.message);
        }
      }
    );
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
      <AlertDialog
        modalVisible={showDialog}
        setModalVisible={setShowDialog}
        color="#5f7ceb"
        iconName={"alert-circle"}
        confirmation={(res: any) => {
          transferTicketsFunction();
          setShowDialog(false);
        }}
        title={"Confirmación"}
        description={"Estas seguro de realizar esta transferencia de tickets?"}
        confirmButtonText={"Confirmar"}
        cancelButtonText={"Cancelar"}
      />

      <Loading showLoading={showLoading} translation={translation} />
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
              setShowModal(!showModal);
              setEmail("");
              setPhone("");
              setTransferredTicketsArr([]);
              setSelectedTickets([]);
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
          Transferencia de tickets
        </Text>

        <View style={{ marginVertical: 10, gap: 5 }}>
          <Text>Evento: {ticketData.event_name}</Text>
          <Text>Categoria: {ticketData.ticketCategory_name}</Text>
          <Text>Precio: {formatter(ticketData.tickets_price)}</Text>
          <Text>Cantidad disponible: {ticketData.amount}</Text>
        </View>

        <View>
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            placeholder={translation.t("TypeEmail")}
            autoCapitalize="none"
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

          <Text style={styles.labelInput}>Tickets</Text>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={ticketDetails}
            value={selectedTickets}
            search
            labelField="label"
            valueField="value"
            maxHeight={300}
            placeholder={"Selecciona tickets"}
            searchPlaceholder={"Busca tickets a enviar"}
            onChange={(items: any) => {
              setSelectedTickets(items);
            }}
          />

          <View
            style={{
              justifyContent: "space-between",
              marginTop: 5,
              maxHeight: "70%",
            }}
          >
            <FlatList
              data={transferredTicketsArr}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  {item.email && (
                    <Text style={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "500" }}>Email: </Text>
                      {item.email}
                    </Text>
                  )}
                  {item.phone && (
                    <Text style={{ fontSize: 15 }}>
                      <Text style={{ fontWeight: "500" }}>Telefono: </Text>

                      {item.phone}
                    </Text>
                  )}
                  <View style={{ flexDirection: "column", gap: 5 }}>
                    <Text style={{ fontWeight: "500" }}>Tickets: </Text>
                    <View style={{ flexDirection: "column" }}>
                      {item.selectedTickets.map((item: number) => (
                        <Text key={item}>
                          •{" "}
                          {
                            ticketDetailsFilter.find(
                              (e: any) => e.value == item
                            ).label
                          }
                        </Text>
                      ))}
                    </View>
                  </View>
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
              onPress={handleDeleteTransferredTickets}
              style={{ marginTop: 15, width: "100%" }}
            />
            <Button
              title={translation.t("add")}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: "#5f7ceb",
                padding: 10,
              }}
              onPress={handleAddTransferredTickets}
              style={{
                marginTop: 15,
                width: "100%",
              }}
            />
          </View>

          <Button
            buttonStyle={{ borderRadius: 10, backgroundColor: "#5f7ceb" }}
            style={{ marginTop: 15 }}
            title={translation.t("Send")}
            onPress={() => {
              // transferTicketsFunction();
              setShowDialog(true);
            }}
            disabled={transferredTicketsArr.length == 0}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

  dropdown: {
    height: 60,
    borderBottomColor: "gray",
    marginBottom: 15,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#CCCCCD",
    paddingLeft: 10,
    fontWeight: "500",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    borderColor: "#F7F7F7",
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
  },
  item: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 5,
  },
});
