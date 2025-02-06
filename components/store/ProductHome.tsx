import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  ScrollView,
} from "react-native";
import { fetchData } from "../../httpRequests";
import { formatter } from "../../utils";
// import { fetchData } from "../httpRequests";

export default function ProductHome({ navigation, text }: any) {
  const [ads, setAds]: any = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
  ]);

  useEffect(() => {
    getAds();
  }, []);

  const getAds = async () => {
    let url = `/store/getAllProductStoreAdmin/10/0 `;
    console.log(url);

    await fetchData(url).then((response) => {
      if (response.ok) {
        console.log(response.products[0], "aqui erssfsdfsdfsdfs");
        setAds(response.products);
      } else {
        console.log(response, "aqui error");
      }
    });
  };

  const [fetching, setFetching] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{text}</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Ver</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flexDirection: "row", marginBottom: 5 }}
      >
        {/* 1 */}

        <View style={styles.row}>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[0]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[0]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[0]?.price)}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[1]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[1]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[1]?.price)}
              </Text>
            </View>
          </View>
        </View>
        {/* 2 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[3]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[3]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[3]?.price)}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[4]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[4]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[4]?.price)}
              </Text>
            </View>
          </View>
        </View>
        {/* 3 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[5]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[5]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[5]?.price)}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[6]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[6]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[6]?.price)}
              </Text>
            </View>
          </View>
        </View>
        {/* 4 */}
        <View style={styles.row}>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[7]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[7]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[7]?.price)}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={{ height: "60%", borderWidth: 0 }}>
              <Image
                source={{
                  uri: ads[8]?.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ padding: 5 }}>
              <Text numberOfLines={1} style={{ fontWeight: 500, fontSize: 14 }}>
                {ads[8]?.name}
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                Costo de envio:USD
              </Text>
              <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
                {formatter(ads[8]?.price)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal:5,
    marginVertical:5
  },
  scrollView: {
    marginTop: 5,
  },
  row: {
    flexDirection: "column", // Alinea los elementos horizontalmente
    justifyContent: "space-between", // Espacio entre los elementos
    // marginRight: 10,
    // borderWidth: 1,
  },
  item: {
    // justifyContent: "center",
    // alignItems: "center",
    width: 140, // Define el ancho de cada item
    height: 140, // Define la altura de cada item
    backgroundColor: "white",
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#D7D9D7",
  },
  itemText: {
    fontSize: 18,
    color: "black",
  },
});
