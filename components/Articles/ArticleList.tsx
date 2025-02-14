import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeArticleCard } from "./HomeArticleCard";
import { fetchData } from "../../httpRequests";
import { Articles } from "../../types/Articles";
import Skeleton from "react-native-reanimated-skeleton";

export const ArticleList = ({ navigation }: any) => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [skip, setKip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = (article: Articles) => {
    navigation.navigate("NewsDetailsScreen", {
      news_id: article.id,
    });
  };

  useEffect(() => {
    setLoading(true);
    getNews();
  }, []);

  useEffect(() => {
    if (skip !== -1) {
      getNews();
    }
  }, [skip]);

  const getNews = async () => {
    setFetching(true);
    const url = `/news/getNewsMobile/${skip}/${limit}`;
    await fetchData(url).then((response) => {
      if (response.ok) {
        // hideLoadingModal(() => {
        setArticles([...articles, ...response.news]);
        // }, setFetching);
      } else {
        setArticles([]);
        setFetching(false);
        // setError(true);
      }
    });
    setFetching(false);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {!loading && <View style={styles.titleContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ height: 45, width: 40 }}
            source={require("../../assets/images/abordo.png")}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Abordo</Text>
        </View>

        <TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Ver todos</Text>
        </TouchableOpacity>
      </View>}

      <FlatList
        refreshing={fetching}
        data={articles}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: Articles) => item.id.toString()}
        renderItem={({ item }) => (
          <HomeArticleCard article={item} onPress={handlePress} />
        )}
        onRefresh={() => {
          setFetching(true);
          setArticles([]);
          setTimeout(async () => {
            await setKip(-1);
            await setKip(0);
          }, 100);
        }}
        onEndReached={() => {
          if (!fetching && articles.length > 3) {
            setKip(skip + limit);
          }
        }}
        ListFooterComponent={() =>
          articles.length > 3 && fetching == false ? (
            <View style={{ alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0F3D87" />
            </View>
          ) : null
        }
        contentContainerStyle={{ alignItems: "center", gap: 10 }}
      />

      <Skeleton
        containerStyle={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          gap: 10,
        }}
        isLoading={loading}
        layout={[
          { key: "1", height: 20, width: 170, borderRadius: 15 },
          {
            key: "group", // Grupo para las tres cajas inferiores
            flexDirection: "row", // Hace que estén en fila
            gap: 10,
            children: [
              { key: "2", height: 170, width: 140, borderRadius: 15 },
              { key: "3", height: 170, width: 140, borderRadius: 15 },
              { key: "4", height: 170, width: 140, borderRadius: 15 },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
