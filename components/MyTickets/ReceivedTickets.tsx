import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatter, hideLoadingModal } from "../../utils";
import { fetchData } from "../../httpRequests";

export default function ReceivedTicket({
  navigation,
  route,
  translation,
  setShowCodeModal,
  userId,
  setShowLoading,
  tickets,
  getTicketUser,
}: any) {
  const [fetching, setFetching]: any = useState(false);

  useEffect(() => {
    setShowLoading(true);
    setFetching(true);

    hideLoadingModal(() => {
      getTicketUser(userId);
      setFetching(false);
    }, setShowLoading);
  }, []);

  return (
    <View style={{ height: "70%", marginBottom: 0 }}>
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
          renderItem={({ item }: any) => <TicketCard item={item} />}
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
            There is not tickets
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
            gap: 25,
          }}
        >
          <Text>{item.tickets_serialNumber}</Text>

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

          <Text style={styles.productTitle}>
            Ticket send by: {item.user_name}
          </Text>
        </View>

        <Image
          source={{ uri: item.tickets_barCode }}
          style={{ resizeMode: "cover", height: 30, width: "100%" }}
        />
      </View>

      <View style={{ ...styles.circle, top: "35%", left: -20 }} />
      <View style={{ ...styles.circle, top: "35%", right: -20 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
