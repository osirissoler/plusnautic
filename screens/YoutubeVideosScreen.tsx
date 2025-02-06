import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Container, Loading } from "../components/Shared";
import { LanguageContext } from "../LanguageContext";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchData } from "../httpRequests";
import { Dimensions } from "react-native";
import { hideLoadingModal } from "../utils";

interface youtubeVideos {
  _id?: string;
  title: string;
  description: string;
  link: string;
}

export default function YoutubeVideosScreen({ navigation, route }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [videos, setVideos] = useState<youtubeVideos[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [selectedVideo, setSelectedVideo] = useState<youtubeVideos | null>(
    null
  );

  useEffect(() => {
    getYoutubeVideosActivated();
  }, []);

  useEffect(() => {
    if (skip !== -1) {
      getYoutubeVideosActivated();
    }
  }, [skip]);

  const getYoutubeVideosActivated = async () => {
    // setFetching(true);
    // setShowLoading(true);
    // const url = `/youtubeVideos/getYoutubeVideosActivated/${limit}/${skip}`;
    // fetchData(url).then((response) => {
    //   if (response.ok) {
    //     hideLoadingModal(() => {
    //       setVideos((prev) => [...response.youtubeVideos, ...prev]);
    //       setSelectedVideo(response.youtubeVideos[0]);
    //     }, setFetching);
    //   } else {
    //     setFetching(false);
    //   }
    // });

    const videosArray = [
      {
        _id: "1",
        title: "Erwin Miyasaka y los botes de pesca deportiva más populares",
        description:
          "Uno de los elementos más importantes de la pesca es el bote en el que se hace...",
        link: "OOVAbdcmzD8",
      },
      {
        _id: "2",
        title: "Yate Nautilius. 50 pies, capacidad 20 personas.",
        description:
          "Con sus 50' para 18 personas, camarotes amplios, baños completos y excelente atención...",
        link: "esEG7x4WQaw",
      },
      {
        _id: "3",
        title: "Los Yates de Miami Boat Show con ‪@daniclos‬ // Ricky Boada",
        description:
          "Aqui salimos un rato para que vean como son los shows de yates en Miami. ",
        link: "ORWhpZbxIQM",
      },
    ];

    setVideos(videosArray);
    setSelectedVideo(videosArray[0]);
  };

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  const height = (Dimensions.get("window").width / 16) * 9;

  return (
    <Container style={{ height: "100%", backgroundColor: "white" }}>
      {/* <Loading showLoading={showLoading} translation={translation} /> */}

      <View
        style={{
          backgroundColor: "grey",
          justifyContent: "center",
        }}
      >
        {showLoading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ position: "absolute", right: "45%" }}
          />
        )}
        <YoutubePlayer
          height={height}
          play={playing}
          videoId={selectedVideo?.link}
          onChangeState={onStateChange}
          onReady={() => setShowLoading(false)}
        />
      </View>

      <View style={{ height: "70%" }}>
        <FlatList
          // columnWrapperStyle={{ justifyContent: "space-around" }}
          refreshing={fetching}
          data={videos}
          onRefresh={() => {
            setFetching(true);
            setVideos([]);
            setTimeout(async () => {
              await setSkip(-1);
              await setSkip(0);
            }, 100);
          }}
          onEndReached={() => {
            if (!fetching && videos.length > 3) {
              setSkip(skip + limit);
            }
          }}
          ListHeaderComponent={
            <View style={{ marginVertical: 15 }}>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>Videos</Text>
            </View>
          }
          style={styles.body}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({
            item,
            index,
          }: {
            item: youtubeVideos;
            index: number;
          }) => (
            <VideosCard
              item={item}
              key={index}
              setSelectedVideo={setSelectedVideo}
              setPlaying={setPlaying}
              height={height}
            />
          )}
          ListFooterComponent={() =>
            videos.length > 3 && fetching == false ? (
              <ActivityIndicator size="small" color="#0F3D87" />
            ) : null
          }
          numColumns={1}
        ></FlatList>
      </View>
    </Container>
  );
}

const VideosCard = ({
  item,
  setSelectedVideo,
  setPlaying,
  height,
}: {
  item: youtubeVideos;
  setSelectedVideo: Function;
  setPlaying: Function;
  height: number;
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${item.link}/hqdefault.jpg`;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        setSelectedVideo(item);
        setPlaying(true);
      }}
    >
      <View style={{ justifyContent: "center", width: "50%" }}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
          resizeMode="cover"
        />
      </View>
      <View style={{ width: "50%", paddingRight: 10 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  body: {
    height: "92%",
    padding: 10,
    flexDirection: "column",
  },
  cardContainer: {
    // borderColor: "#8B8B9720",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0, // Ajusta la altura para ver mejor la sombra
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5, // Asegura que esta propiedad esté presente para Android
    height: 140,
    overflow: "visible", // Cambia de "hidden" a "visible" o elimínala
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingRight: 10,
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  description: {
    fontSize: 13,
    color: "grey",
  },
});
