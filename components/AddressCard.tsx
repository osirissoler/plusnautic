import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
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
  // Función para mostrar el menú de opciones
  const showOptions = () => {
    Alert.alert(
      translation.t("optionsTitle"), // Título del alert
      translation.t("optionsMessage"), // Mensaje opcional
      [
        {
          text: translation.t("setDefault"),
          onPress: () => setDefaultAddress(item),
        },
        {
          text: translation.t("edit"),
          onPress: () => navigation.navigate("NewAddress", { address: item }),
        },
        {
          text: translation.t("delete"),
          onPress: () => deleteAddress(item.id),
          style: "destructive",
        },
        {
          text: translation.t("cancel"),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.productCard,
        item.default
          ? {
              borderColor: "#5f7ceb",
              borderWidth: 1,
              backgroundColor: "#eaeefc",
            }
          : { borderColor: "rgba(0, 0, 0, 0.1)" },
      ]}
      onPress={showOptions} // Mostrar alert al presionar el card
    >
      <View style={styles.topRightIcons}>
        {item.default && (
          <Text style={styles.defaultText}>
            {translation.t("selectDefaultText")}
          </Text>
        )}
        {/* <FontAwesome
          style={styles.icon}
          name="pencil-square-o"
          size={20}
          onPress={() => navigation.navigate("NewAddress", { address: item })}
        />
        <FontAwesome
          name="trash-o"
          style={styles.icon}
          size={20}
          onPress={() => deleteAddress(item.id)}
        /> */}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.addressInfo}>
          <Pressable
            onPress={() => setDefaultAddress(item)}
            style={[
              styles.radioButton,
              item.default
                ? { backgroundColor: "#5f7ceb" }
                : { borderWidth: 1 },
            ]}
          />
          <View style={styles.textContainer}>
            <Text style={styles.aliasText}>{item.alias}</Text>
            <Text style={styles.secondaryText}>{item.phone}</Text>
            <Text style={styles.secondaryText}>{item.address_1}</Text>
            {!!item.address_2 && (
              <Text style={styles.secondaryText}>{item.address_2}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.mapContainer}>
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
  topRightIcons: {
    position: "absolute",
    flexDirection: "row",
    right: 10,
    top: 6,
    alignItems: "center",
  },
  defaultText: {
    fontSize: 14,
    marginRight: 5,
  },
  icon: {
    marginHorizontal: 8,
    padding: 3,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "60%",
    paddingRight: 20,
  },
  radioButton: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    height: 15,
    width: 15,
    borderRadius: 100,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  aliasText: {
    textAlign: "left",
    fontWeight: "500",
    fontSize: 16,
  },
  secondaryText: {
    textAlign: "left",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 15,
    marginTop: 3,
  },
  mapContainer: {
    width: "40%",
    height: 90,
    borderRadius: 10,
  },
});
