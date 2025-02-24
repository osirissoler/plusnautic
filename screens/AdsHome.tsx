import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { fetchData } from "../httpRequests";
import SkeletonPlaceholder from "../components/SkeletonPlaceholder";
// import Skeleton from "react-native-reanimated-skeleton";

export default function AdsHome({ navigation, code }: any) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollIndex = useRef(0);

  useEffect(() => {
    setLoading(true);
    getAds();
  }, []);

  const getAds = async () => {
    let url = `/advertisements/getAdsBycode/${code}`;

    await fetchData(url).then((response) => {
      if (response.ok) {
        setAds(response.ads);
      } else {
        console.log(response, "aqui error");
      }
    });
    setLoading(false);
  };

  // Función para hacer scroll automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        scrollIndex.current =
          scrollIndex.current >= ads.length - 1 ? 0 : scrollIndex.current + 1;

        if (ads.length > 0) {
          flatListRef.current.scrollToIndex({
            index: scrollIndex.current,
            animated: true,
          });
        }
      }
    }, 7000); // Cambia cada 7 segundos

    return () => clearInterval(interval);
  }, [ads]);

  //   Función para manejar clics en anuncios
  const handleAdPress = async (url: string) => {
    if (url) {
      Alert.alert("Ir a la página", "¿Quieres ir a este enlace?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: () => {
            open(url);
          },
        },
      ]);
    }
  };

  const open = async (url: any) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supported}`);
    }
  };

  return (
    <View style={{ borderWidth: 0 }}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={ads}
        onRefresh={() => {}}
        refreshing={fetching}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 5 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleAdPress(item.website)}
            style={{
              backgroundColor: "white",
              height: 130,
              width: 366,
              borderRadius: 15,
            }}
          >
            <Image
              source={{ uri: item.img }}
              style={{ height: "100%", width: "100%", borderRadius: 15 }}
            />
          </TouchableOpacity>
        )}
      />

      <SkeletonPlaceholder
        isLoading={loading}
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          gap: 10,
          marginTop: 10,
        }}
        layout={[
          { key: "1", height: 130, width: 366, borderRadius: 15 },
          { key: "2", height: 130, width: 366, borderRadius: 15 },
        ]}
      />
    </View>
  );
}
