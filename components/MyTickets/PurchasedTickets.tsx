import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import { formatter, hideLoadingModal } from "../../utils";
import { checkStorage } from "../Shared";
import { fetchData } from "../../httpRequests";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

export default function PurchasedTickets({
  navigation,
  route,
  translation,
  setShowModal,
  setTicketData,
  userId,
  setShowLoading,
}: any) {
  const [fetching, setFetching]: any = useState(false);
  const [tickets, setTickets]: any = useState([]);
  const [showModalOption, setShowModalOption]: any = useState(false);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    setShowLoading(true);
    setFetching(true);

    hideLoadingModal(() => {
      checkStorage("USER_LOGGED", async (id: any) => {
        getTicketUser(id);
      });
      setFetching(false);
    }, setShowLoading);
  }, []);

  const getTicketUser = async (id: number) => {
    const url = `/tickets/getTicketUserByUserId/${id}`;
    await fetchData(url).then(async (response: any) => {
      if (response.ok) {
        setTickets(response.tickets);
      }
    });
  };

  return (
    <View style={{ height: "70%", marginBottom: 0 }}>
      <OptionModal
        showModalOption={showModalOption}
        setShowModalOption={setShowModalOption}
        navigation={navigation}
        item={itemData}
        setTicketData={setTicketData}
        setShowModal={setShowModal}
        translation={translation}
      />

      {tickets.length > 0 ? (
        <FlatList
          style={{
            paddingHorizontal: 15,
            backgroundColor: "#F2F2F2",
            height: "65%",
            paddingTop: 5,
            borderRadius: 10,
          }}
          refreshing={fetching}
          data={tickets}
          onRefresh={() => {
            getTicketUser(userId);
          }}
          renderItem={({ item }: any) => (
            <TicketCard
              item={item}
              translation={translation}
              setShowModalOption={setShowModalOption}
              setItemData={setItemData}
            />
          )}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 20,
            flex: 1,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}
          >
            {translation.t("NoTicketsMsg")}
          </Text>
          <Image
            source={require("../../assets/images/non-tickets.png")}
            style={{ height: 80, width: 80 }}
          />
        </View>
      )}
    </View>
  );
}

function OptionModal({
  showModalOption,
  setShowModalOption,
  navigation,
  item,
  setTicketData,
  setShowModal,
  translation,
}: {
  showModalOption: boolean;
  setShowModalOption: Function;
  navigation: any;
  item: any;
  setTicketData: Function;
  setShowModal: Function;
  translation: any
}) {
  return (
    <Modal
      animationType={"none"}
      transparent={true}
      visible={showModalOption}
      onRequestClose={() => setShowModalOption(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "#00000060",
          justifyContent: "flex-end",
        }}
        onPress={() => setShowModalOption(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            height: "auto",
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 15,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
            onPress={() => {
              navigation.navigate("TicketDetailsScreen", {
                ticketUser_id: item.id,
              });

              setShowModalOption(false);
            }}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#F2F2F2",
                borderRadius: 10,
              }}
            >
              <Ionicons name="document" size={25} color="#0F3D87" />
            </View>
            <Text style={{ fontWeight: "700", paddingLeft: 10 }}>
              {translation.t("SeeDetails")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
            onPress={() => {
              setTicketData({ ...item });
              setShowModal(true);
              setShowModalOption(false);
            }}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#F2F2F2",
                borderRadius: 10,
              }}
            >
              <Ionicons name="person" size={25} color="#0F3D87" />
            </View>
            <Text style={{ fontWeight: "700", paddingLeft: 10 }}>
              {translation.t("Transfer")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
            onPress={() => {
              setShowModalOption(false);
            }}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: "#F2F2F2",
                borderRadius: 10,
              }}
            >
              <Ionicons name="close" size={25} color="red" />
            </View>
            <Text style={{ fontWeight: "700", paddingLeft: 10 }}>
              {translation.t("Cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function TicketCard({
  item,
  setShowModalOption,
  setItemData,
  translation,
}: any) {
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        setShowModalOption(true);
        setItemData(item);
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "10%",
        }}
      >
        <Image
          source={require("../../assets/images/multipleTickets.png")}
          style={{ height: 60, width: 60, resizeMode: "contain" }}
        />
      </View>
      <View
        style={{
          width: "80%",
          paddingLeft: 15,
          borderLeftColor: "gray",
          borderLeftWidth: 1,
        }}
      >
        <View style={{ gap: 4 }}>
          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>{translation.t("Event")}:</Text>
            <Text style={styles.productName}>{item.event_name}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>
              {translation.t("Category")}:
            </Text>
            <Text style={styles.productName}>{item.ticketCategory_name}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>
              {translation.t("TicketsAmount")}:
            </Text>
            <Text style={styles.productName}>{item.amount}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>Precio:</Text>
            <Text style={styles.productName}>
              {formatter(item.tickets_price)}
            </Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>
              {translation.t("Transferred")}:
            </Text>
            <Text style={styles.productName}>
              {item.isTransferred ? "SI" : "NO"}
            </Text>
          </View>

          {item?.isTransferred == true && (
            <View style={styles.productDataContainer}>
              <Text style={styles.productTitle}>
                {translation.t("AmountTransferred")}:
              </Text>
              <Text style={styles.productName}>{item.amountTrappased}</Text>
            </View>
          )}

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>Fecha evento:</Text>
            <Text style={styles.productName}>
              {moment(item.event_dateInit).format("YYYY-MM-DD")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
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
  circle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    position: "absolute",
  },
  productDataContainer: {
    flexDirection: "row",
    gap: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
    flexShrink: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
