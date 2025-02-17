import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatter } from "../../utils";
import { Products } from "../../types/Products";
import { Ionicons } from "@expo/vector-icons";

interface props {
  item: Products;
  onPress: (item: Products) => void;
  isDiscounted?: boolean;
}

export const ProductCard = ({ item, onPress, isDiscounted }: props) => {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { justifyContent: isDiscounted ? "flex-start" : "space-between" },
      ]}
      onPress={() => onPress(item)}
    >
      <View style={{ height: "60%", borderWidth: 0 }}>
        {item.img ? (
          <Image
            source={{
              uri: item.img,
            }}
            style={{
              height: "100%",
              width: "100%",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              resizeMode: "contain",
            }}
          />
        ) : (
          <View
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons size={50} name="image" color={"#B2B5C1"} />
          </View>
        )}
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          marginBottom: !isDiscounted ? 0 : 5,
        }}
      >
        {isDiscounted ? (
          <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 13 }}>
            - {item.discountPercentage}%
          </Text>
        ) : (
          <Text numberOfLines={1} style={{ fontWeight: "bold", fontSize: 13 }}>
            {item.name}
          </Text>
        )}
        {isDiscounted ? (
          <>
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 500,
                fontSize: 13,
                marginTop: 5,
                color: "grey",
              }}
            >
              Antes: {formatter(item.price)}
            </Text>
            {/* <Text style={{ fontWeight: 500, color: "#B2B5C1", fontSize: 12 }}>
          Costo de envio:USD
        </Text> */}
            <Text
              numberOfLines={1}
              style={{ fontWeight: "bold", color: "#5f7ceb", fontSize: 13 }}
            >
              Ahora {formatter(item.totalPriceWithDiscount)}
            </Text>
          </>
        ) : (
          <View style={{ marginTop: 5 }}>
            {/* <Text
              style={{ fontWeight: "bold", color: "#5f7ceb", fontSize: 14 }}
            >
              {item.amount}
            </Text> */}
            <Text style={{ fontWeight: "bold", color: "grey", fontSize: 13 }}>
              {formatter(item.price)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column", // Alinea los elementos horizontalmente
    justifyContent: "space-between", // Espacio entre los elementos
    // marginRight: 10,
    // borderWidth: 1,
  },
  item: {
    borderRadius: 15,
    width: 140, // Define el ancho de cada item
    height: 170, // Define la altura de cada item
    backgroundColor: "white",
    marginHorizontal: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#D7D9D7",
    padding: 5,
  },
});
