import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Loading, checkStorage } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";
import { sendData } from "../httpRequests";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
// import GoMap from "./GoMap";
import { AddressCard } from "../components/AddressCard";

interface Address {
  id: number;
  user_id: number;
  phone: string;
  alias: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_Code: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
  default?: boolean;
  latitude: number;
  longitude: number;
}

export default function AddressesScreen({ navigation, direction }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [addresses, setAddresses]: any = useState([]);
  const [isFetching, setIsFetching]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      fetchAddresses();
    });
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    checkStorage("USER_LOGGED", (userId: any) => {
      const url = "/user/getClientDirection";
      const data = {
        user_id: userId,
      };
      sendData(url, data).then((response: any) => {
        if (response.ok) {
          const addressesDirection = response["clientDirection"];
          const url = `/user/getUserById/${userId}`;
          sendData(url, {}).then((response: any) => {
            const user = response["user"];
            // console.log(user.client_direction_id, "kkkkkk")
            // direction(user.client_direction_id)
            const defaultAddress = addressesDirection.find(
              (address: any) => address.id == user.client_direction_id
            );
            if (defaultAddress) {
              defaultAddress.default = true;
              // if (setAddress) setAddress(defaultAddress);
            }
            setAddresses(addressesDirection);
          });
        } else {
          // if (setAddress) setAddress({});
          setAddresses([]);
        }
      });
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  const setDefaultAddress = (item: any) => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (userId: any) => {
      const url = `/user/getUserById/${userId}`;
      sendData(url, {}).then((response: any) => {
        hideLoadingModal(() => {
          const user = response["user"];
          const url = "/user/updateCliente";
          if (item.id != user.client_direction_id) {
            const data = {
              user_id: user.id,
              client_direction_id: item.id,
            };
            // console.log(data.client_direction_id, "data jajaja")
            direction(data.client_direction_id);
            sendData(url, data).then((response: any) => {
              fetchAddresses();
              // if (setAddress) setAddress(item);
            });
          }
        });
      });
    });
  };

  const deleteAddress = (id: any) => {
    Alert.alert(
      translation.t("alertWarningTitle"),
      translation.t("addressRemoveItemText"), // Do you want to delete this address?
      [
        {
          text: "Yes",
          onPress: () => {
            setShowLoading(true);
            checkStorage("USER_LOGGED", (userId: any) => {
              const url = "/user/deleteClientDirection";
              const data = {
                id: id,
                user_id: userId,
              };
              sendData(url, data).then((response: any) => {
                hideLoadingModal(() => {
                  fetchAddresses();
                });
              });
            });
          },
        },
        {
          text: translation.t("alertButtonNoText"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Loading showLoading={showLoading} translation={translation} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16 }}>
            {translation.t("addressSelectTitle") /* Select Delivery Address */}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.productCard}
          onPress={() => navigation.navigate("NewAddress")}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, marginBottom: 15 }}>
              {translation.t("addressNewTitle") /* Add new address */}
            </Text>
            <Pressable
              style={{
                backgroundColor: "#5f7ceb",
                width: 35,
                borderRadius: 5,
                height: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("NewAddress")}
            >
              <AntDesign name="plus" size={18} style={{ color: "#fff" }} />
            </Pressable>
          </View>
        </TouchableOpacity>

        <FlatList
          data={addresses}
          refreshing={isFetching}
          style={{ height: "90%" }}
          renderItem={({ item }: any) => (
            <AddressCard
              item={item}
              setDefaultAddress={setDefaultAddress}
              deleteAddress={deleteAddress}
              navigation={navigation}
              translation={translation}
            />
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  body: {
    // marginHorizontal: 20,
    // marginVertical: 30,
    height:'100%',
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  productCard: {
    paddingVertical: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
  },
});
