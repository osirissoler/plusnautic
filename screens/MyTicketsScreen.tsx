import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { checkStorage, Loading } from "../components/Shared";
import { fetchData } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";
import ReceivedTicket from "../components/MyTickets/ReceivedTickets";
import PurchasedTickets from "../components/MyTickets/PurchasedTickets";
import EnterTicketCodeModal from "../components/MyTickets/EnterTicketCodeModal";
import TransferredTicketModal from "../components/MyTickets/TransferredTicketModal";
import { hideLoadingModal } from "../utils";

export default function MyTicketsScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [userId, setUserId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [ticketData, setTicketData]: any = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [receivedTickets, setReceivedTickets] = useState([])

  const handleTabPress = (index: any) => {
    setActiveTab(index);
  };

  useEffect(() => {
    hideLoadingModal(() => {
      checkStorage("USER_LOGGED", async (id: any) => {
        setUserId(id);
      });
    }, setShowLoading);
  }, []);


  const getTicketUser = async (id: number) => {
    const url = `/tickets/getTicketsDetailsByUser/${id}`;
    await fetchData(url).then(async (response: any) => {
      console.log(response);
      if (response.ok) {
        setReceivedTickets(response.transferred);
      } else {
        setReceivedTickets([]);
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <Loading showLoading={showLoading} translation={translation} />

      <TransferredTicketModal
        setShowModal={setShowModal}
        showModal={showModal}
        translation={translation}
        ticketData={{
          ...ticketData,
          amount: ticketData.amount - ticketData.amountTrappased,
        }}
      />

      <EnterTicketCodeModal
        showLoading={showLoading}
        setShowLoading={setShowLoading}
        setShowModal={setShowCodeModal}
        showModal={showCodeModal}
        translation={translation}
        ticketData={ticketData}
        userId={userId}
        setActiveTab={setActiveTab}
        getTicketUser={getTicketUser}
      />

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            alignItems: "center",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15,
            marginTop: 10
          }}
        >
          {translation.t("MyTicketsScreenMsg")}
        </Text>
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
          onPress={() => setShowCodeModal(true)}
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
          <Text style={styles.tabText}>
            {translation.t("PurchasedTickets")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={styles.tabText}>{translation.t("ReceivedTickets")}</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 0 && (
        <PurchasedTickets
          navigation={navigation}
          setTicketData={setTicketData}
          translation={translation}
          userId={userId}
          setShowLoading={setShowLoading}
          setShowModal={setShowModal}
        />
      )}
      {activeTab === 1 && (
        <ReceivedTicket
          setShowCodeModal={setShowCodeModal}
          translation={translation}
          setShowLoading={setShowLoading}
          userId={userId}
          tickets={receivedTickets}
          setTickets={setReceivedTickets}
          getTicketUser={getTicketUser}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "500"
  },
});
