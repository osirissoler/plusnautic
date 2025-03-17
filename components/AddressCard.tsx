import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import GoMap from "../screens/GoMap";

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
  latitude: string;
  longitude: string;
}

type SetDefaultAddressFunction = (item: Address) => void;
type DeleteAddressFunction = (id: number) => void;
type TranslationObject = {
  t: (key: string) => string;
};

interface AddressCardProps {
  item: Address;
  setDefaultAddress: SetDefaultAddressFunction;
  deleteAddress: DeleteAddressFunction;
  navigation: any;
  translation: TranslationObject;
}

export const AddressCard = ({
  item,
  setDefaultAddress,
  deleteAddress,
  navigation,
  translation,
}: AddressCardProps) => {
  return (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.productCard,
        item.default == true
          ? {
              borderColor: "#5f7ceb",
              borderWidth: 1,
              backgroundColor: "#eaeefc",
            }
          : { borderColor: "rgba(0, 0, 0, 0.1)" },
      ]}
      onPress={() => setDefaultAddress(item)}
    >
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          right: 10,
          top: 6,
          alignItems: "center",
        }}
      >
        {item.default && (
          <Text style={{ fontSize: 14, marginRight: 5 }}>
            {translation.t("selectDefaultText")}
          </Text>
        )}
        <FontAwesome
          style={{ marginHorizontal: 8, padding: 3 }}
          name="pencil-square-o"
          size={20}
          onPress={() => navigation.navigate("NewAddress", { address: item })}
        />
        <FontAwesome
          name="trash-o"
          style={{ padding: 3 }}
          size={20}
          onPress={() => deleteAddress(item.id)}
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            maxWidth: "60%",
            paddingRight: 20,
          }}
        >
          <Pressable
            onPress={() => setDefaultAddress(item)}
            style={[
              {
                borderColor: "rgba(0, 0, 0, 0.2)",
                height: 15,
                width: 15,
                borderRadius: 100,
              },
              item.default == true
                ? { backgroundColor: "#5f7ceb" }
                : { backgroundColor: "#fff", borderWidth: 1 },
            ]}
          ></Pressable>
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text
              style={{
                textAlign: "left",
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              {item.alias}
            </Text>
            <Text
              style={{
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0, 0, 0, 0.4)",
                fontSize: 15,
                marginTop: 3,
              }}
            >
              {item.phone}
            </Text>
            <Text
              style={{
                textAlign: "left",
                fontWeight: "500",
                color: "rgba(0, 0, 0, 0.4)",
                fontSize: 15,
              }}
            >
              {item.address_1}
            </Text>
            {!!item.address_2 && (
              <Text
                style={{
                  textAlign: "left",
                  fontWeight: "500",
                  color: "rgba(0, 0, 0, 0.4)",
                  fontSize: 15,
                }}
              >
                {item.address_2}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={{ width: "40%", height: 90, borderRadius: 10 }}
        >
          <GoMap
            latitude={parseFloat(item.latitude)}
            longitude={parseFloat(item.longitude)}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
