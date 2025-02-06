import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeArticleCard } from "./HomeArticleCard";
import { fetchData } from "../../httpRequests";

interface Articles {
  id: number;
  title: string;
  img: string;
  description: string;
  descriptionPromo: string;
  writer: string;
  created_at: string;
  elapsedTime: string;
  // isDeleted: boolean;
  // status: boolean;
}

interface ArticlesList {
  item: Articles;
  index: number;
  navigation?: any;
}

const articles = [
  {
    id: "1",
    title: "Artículo A",
    description: "Descripción del artículo A",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Artículo B",
    description: "Descripción del artículo B",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Artículo C",
    description: "Descripción del artículo C",
    image: "https://via.placeholder.com/150",
  },
];

export const ArticleList = ({ navigation }: any) => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [skip, setKip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [fetching, setFetching] = useState<boolean>(false);

  const handlePress = (article: any) => {
    navigation.navigate("NewsDetailsScreen", {
      news_id: article.id,
    });
    console.log("Artículo seleccionado:", article.title);
  };

  useEffect(() => {
    // setShowLoading(true);
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
      console.log(response);
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
    // setShowLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Articulos</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Ver todos</Text>
        </TouchableOpacity>
      </View>

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
            console.log("entro");
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
        contentContainerStyle={{ padding: 5, alignItems: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
