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
import Timeline from "react-native-timeline-flatlist";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../../httpRequests";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { formatter } from "../../utils";

export default function OrderDetails({ navigation, route }: any) {
  const [showLoading, setShowLoading]: any = useState(false);
  const [orderDetails, setOrderDetails]: any = useState([]);
  const [history, setHistory]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const [item, setItem]: any = useState(route.params.item);
  const [order, setOrder]: any = useState([
    { time: "09:00", title: "Event 1" },
    { time: "10:45", title: "Event 2", description: "Event 2 Description" },
    { time: "12:00", title: "Event 3", description: "Event 3 Description" },
    { time: "14:00", title: "Event 4", description: "Event 4 Description" },
    { time: "16:30", title: "Event 5", description: "Event 5 Description" },
  ]);

  useEffect(() => {
    getSubOrdersDetails();
    getHistoryOrders();
  }, []);

  const getSubOrdersDetails = () => {
    setShowLoading(true);
    const url = `/store/getSubOrdersDetails/${route.params.item.id}`;
    fetchData(url).then((response: any) => {
      if (response.ok) {
        setOrderDetails(response.orders);
      } else {
        setOrderDetails([]);
      }
    });
    setTimeout(() => {
      setShowLoading(false);
    }, 1000);
  };

  const getHistoryOrders = () => {
    const url = `/store/getHistoryOrders/${233}/${route.params.item.id}`;
    fetchData(url).then((response: any) => {
      if (response.ok) {
        setHistory(response.history);
        console.log(response.history)
      } else {
        setHistory([]);
      }
    });
  };

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
    >
      <View style={{ maxHeight: "60%", borderWidth: 0 }}>
        <FlatList
          extraData={orderDetails}
          style={{ height: "50%" }}
          refreshing={fetching}
          onRefresh={() => {
            getSubOrdersDetails();
          }}
          data={orderDetails}
          renderItem={({ item, index }: any) => (
            <View style={styles.productCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ width: "50%", borderWidth: 0, alignItems: "center" }}
                >
                  <View style={{ height: 100, width: 100, borderWidth: 0 }}>
                    <Image
                      source={{
                        uri: item.img
                          ? item.img
                          : "https://back.tiendainval.com/backend/admin/backend/web/archivosDelCliente/items/images/20210108100138no_image_product.png",
                      }}
                      style={{ flex: 1, resizeMode: "contain" }}
                    />
                  </View>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {item.StoreProducts_name}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      Cantidad:{" "}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      {item.amount}
                    </Text>
                  </View>

                  <Text
                    style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}
                    >
                      precio:{" "}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      {item.price}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      </View>
      <View style={{ width: "100%", marginTop: 10, maxHeight:'18%', borderWidth:0 }}>
        <View style={styles.cartPrices}>
          <Text>Sub Total</Text>
          <Text style={styles.cartPrice}>{formatter(item.amount)}</Text>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text>IVU Estatal</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>{formatter(item.stateTax)}</Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text>IVU Municipal</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>{formatter(item.municipalTax)}</Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text>Costo de Transaccion</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>
              {formatter(item.transationFee)}
            </Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text>Costo por Envio</Text>
          </View>
          <View>
            <Text style={styles.cartPrice}>
              {formatter(item.shippingPrice)}
            </Text>
          </View>
        </View>
        <View style={styles.cartPrices}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Total</Text>
          </View>
          <View>
            <Text style={{ ...styles.cartPrice, fontWeight: "bold" }}>
              {formatter(item.total)}
            </Text>
          </View>
        </View>
      </View>
      {(history.length > 0) &&<View style={{marginTop:15, borderWidth:0, width:'100%', height:'50%'}}> 
        <Timeline
          data={history}
          circleSize={25}
          lineColor="red"
          // isUsingFlatlist={true}
          // innerCircle={"icon"}
          // timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
          // timeStyle={{
          //   textAlign: "center",
          //   backgroundColor: "#ff9797",
          //   color: "white",
          //   padding: 5,
          //   borderRadius: 13,
          // }}
          showTime={false}
        />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    padding: 13,
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "column",
    justifyContent: "space-around",
    position: "relative",
  },
  cartPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  cartPrice: {
    textAlign: "right",
  },
});
