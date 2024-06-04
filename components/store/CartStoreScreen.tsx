import React, { useState, useEffect, useRef } from "react";
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

export default function CartStoreScreen({ route }: any) {
  const { translation } = React.useContext(LanguageContext);
  
  return (
    <View>
      <Text>cart</Text>;
    </View>
  );
}
