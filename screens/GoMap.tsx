import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Switch,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export default function GoMap({ latitude, longitude }: { latitude: Float; longitude: Float }) {
  const [MarkerPosition, setMarkerPosition] = useState({
    latitude,
    longitude,
  });

  useEffect(() => {
    // getLocation();
    setMarkerPosition({ latitude, longitude });
  }, [latitude, longitude]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    let address = await Location.reverseGeocodeAsync(location.coords);
    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  return (
    <View style={{ borderWidth: 0, borderRadius: 10 }}>
      <MapView
        style={{ ...styles.map }}
        region={{
          latitude: MarkerPosition.latitude,
          longitude: MarkerPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={MarkerPosition}
          pinColor="#FF4E02"
          draggable={false}
          //onDragEnd={onDragMarkerEnd}
        ></Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
