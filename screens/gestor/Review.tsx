import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  FlatList,
  Modal,
  TextInput,
} from "react-native";

import { Rating } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { checkLoggedUser, checkStorage } from "../../components/Shared";
import { sendData } from "../../httpRequests";
import HeaderComponent from "../../components/Header";
import { LanguageContext } from "../../LanguageContext";

export default function SendReview({ navigation, route, id, reload }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showModal, setShowModal]: any = useState(false);
  const [user, setUser]: any = useState({});
  const [value, setValue]: any = useState(0);
  const [profileImage, setProfileImage]: any = useState();

  useEffect(() => {
    checkLoggedUser(
      (id: string) => {
        const url = `/user/getUserById/${id}`;
        const data = { user_id: id };
        sendData(url, data).then((response) => {
          if (response.ok) {
            const user = response["user"];
            setUser(user);
            if (user.img) {
              let img = user.img;
              if (!img.includes("https://")) {
                img = "https://" + user.img;
              }
              setProfileImage({ uri: img });
            } else
              setProfileImage(
                require("../../assets/images/profile_avatar.png")
              );
          }
        });
      },
      navigation,
      translation
    );
    return () => {
      setUser({});
      setProfileImage("");
    };
  }, []);

  const send = async (item: any) => {
    Alert.alert(
      translation.t("pagoAlertTitle"),
      translation.t("AlertEvaluation"),
      [
        {
          text: "Enviar",
          onPress: async() => {
            let url = `/ratings/createRatingsByDriver`;
            const data = {
              user_id: user.id,
              driver_id: id,
              punctuation: value,
              review: item.description,
            };
            await sendData(url, data).then((response:any) => {
              if (response.ok) {
                reload()
                setValue(0)
                setShowModal(false);
              }
            });
          },
        },
        {
          text: "Cancelar",
        },
      ]
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          backgroundColor: "#5f7ceb",
          paddingHorizontal: 10,
          borderRadius: 5,
          marginTop: 5,
        }}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ fontWeight: "bold", color: "white" }}>{translation.t("review")}</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "white",
            paddingVertical: 50,
            paddingHorizontal: 15,
          }}
        >
          <HeaderComponent />
          <TouchableOpacity
            onPress={() => setShowModal(false)}
            style={{ alignItems: "flex-end" }}
          >
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                
                width: "20%",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={!!profileImage ? profileImage : null}
                style={{ height: 70, width: 70, borderRadius: 100 }}
                resizeMode={"cover"}
                imageStyle={{ borderRadius: 100 }}
              />
            </View>
            <View
              style={{ marginLeft: 5, width: "80%" }}
            >
              <Text style={{ fontSize: 16, marginBottom: 3, fontWeight:'bold' }}>
                {user.first_name}
              </Text>
              <Text style={{ fontSize: 16 }} numberOfLines={2}>
              {translation.t("messageEvalation")}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 15,  flexDirection: "row", justifyContent:'center', alignItems:'center' }}>
            <Rating
              imageSize={40}
              fractions={1}
              startingValue={value}
              onFinishRating={(valor: any) => {
                setValue(valor);
              }}
            />
            <Text style={{fontSize:18, paddingLeft:10}}>{value}</Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <Formik
              initialValues={{
                description: "",
                boatsRecord_id: "",
              }}
              onSubmit={(values) => {
                send(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                isValid,
                errors,
                touched,
              }) => (
                <View style={{ height: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      <TextInput
                        style={styles.textInput}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        value={values.description}
                        placeholder={"Describe tu experiencia"}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      {
                        width: "100%",
                        height: 50,
                        backgroundColor: "#5f7ceb",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        marginTop: 40,
                      },
                      !isValid && { backgroundColor: "#FB4F03" },
                    ]}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 18 }}>Send</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 180,
    width: "100%",
    borderColor: "#5f7ceb",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    paddingRight: 35,
    paddingLeft: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
});
