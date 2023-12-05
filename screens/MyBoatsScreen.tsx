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
import AdsScreen from "./AdsScreen";

export default function MyBoats({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [boats, setBoats] = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);
  const [fetching, setFetching]: any = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
	  checkStorage("USER_LOGGED", async (id: any) => {
		setUserId(id);
		setShowLoading(true)
      const url = `/boatsRecords/geatBoatRecordByUser/${id}`;
	  hideLoadingModal(() => {
		fetchData(url).then((res) => {
			setBoats(res.boatsRecord);
		});
	  })
    });
  }, []);

  const getBoatRecordByUser = async () => {
    const url = `/boatsRecords/geatBoatRecordByUser/${userId}`;
    fetchData(url).then((res) => {
      setBoats(res.boatsRecord);
    });
  };

  const redirectToRecordBoats = (id: any) => {
    navigation.navigate("RecordBoats", {id: id, editMode: false, boats: [{}]});
	console.log(id)
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  return (
    <Container>
      <HeaderComponent />
      <Loading showLoading={showLoading} translation={translation} />

      <View style={{ height: "100%" }}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-around" }}
          refreshing={fetching}
          data={boats}
          onRefresh={getBoatRecordByUser}
          style={styles.body}
		  ListHeaderComponent={
			<View style={{justifyContent: "center", alignItems: "flex-end", width: "100%"}}>
			<TouchableOpacity
                style={styles.redirectButton}
                onPress={() => {
					redirectToRecordBoats(userId);
                }}
              >
                <Text style={styles.buttonText}>
                  +
                </Text>
              </TouchableOpacity>
			  </View>
		  }
          renderItem={({ item, index }: any) => (
            <TouchableOpacity
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                width: "35%",
              }}
              onPress={() => navigation.navigate("RecordBoats", {id: userId, editMode: true, boats: boats.map((value) => value).filter((e: any) => e.id === item.id)})}
              key={item.id}
            >
              <View style={{ height: 80, width: 80, marginBottom: 10 }}>
                <Image
                  source={{ uri: item.img ? item.img : null }}
                  style={{ flex: 1, resizeMode: "contain" }}
                />
              </View>
              <Text style={styles.categoryName}>{item.boat_name}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
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
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },
  redirectButton: {
    width: "20%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
