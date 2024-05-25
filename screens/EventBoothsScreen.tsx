import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";

import { Container, Loading, checkStorage } from "../components/Shared";

import { LanguageContext } from "../LanguageContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { formatter, hideLoadingModal } from "../utils";
import { fetchData } from "../httpRequests";

export default function EventBoothsScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [boothsArr, setBoothsArr] = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [showModalOption, setShowModalOption]: any = useState(false);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    setShowLoading(true);

    hideLoadingModal(() => {
        getBoothsByBoatShow(route.params.id);
    }, setShowLoading);

    setTimeout(() => {
      setShowLoading(false);
    }, 100);
  }, []);

  const getBoothsByBoatShow = async (id: number) => {
    let url = `/booth/getBoothsByBoatShowPurchased/${id}`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        setBoothsArr(response.booths);
      }
    });
  };

  return (
    <Container>
      <View style={{ paddingHorizontal: 25 }}>
        <Loading showLoading={showLoading} translation={translation} />
        <OptionModal
          showModalOption={showModalOption}
          setShowModalOption={setShowModalOption}
          navigation={navigation}
          item={itemData}
          translation={translation}
        />

        <Text
          style={{
            fontSize: 23,
            fontWeight: "500",
            marginVertical: 10,
          }}
        >
          Puestos de ventas
        </Text>

        <Text
          style={{
            alignItems: "center",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15,
            marginBottom: 10,
          }}
        >
          En este apartado puedes ver tus espacios de ventas
        </Text>

        {boothsArr.length > 0 ? (
          <FlatList
            style={{
              paddingHorizontal: 15,
              backgroundColor: "#F2F2F2",
              height: "90%",
              paddingTop: 5,
              borderRadius: 10,
            }}
            // refreshing={isFetching}
            // onRefresh={onRefresh}
            data={boothsArr}
            renderItem={({ item, index }) => (
              <TicketCard
                key={index}
                item={item}
                setShowModalOption={setShowModalOption}
                setItemData={setItemData}
                translation={translation}
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
              height: "80%",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                color: "red",
              }}
            >
              There is not booths
            </Text>
            <Image
              source={require("../assets/images/puesto.png")}
              style={{ height: 80, width: 80 }}
            />
          </View>
        )}
      </View>
    </Container>
  );
}

function OptionModal({
  showModalOption,
  setShowModalOption,
  navigation,
  item,
  translation,
}: {
  showModalOption: boolean;
  setShowModalOption: Function;
  navigation: any;
  item: any;
  translation: any;
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
              navigation.navigate("BoothProductsScreen", {
                sponsorBooth_Sponsor_id: item.id,
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
              Ver productos
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
          source={require("../assets/images/puesto.png")}
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
            <Text style={styles.productTitle}>Nombre:</Text>
            <Text style={styles.productName}>{item.name}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productName}>{item.description}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>{translation.t("Event")}:</Text>
            <Text style={styles.productName}>{item.boatShow_name}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>Cantidad de productos:</Text>
            <Text style={styles.productName}>
              {item?.boothsProducts?.length}
            </Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>Fecha init:</Text>
            <Text style={styles.productName}>{item.dateInit}</Text>
          </View>

          <View style={styles.productDataContainer}>
            <Text style={styles.productTitle}>Fecha final:</Text>
            <Text style={styles.productName}>{item.dateFinal}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 10,
    flexDirection: "column",
    height: "20%",
  },

  productDataContainer: {
    flexDirection: "row",
    gap: 5,
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    paddingRight: 15,
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
