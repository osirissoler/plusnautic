import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const HomeArticleCard = ({ article, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      style={{
        marginRight: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <Image
        source={{ uri: article.img }}
        style={{ width: 100, height: 100, borderRadius: 10 }}
      />

      <View>
        <Text
          numberOfLines={2}
          style={{
            marginTop: 5,
            fontWeight: "bold",
            maxWidth: 100,
            fontSize: 13,
          }}
        >
          {article.title}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{ fontSize: 12, color: "#555", maxWidth: 100 }}
        >
          {article.descriptionPromo}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
