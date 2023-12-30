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

export default function ProfilegestorScreen({ navigation, route }: any) {
  const [items, setItems]: any = useState(route.params);
  console.log(items);
  const [fetching, setFetching]: any = useState(false);
  const [punctuation, setPunctuation]: any = useState(false);
  const [comments, setComments] = useState([
    {
      name: "osiris Soler Ramirez",
      img: "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/341996147_718964956592860_7697224133555462430_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHqxPm8JLyZaupGIhAtiZEWSTFsiUx7NbFJMWyJTHs1sfACYsn-cZ72wY9Rd7LROBGYi-sruJ_piNI6LsYSk2AB&_nc_ohc=UH1BzOUOdSIAX96E6RP&_nc_ht=scontent.fhex4-1.fna&oh=00_AfDUuhjZU8fS5PDsaWhC_Kq4wf939hiON-vP3BARlAUeAg&oe=6593EAA8",
      raiting: 3.5,
      description: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." "There is no one who loves pain itself who seeks after it and wants to have it, simply because it is pain,
  `,
    },
    {
      name: "osiris",
      img: "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/341996147_718964956592860_7697224133555462430_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHqxPm8JLyZaupGIhAtiZEWSTFsiUx7NbFJMWyJTHs1sfACYsn-cZ72wY9Rd7LROBGYi-sruJ_piNI6LsYSk2AB&_nc_ohc=UH1BzOUOdSIAX96E6RP&_nc_ht=scontent.fhex4-1.fna&oh=00_AfDUuhjZU8fS5PDsaWhC_Kq4wf939hiON-vP3BARlAUeAg&oe=6593EAA8",
      raiting: 3.5,
      description: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." "There is no one who loves pain itself who seeks after it and wants to have it, simply because it is pain,`,
    },
    {
      name: "osiris",
      img: "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/341996147_718964956592860_7697224133555462430_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHqxPm8JLyZaupGIhAtiZEWSTFsiUx7NbFJMWyJTHs1sfACYsn-cZ72wY9Rd7LROBGYi-sruJ_piNI6LsYSk2AB&_nc_ohc=UH1BzOUOdSIAX96E6RP&_nc_ht=scontent.fhex4-1.fna&oh=00_AfDUuhjZU8fS5PDsaWhC_Kq4wf939hiON-vP3BARlAUeAg&oe=6593EAA8",
      raiting: 3.5,
      description: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." "There is no one who loves pain itself who seeks after it and wants to have it, simply because it is pain,`,
    },
    {
      name: "osiris",
      img: "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/341996147_718964956592860_7697224133555462430_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHqxPm8JLyZaupGIhAtiZEWSTFsiUx7NbFJMWyJTHs1sfACYsn-cZ72wY9Rd7LROBGYi-sruJ_piNI6LsYSk2AB&_nc_ohc=UH1BzOUOdSIAX96E6RP&_nc_ht=scontent.fhex4-1.fna&oh=00_AfDUuhjZU8fS5PDsaWhC_Kq4wf939hiON-vP3BARlAUeAg&oe=6593EAA8",
      raiting: 3.5,
      description: `Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." "There is no one who loves pain itself who seeks after it and wants to have it, simply because it is pain,`,
    },
    {
      name: "osiris",
      img: "https://scontent.fhex4-1.fna.fbcdn.net/v/t39.30808-6/341996147_718964956592860_7697224133555462430_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHqxPm8JLyZaupGIhAtiZEWSTFsiUx7NbFJMWyJTHs1sfACYsn-cZ72wY9Rd7LROBGYi-sruJ_piNI6LsYSk2AB&_nc_ohc=UH1BzOUOdSIAX96E6RP&_nc_ht=scontent.fhex4-1.fna&oh=00_AfDUuhjZU8fS5PDsaWhC_Kq4wf939hiON-vP3BARlAUeAg&oe=6593EAA8",
      raiting: 3.5,
      description: `Buen trabajO`,
    },
  ]);

  useEffect(() => {
    getReviewsByspecialist();
  }, []);

  const getReviewsByspecialist = async () => {
    console.log(items.id);
    setFetching(true);
    let url = `/ratings/getRatingsByDriver/${items.id}`;
    await fetchData(url).then((response) => {
      if (response.ok) {
        setComments(response.ratingsByDriver);
        setPunctuation(response.punctuation);
      }
    });
    setFetching(false);
  };

  return (
    <View style={{ marginHorizontal: 0 }}>
      <View
        style={{
          backgroundColor: "white",
          height: "20%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri: items.img,
          }}
          style={{ height: 100, width: 100, borderRadius: 100 }}
        />

        <Text style={{ fontWeight: "bold", fontSize: 19 }}>
          {items.name} {items.lastName}
        </Text>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Rating imageSize={25} fractions={1} startingValue={punctuation} />
          <Text style={{fontWeight:'bold'}}> {formatter2(punctuation) }</Text>
        </View>
      </View>
      <View style={{ backgroundColor: "white", height: "80%" }}>
        <FlatList
          refreshing={fetching}
          data={comments}
          onRefresh={getReviewsByspecialist}
          style={{}}
          renderItem={({ item }: any) => (
            <Component
              name={item.user_first_name}
              lastName={item.user_last_name}  
              img={item.user_img}
              raiting={item.raiting}
              date={item.dateRating}
              comments={item.review}
              punctuation={punctuation}
            />
          )}
          numColumns={1}
        ></FlatList>
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
    <View style={{ backgroundColor: "white", marginTop: 3, paddingHorizontal:10 }}>
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
            <View>
              <Rating imageSize={15} fractions={1} startingValue={raiting} />
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
