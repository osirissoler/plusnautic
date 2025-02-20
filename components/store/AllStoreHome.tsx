import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { LanguageContext } from "../../LanguageContext";
import { checkStorage, Loading } from "../Shared";
import { fetchData } from "../../httpRequests";
// import Skeleton from "react-native-reanimated-skeleton";

export default function AllStoreHome({ navigation, router }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [store, setStore]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const defaultProductImg = "https://totalcomp.com/images/no-image.jpeg";

  useEffect(() => {
    getAllStore();
  }, []);

  const getAllStore = async () => {
    checkStorage("USER_LOGGED_COUNTRY", async (id: any) => {
      const url = `/store/getAllStoreByContry/${id}`;
      await fetchData(url).then(async (response) => {
        if (response.ok) {
          setStore(response.store);
        } else {
          setStore([]);
        }
      });
      setLoading(false);
    });
  };
  return (
    <View style={{ backgroundColor: "white" }}>
      <FlatList
        horizontal
        pagingEnabled
        data={store}
        onRefresh={() => {
          getAllStore();
        }}
        refreshing={fetching}
        // ListEmptyComponent={
        //   <>
        //     {!loading && (
        //       <Text style={{ fontSize: 16, marginTop: 20 }}>
        //         {translation.t("homeNoProductsText")}
        //       </Text>
        //     )}
        //   </>
        // }
        contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10, gap: 10 }}
        renderItem={({ item }) => (
          <View style={{ alignItems: "center", gap: 5 }}>
            <TouchableOpacity
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ProductStoreScreen", { item })
              }
            >
              <View style={{ width: "100%", height: "100%", borderWidth: 0 }}>
                <Image
                  source={{
                    uri: item.img ? item.img : defaultProductImg,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </TouchableOpacity>

            <Text numberOfLines={1} style={styles.productTitle}>
              {item.name}
            </Text>
          </View>
        )}
      ></FlatList>

      {/* <Skeleton
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
        isLoading={loading}
        layout={[
          { key: "1", width: 160, height: 80, borderRadius: 10 },
          { key: "2", width: 160, height: 80, borderRadius: 10 },
          { key: "3", width: 160, height: 80, borderRadius: 10 },
          { key: "4", width: 160, height: 80, borderRadius: 10 },
        ]}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: 160,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowRadius: 5,
    elevation: 1,
  },
  productImage: {
    // height: 100,
    // width: 100,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
    width: "90%",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  productAdd: {
    backgroundColor: "#60941A",
    padding: 4,
    borderRadius: 100,
  },
  productAddIcon: {
    color: "white",
    fontSize: 20,
  },
  formInputIcon: {
    position: "relative",
    flexDirection: "row",
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingRight: 40,
    paddingLeft: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  inputIcon: {
    position: "absolute",
    right: 15,
    top: "35%",
    zIndex: 2,
  },
  screenOptions: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    position: "absolute",
    flexDirection: "row",
  },
  optionIcon: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "relative",
    // backgroundColor: '#F7F7F7',
  },
  ticketsContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    borderRadius: 100,
    backgroundColor: "#5f7ceb",
    paddingVertical: 3,
    paddingHorizontal: 7,
    minWidth: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketsAmount: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
