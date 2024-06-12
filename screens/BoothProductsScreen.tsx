import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Container, Loading } from "../components/Shared";
import HeaderComponent from "../components/Header";
import { fetchData, sendData, sendDataPut } from "../httpRequests";
import { checkStorage } from "../components/Shared";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { formatter } from "../utils";
import { AlertDialog } from "../components/AlertDialog";

export default function BoothProductsScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [boothProducts, setBoothProducts]: any = useState([]);
  const [isFetching, setIsFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [showAddProductModal, setShowAddProductModal]: any = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productData, setProductData] = useState({})

  useEffect(() => {
    getSponsorBoothProduct();
  }, []);

  const getSponsorBoothProduct = () => {
    const url = `/booth/getActiveSponsorBoothProduct/${route?.params?.sponsorBooth_Sponsor_id}`;
    fetchData(url).then((res: any) => {
      if (res.ok) {
        setBoothProducts(res.boothsProducts);
      } else {
        setBoothProducts([]);
      }
    });
  };

  return (
    <Container>
      <View style={{ paddingHorizontal: 15 }}>
        <Loading showLoading={showLoading} translation={translation} />

        <View style={{ height: "100%" }}>
          <HeaderComponent />

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                alignItems: "center",
                fontWeight: "600",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              {translation.t("ProductsBoothsMsg")}
            </Text>
          </View>

          <View style={styles.body}>
            {boothProducts?.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  height: "80%",
                }}
              >
                <View style={styles.imageParent}>
                  <Image
                    style={styles.image}
                    source={require("../assets/images/puesto.png")}
                  />
                </View>
                <Text style={styles.productCount}>
                  {translation.t("NoProductsMsg")}
                </Text>
              </View>
            ) : (
              <FlatList
                style={{
                  paddingHorizontal: 15,
                  backgroundColor: "#F2F2F2",
                  maxHeight: "75%",
                  paddingTop: 5,
                  borderRadius: 10,
                }}
                refreshing={isFetching}
                onRefresh={getSponsorBoothProduct}
                data={boothProducts}
                renderItem={({ item }) => (
                  <TicketCard
                    item={item}
                    setShowAddProductModal={setShowAddProductModal}
                    setEditMode={setEditMode}
                    setProductData={setProductData}
                    translation={translation}
                  />
                )}
              />
            )}
          </View>
        </View>
      </View>
    </Container>
  );
}

function TicketCard({ item, translation }: any) {
  return (
    <View style={styles.productCard}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          position: "relative",
        }}
      >
        <View style={styles.productImage}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{
                resizeMode: "cover",
                height: "100%",
                width: "100%",
                borderRadius: 10,
              }}
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              style={{
                resizeMode: "cover",
                height: "100%",
                width: "100%",
                borderRadius: 10,
              }}
            />
          )}
        </View>

        <View
          style={{
            justifyContent: "space-between",
            width: "70%",
            marginLeft: 25,
            marginRight: 10,
          }}
        >
          <View style={{ marginTop: 10, gap: 5 }}>
            <Text style={styles.productTitle}>{item.name}</Text>

            <Text style={{ fontSize: 16 }}>
              {translation.t("ProductAmount")}: {item.amount}
            </Text>
            <View
              style={{
                backgroundColor: item.isActive ? "green" : "red",
                padding: 5,
                width: "30%",
                borderRadius: 5,
              }}
            >
              <Text
                style={[
                  styles.productTitle,
                  {
                    color: "#fff",
                    textAlign: "center",
                  },
                ]}
              >
                {item.isActive
                  ? translation.t("Active")
                  : translation.t("Inactive")}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.productPrice}>{formatter(item.price)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: 20,
    backgroundColor: "#fff",
    height: "100%",
  },
  productCount: {
    fontSize: 20,
    marginBottom: 10,
    marginVertical: 20,
    color: "red",
  },
  imageParent: {
    height: 330,
  },
  image: {
    width: 300,
    height: 330,
  },
  productCard: {
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 10,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    position: "relative",
    backgroundColor: "#fff",
    // height: 120,
  },
  circle: {
    height: 45,
    width: 45,
    borderRadius: 100,
    backgroundColor: "#F2F2F2",
    position: "absolute",
  },
  productCardDelete: {
    color: "red",
    position: "absolute",
    right: 1,
    top: 0,
  },
  productCardEdit: {
    color: "#5f7ceb",
    position: "absolute",
    right: 35,
    top: 0,
  },
  productImage: {
    height: 120,
    width: "30%",
    borderWidth: 1,
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "justify",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
    flexShrink: 1,
  },
  productAdd: {
    borderRadius: 100,
    flexDirection: "row",
  },
  productAddIcon: {
    color: "#5f7ceb",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    borderRadius: 10,
    padding: 2,
  },
  cartPrices: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  cartPrice: {
    textAlign: "right",
  },
  buttonCheckout: {
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  buttonCheckoutText: {
    color: "#ffffff",
    fontSize: 18,
  },
  buttonGift: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0 , 0.3)",
    width: 190,
    justifyContent: "center",
    padding: 5,
    borderRadius: 12,
  },
});
