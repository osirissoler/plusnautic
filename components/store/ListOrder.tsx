import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Linking,
  Alert,
  Text,
  FlatList,
  Pressable,
  Modal,
} from "react-native";
import { LanguageContext } from "../../LanguageContext";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { AntDesign } from "@expo/vector-icons";
import { checkStorage } from "../Shared";

export default function ListOrder({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [order, setOrder]: any = useState([{}, {}, {}, {}, {}]);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";
  const [user_id, setUser_id]: any = useState(null);

  useEffect(() => getSubOrdersByUserId(), []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getSubOrdersByUserId();
    });
  }, []);

  const getSubOrdersByUserId = () => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (id: any) => {
      setUser_id(id);
      const url = `/store/getSubOrdersByUserId/${id}`;
      fetchData(url).then((response: any) => {
        if (response.ok) {
          setOrder(response.orders);
        } else {
          setOrder([]);
        }
      });
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white" }}>
      <View style={{ borderWidth: 0, height: "90%", marginEnd: 10 }}>
        <FlatList
          data={order}
          refreshing={fetching}
          onRefresh={() => {}}
          onEndReachedThreshold={0}
          style={{ padding: 20, flexDirection: "column" }}
          renderItem={({ item }) => (
            <Pressable style={styles.productCard} onPress={() =>
                navigation.navigate("OrderDetails", { item })
              }>
              <View style={{ height: 100, width: 100 }}>
                <Image
                  source={{
                    uri: item.img ? item.img : defaultProductImg,
                  }}
                  style={{ flex: 1, resizeMode: "contain" }}
                />
              </View>
              <View style={{ justifyContent: "space-between", width: 160 }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {item.store_name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.status_name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.total}</Text>
                </View>
              </View>
            </Pressable>
          )}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    padding: 20,
    marginVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
