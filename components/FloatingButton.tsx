import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated, Image, Linking, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

const FloatingButton = () => {
  const [icon_1] = useState(new Animated.Value(0));
  const [icon_2] = useState(new Animated.Value(0));
  const [icon_3] = useState(new Animated.Value(0));
  const [pop, setPop] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.parallel([
      Animated.timing(icon_1, {
        toValue: -60,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_2, {
        toValue: -120,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_3, {
        toValue: -180,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const popOut = () => {
    setPop(false);
    Animated.parallel([
      Animated.timing(icon_1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_2, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_3, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

    const supportedURL = "https://abordo.page.link/abordoapp";
    const goAbordo = async () => {
      const supported = await Linking.canOpenURL(supportedURL);
      if (supported) {
        await Linking.openURL(supportedURL);
      } else {
        Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
      }
    };

  return (
    <View>
      <Animated.View style={[styles.circle, { bottom: icon_1 }]}>
        <TouchableOpacity onPress={goAbordo}>
          {/* <Icon name="cloud-upload" size={25} color="#FFFF" /> */}
          <Image
            source={require("../assets/images/abordo.png")}
            style={{ height: 60, width: 60 }}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { bottom: icon_2 }]}>
        <TouchableOpacity onPress={goAbordo}>
          <Icon name="shopping-bag" size={25} color="#5f7ceb" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { bottom: icon_3 }]}>
        <TouchableOpacity
          onPress={() => {
            console.log("Hola");
          }}
        >
          <Icon name="headset" size={25} color="#5f7ceb" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.mainCircle}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  mainCircle: {
    backgroundColor: "#5f7ceb",
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#fff",
    width: 45,
    height: 45,
    position: "absolute",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
});
