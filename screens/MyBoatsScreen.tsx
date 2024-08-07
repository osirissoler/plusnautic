import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { Cards, Container, Loading, checkStorage } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";
import { fetchData } from "../httpRequests";
import HeaderComponent from "../components/Header";

export default function MyBoats({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [boats, setBoats] = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [fetching, setFetching]: any = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
    checkStorage("USER_LOGGED", async (id: any) => {
      setUserId(id);
      setShowLoading(true);
      const url = `/boatsRecords/getBoatRecordByUser/${id}`;
      hideLoadingModal(() => {
        fetchData(url).then((res) => {
          setBoats(res.boatsRecord);
        });
      });
    });
  });
  }, []);

  const getBoatRecordByUser = async () => {
    const url = `/boatsRecords/getBoatRecordByUser/${userId}`;
    fetchData(url).then((res) => {
      setBoats(res.boatsRecord);
    });
  };

  const redirectToRecordBoats = (id: any) => {
    navigation.navigate("RecordBoats", {
      id: id,
      editMode: false,
      boats: [{}],
    });
    console.log(id);
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  return (
    <Container style={{ backgroundColor: "#fff" }}>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />
      <View style={{ alignItems: "center", marginBottom: 3 }}>
        <Text
          style={{
            alignItems: "center",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {translation.t("AddBoatsMsg")}
        </Text>
      </View>
      <View
        style={{
          marginVertical: 10,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={styles.redirectButton}
          onPress={() => {
            redirectToRecordBoats(userId);
          }}
        >
          <Text style={styles.buttonText}>{translation.t("add")}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: "85%", marginTop: 5 }}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-around" }}
          refreshing={fetching}
          data={boats}
          onRefresh={getBoatRecordByUser}
          style={styles.body}
          renderItem={({ item, index }: any) => (
            <TouchableOpacity
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                width: "35%",
              }}
              onPress={() =>
                navigation.navigate("RecordBoats", {
                  id: userId,
                  editMode: true,
                  boats: boats
                    .map((value) => value)
                    .find((e: any) => e.id === item.id),
                })
              }
              key={item.id}
            >
              <View
                style={{
                  height: 100,
                  width: 100,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{ uri: item.img ? item.img : null }}
                  style={{
                    flex: 1,
                    resizeMode: "cover",
                    borderRadius: 10,
                    borderWidth: 1.2,
                    borderColor: "#706b6b",
                  }}
                />
              </View>
              <Text style={styles.categoryName}>{item.boat_name}</Text>
            </TouchableOpacity>
          )}
          numColumns={3}
        ></FlatList>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  body: {
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  headerImage: {
    marginBottom: 20,
    height: 180,
    width: "100%",
    borderRadius: 10,
    // aspectRatio:1/1
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    textTransform: "uppercase"
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
});
