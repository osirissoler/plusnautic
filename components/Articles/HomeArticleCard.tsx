import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Articles } from "../../types/Articles";

interface props {
  article: Articles;
  onPress: (item: Articles) => void;
}

export const HomeArticleCard = ({ article, onPress }: props) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(article)}
      style={{
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height: 170,
        width: 140,
      }}
    >
      <Image
        source={{ uri: article.img }}
        style={{ width: "100%", height: "60%", borderRadius: 10 }}
      />

      <View>
        <Text
          numberOfLines={2}
          style={{
            marginTop: 5,
            fontWeight: "bold",
            maxWidth: 100,
            fontSize: 14,
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
