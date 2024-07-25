import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

interface GoMapProps {
  latitude: number;
  longitude: number;
}

const GoMap = ({ latitude, longitude }: GoMapProps) => {
  const [markerPosition, setMarkerPosition] = useState({ latitude, longitude });
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    // getLocation();
  }, [latitude, longitude]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    setLocationPermission(true);
    let location = await Location.getCurrentPositionAsync({});
    let address = await Location.reverseGeocodeAsync(location.coords);
    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  if (!latitude || !longitude) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No location</Text>
      </View>
    );
  }

  return (
    <View style={{ borderWidth: 0, borderRadius: 10 }}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          pinColor="#FF4E02"
          draggable={false}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default GoMap;
