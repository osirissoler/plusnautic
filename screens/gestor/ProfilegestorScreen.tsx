import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import asyncStorage from "@react-native-async-storage/async-storage";
import { fetchData, sendData } from "../../httpRequests";
import { Ionicons } from "@expo/vector-icons";
import { formatter, formatter2 } from "../../utils";
import { LanguageContext } from "../../LanguageContext";
import { checkStorage, Loading } from "../../components/Shared";
import { Rating } from "react-native-elements";
import Comment from "./Comment";
import SendReview from "./Review";

export default function ProfilegestorScreen({ navigation, route }: any) {
  const [items, setItems]: any = useState(route.params);
  const { translation } = React.useContext(LanguageContext);
  const [fetching, setFetching]: any = useState(false);
  const [punctuation, setPunctuation]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getReviewsByspecialist();
  }, []);

  const getReviewsByspecialist = async () => {
    setShowLoading(true);
    setFetching(true);
    let url = `/ratings/getRatingsByDriver/${items.id}`;
    let urlUser = `/ratings/getRatingsByUser/${items.id}`;

    await fetchData(items.GetByDriver ? url : urlUser).then((response) => {
      if (response.ok) {
        hideLoadingModal(() => {
          setComments(response.ratings);
          setPunctuation(response.punctuation);
        });
      } else {
        hideLoadingModal(() => {
          console.log("false");
        });
      }
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      setFetching(false);
      callback();
    }, 500);
  };
  const reload = () => {
    getReviewsByspecialist();
  };
  return (
    <View style={{ marginHorizontal: 0 }}>
      <Loading showLoading={showLoading} translation={translation} />
      <View
        style={{
          backgroundColor: "white",
          height: "25%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri:
              items.img == null || items.img == ""
                ? "https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png"
                : items.img,
          }}
          style={{ height: 100, width: 100, borderRadius: 100 }}
        />

        <Text style={{ fontWeight: "bold", fontSize: 19 }}>
          {items.name} {items.lastName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Rating imageSize={25} fractions={1} startingValue={punctuation} />
          <Text style={{ fontWeight: "bold" }}> {formatter2(punctuation)}</Text>
        </View>
        {items.GetByDriver && <SendReview id={items.id} reload={reload} />}
      </View>
      <View style={{ backgroundColor: "white", height: "75%" }}>
        {comments?.length != 0 ? (
          <FlatList
            refreshing={fetching}
            data={comments}
            onRefresh={getReviewsByspecialist}
            style={{}}
            renderItem={({ item }: any) => (
              <Component
                name={item.first_name}
                lastName={item.last_name}
                img={item.img}
                raiting={item.punctuation}
                date={item.date_elapsed}
                comments={item.review}
                punctuation={punctuation}
              />
            )}
            numColumns={1}
          ></FlatList>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text>No hay Reseñas del usuario</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function Component({
  name,
  lastName,
  punctuation,
  img,
  raiting,
  date,
  comments,
  navigation,
}: any) {
  return (
    <View
      style={{ backgroundColor: "white", marginTop: 3, paddingHorizontal: 10 }}
    >
      <View style={{ borderBottomWidth: 2, borderBottomColor: "#E5E4E2" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "15%" }}>
            <Image
              source={{
                uri:
                  img == null
                    ? "https://plus-nautic.nyc3.digitaloceanspaces.com/profile_avatar.png"
                    : img,
              }}
              style={{ height: 50, width: 50, borderRadius: 100 }}
            />
          </View>
          <View
            style={{
              width: "50%",
              alignSelf: "center",
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text style={{}}>
                {name} {lastName}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }} pointerEvents="none">
              <Rating imageSize={15} fractions={1} startingValue={raiting} />
              <Text style={{ marginLeft: 3, fontSize: 10, color: "gray" }}>
                {raiting}
              </Text>
            </View>
          </View>
          <View style={{ width: "35%", alignItems: "flex-end" }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                marginLeft: 5,
                marginRight: 5,
                textAlign: "justify",
                color: "gray",
              }}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {date}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 5, paddingBottom: 15 }}>
          <Comment lineNumber={3} text={comments} />
        </View>
      </View>
    </View>
  );
}
