import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import asyncStorage from "@react-native-async-storage/async-storage";
import { sendData } from "../httpRequests";
import { BlurView } from "expo-blur";
import GoMap from "../screens/GoMap";

const Container = ({ children, style, keyboard }: any) => {
  return (
    <SafeAreaView
      style={
        !!style
          ? [
              style,
              {
                paddingTop:
                  Platform.OS === "android" ? StatusBar.currentHeight : 0,
              },
            ]
          : styles.container
      }
    >
      {keyboard ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "position"}
        >
          {children}
        </KeyboardAvoidingView>
      ) : (
        <>{children}</>
      )}
    </SafeAreaView>
  );
};

const Loading = ({ showLoading, translation }: any) => {
  return (
    <Modal visible={showLoading} transparent animationType="fade">
      <BlurView
        intensity={80}
        tint={"dark"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            height: 120,
            backgroundColor: "#fff",
            width: 150,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#5f7ceb" />
          <Text style={{ marginTop: 20, fontSize: 16 }}>
            {translation.t("loadingText") /* Loading... */}
          </Text>
        </View>
      </BlurView>
    </Modal>
  );
};

function Cards({
  navigation,
  setCard,
  horizontal = true,
  style,
  translation,
}: any) {
  const [cards, setCards]: any = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    navigation.addListener("focus", () => {
      fetchCards();
    });
  }, []);

  const fetchCards = () => {
    checkStorage("USER_LOGGED", (userId: any) => {
      const url = "/stripe/getCards";
      const data = { id: userId };
      sendData(url, data).then((response) => {
        if (Object.keys(response).length > 0) {
          const cards = response["cards"];
          if (cards.length > 0) {
            const url = `/user/getUserById/${userId}`;
            sendData(url, {}).then((response: any) => {
              const user = response["user"];
              const defaultCard = cards.find(
                (card: any) => card.id == user.card_id
              );
              if (defaultCard) {
                defaultCard.default = true;
                if (setCard) setCard(defaultCard.id);
              }
              setCards(cards);
            });
          } else {
            if (setCard) setCard("");
            setCards([]);
          }
        }
      });
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  const setDefaultCard = (item: any) => {
    setShowLoading(true);
    checkStorage("USER_LOGGED", (userId: any) => {
      const url = `/user/getUserById/${userId}`;
      sendData(url, {}).then((response: any) => {
        hideLoadingModal(() => {
          const user = response["user"];
          const url = "/user/updateCliente";
          if (item.id != user.card_id) {
            const data = {
              user_id: user.id,
              client_direction_id: user.client_direction_id,
            };
            sendData(url, data).then((response: any) => {
              fetchCards();
              if (setCard) setCard(item.id);
            });
          }
        });
      });
    });
  };

  const deleteCard = (id: any) => {
    Alert.alert(
      translation.t("alertWarningTitle"),
      translation.t("cardRemoveItemText"), // Do you want to delete this card?
      [
        {
          text: translation.t("alertButtonYesText"),
          onPress: () => {
            setShowLoading(true);
            checkStorage("USER_LOGGED", (userId: any) => {
              const url = "/stripe/deleteCard";
              const data = {
                id: userId,
                card_id: id,
              };
              sendData(url, data).then((response: any) => {
                hideLoadingModal(() => {
                  fetchCards();
                });
              });
            });
          },
        },
        {
          text: translation.t("alertButtonNoText"),
        },
      ]
    );
  };

  return (
    <>
      <Loading showLoading={showLoading} translation={translation} />
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            {translation.t("cardSelectTitle") /* Select Payment System */}
          </Text>
          <Pressable
            style={{
              backgroundColor: "#128780",
              width: 35,
              borderRadius: 5,
              height: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("NewCard")}
          >
            <AntDesign name="plus" size={18} style={{ color: "#fff" }} />
          </Pressable>
        </View>
        <FlatList
          horizontal={horizontal}
          style={{ marginTop: 10 }}
          data={cards}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.productCard,
                item.default == true
                  ? {
                      borderColor: "#128780",
                      borderWidth: 1,
                      backgroundColor: "#d8f3f1",
                    }
                  : { borderColor: "rgba(0, 0, 0, 0.1)" },
                { marginHorizontal: 5, width: 120 },
                style,
              ]}
              onPress={() => setDefaultCard(item)}
            >
              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  right: 5,
                  top: 0,
                  alignItems: "center",
                }}
              >
                {item.default && !horizontal && (
                  <Text style={{ fontSize: 14, marginRight: 5 }}>
                    {translation.t("selectDefaultText") /* Default */}
                  </Text>
                )}
                <FontAwesome
                  name="trash-o"
                  style={{ padding: 5 }}
                  size={20}
                  onPress={() => deleteCard(item.id)}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  paddingTop: 5,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <AntDesign
                    size={22}
                    name="creditcard"
                    style={{ marginBottom: 5 }}
                  />
                  <Text
                    style={{
                      textAlign: "left",
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                  >
                    {item.brand}
                  </Text>
                  <Text
                    style={{
                      textAlign: "left",
                      fontWeight: "500",
                      color: "rgba(0, 0, 0, 0.4)",
                      fontSize: 15,
                      marginTop: 3,
                    }}
                  >
                    {item.last4}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}

const checkStorage = (key: string, callback: any) => {
  const data = asyncStorage.getItem(key);
  data.then((response: any) => {
    callback(response);
  });
};

const checkLoggedUser = (callback: any, navigation: any, translation: any) => {
  checkStorage("USER_LOGGED", (id: any) => {
    if (!!id) {
      callback(id);
    } else {
      Alert.alert(
        translation.t("alertWarningTitle"), // Alert
        translation.t("alertUserAnonymousMessage"), // You need to be logged in to perfom this action.
        [
          {
            text: translation.t("alertGoToLogin"), // Go to Login
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
              });
            },
          },
        ]
      );
    }
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  productCard: {
    paddingVertical: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "relative",
  },
  labelInput: {
    fontSize: 15,
    color: "#8B8B97",
    marginTop: 10,
  },
  textInput: {
    height: 50,
    width: "100%",
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 5,
  },
  item: {
    // backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export { Container, Cards, checkStorage, Loading, checkLoggedUser };
