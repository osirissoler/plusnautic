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
  ImageBackground,
} from "react-native";
import { AntDesign, Foundation, Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { Container, Loading } from "../Shared";
import { LanguageContext } from "../../LanguageContext";
import Toast from "react-native-root-toast";
import { Button, Image } from "react-native-elements";
import HeaderComponent from "../Header";
import { formatter, hideLoadingModal } from "../../utils";

export default function TicketDetailsScreen({ navigation, route }: any) {
  const { ticketUser_id } = route.params;
  const { translation } = React.useContext(LanguageContext);
  const [fetching, setFetching]: any = useState(false);
  const [ticketDetail, setTicketDetail]: any = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    if (ticketUser_id) {
      setShowLoading(true);
      hideLoadingModal(() => {
        getTicketsDetails(ticketUser_id);
      }, setShowLoading);
    }
  }, []);

  const getTicketsDetails = async (id: any) => {
    try {
      let url = `/tickets/getTicketsDetails/${id}`;
      await fetchData(url).then((response: any) => {
        if (response.ok) {
          setTicketDetail(response.ticketDetails);
          console.log(response)
        }
      });
    } catch (error) {
      console.log(error);
      showErrorToast(`Ha ocurrido un error: ${error}`);
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

  return (
    <View style={{ backgroundColor: "#F2F2F2", height: "100%" }}>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />

      <Text style={{ fontWeight: "bold", fontSize: 20, paddingHorizontal: 20 }}>
        Tickets Details
      </Text>
      <View style={styles.childBody}>
        <FlatList
          style={{
            paddingHorizontal: 15,
            backgroundColor: "#F2F2F2",
            height: "80%",
            paddingTop: 5,
            borderRadius: 10,
          }}
          data={ticketDetail}
          numColumns={1}
          refreshing={fetching}
          onRefresh={() => getTicketsDetails(ticketUser_id)}
          renderItem={({ item }) => (
            // <TouchableOpacity
            //   style={styles.option}
            //   onPress={() =>
            //     Alert.alert(
            //       translation.t("Confirm"),
            //       translation.t("ActionToDo"),
            //       [
            //         {
            //           text: translation.t("Delete"),
            //           onPress: () => {
            //             Alert.alert(
            //               translation.t("Warning"),
            //               `${
            //                 ticketDetail.length !== 1
            //                   ? translation.t("MakeSureOnDeleteGuest")
            //                   : translation.t("LastGuestMsg")
            //               }`,
            //               [
            //                 {
            //                   text: translation.t("alertButtonYesText"),
            //                   onPress: () => {
            //                     deleteticketDetail(item.id);
            //                   },
            //                 },
            //                 {
            //                   text: translation.t("alertButtonNoText"),
            //                 },
            //               ]
            //             );
            //           },
            //         },
            //         {
            //           text: translation.t("Cancel"),
            //         },
            //       ]
            //     )
            //   }
            // >
            //   <View
            //     style={{
            //       justifyContent: "center",
            //       alignItems: "center",
            //       width: "20%",
            //     }}
            //   >
            //     <Image
            //       source={require("../../assets/images/ticket.png")}
            //       style={{ height: 60, width: 60, resizeMode: "contain" }}
            //     />
            //   </View>
            //   <View
            //     style={{
            //       gap: 10,
            //       width: "70%",
            //       paddingLeft: 15,
            //       borderLeftColor: "gray",
            //       borderLeftWidth: 1,
            //     }}
            //   >
            //     <Text style={[styles.optionText, { fontWeight: "bold" }]}>
            //       {item.serialNumber}
            //     </Text>

            //     <Text style={[styles.optionText, { fontWeight: "400" }]}>
            //       {formatter(item.price)}
            //     </Text>
            //   </View>
            // </TouchableOpacity>
            <TicketCard item={item} />
          )}
        />
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "10%"
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Total tickets {ticketDetail.length}
        </Text>
      </View>
    </View>
  );
}

function TicketCard({ item }: any) {
  console.log(item);
  return (
    <TouchableOpacity>
      <View style={styles.productCard}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <Text>{item.serialNumber}</Text>

          <View
            style={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 35,
            }}
          >
            <View>
              <Text style={styles.productTitle}>Event:</Text>
              <Text style={styles.productTitle}>{item.event_name}</Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.productTitle}>
                {item.ticketCategory_name}
              </Text>
              <Text style={styles.productTitle}>
                {formatter(item.tickets_price)}
              </Text>
            </View>
          </View>
        </View>

        <Image
          source={{ uri: item.barCode }}
          style={{ resizeMode: "cover", height: 30, width: "100%" }}
        />
      </View>

      <View style={{ ...styles.circle, top: "35%", left: -20 }} />
      <View style={{ ...styles.circle, top: "35%", right: -20 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  childBody: {
    marginTop: 10
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
    width: "90%",
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
    width: "100%",
    height: 50,
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
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },

  // TICKET CARD

    productCard: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 200,
  },
  circle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    position: "absolute",
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
});
