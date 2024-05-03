import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";

import HeaderComponent from "../components/Header";
import { Container } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";

export default function QrCodeScreen({ navigation, route }: any) {
  const [qrCodeImg, setQrCodeImg] = useState(route.params.qrCode);
  const { translation } = React.useContext(LanguageContext);

  return (
    <Container>
      <HeaderComponent />
      <View
        style={{ alignItems: "center", marginBottom: 3, paddingHorizontal: 30 }}
      >
        <Text
          style={{
            alignItems: "center",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Codigo qr para escanear y ver los tickets comprados por el usuario.
        </Text>
      </View>

      <View style={styles.body}>
        <Image
          style={styles.qrCode}
          source={{
            uri: qrCodeImg ? qrCodeImg : null,
          }}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: "column",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {
    width: "60%",
    height: "60%",
  },
});
