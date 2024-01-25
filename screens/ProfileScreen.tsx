import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Linking,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Button,
} from "react-native";
import HeaderComponent from "../components/Header";
import {
  checkLoggedUser,
  checkStorage,
  Container,
  Loading,
} from "../components/Shared";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import asyncStorage from "@react-native-async-storage/async-storage";
import { fetchData, sendData, sendDataPut } from "../httpRequests";
import { LanguageContext } from "../LanguageContext";

export default function ProfileScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [profileImage, setProfileImage]: any = useState("");
  const [isSelecting, setIsSelecting]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [user, setUser]: any = useState({});

  useEffect(() => {
    navigation.addListener('focus', () => {
    checkLoggedUser(
      (id: string) => {
        console.log(id);
        setShowLoading(true);
        const url = `/user/getUserById/${id}`;
        const data = { user_id: id };
        sendData(url, data).then((response) => {
          if (response.ok) {
            hideLoadingModal(() => {
              const user = response["user"];
              setUser(user);
              if (user.img) {
                let img = user.img;
                if (!img.includes("https://")) {
                  img = "https://" + user.img;
                }
                setProfileImage({ uri: img });
              } else
                setProfileImage(require("../assets/images/profile_avatar.png"));
            });
          } else {
            hideLoadingModal(() => {
              logout();
            });
          }
        });
        // setShowLoading(false)
      },
      navigation,
      translation
    );
  })
    return () => {
      setUser({});
      setProfileImage("");
    };
  }, []);

  let openImagePickerAsync = async () => {
    setIsSelecting(true);
    Alert.alert(
      translation.t("alertInfoTitle"),
      "",
      [
        {
          text: translation.t("profilePictureCameraText"), // Take picture
          onPress: () => setProfilePicture(1),
        },
        {
          text: translation.t("profilePictureGaleryText"), // Upload from galery
          onPress: () => setProfilePicture(2),
        },
      ],
      { cancelable: true, onDismiss: () => setIsSelecting(false) }
    );
  };

  const setProfilePicture = async (type: number) => {
    let pickerResult: any;
    if (type == 1) {
      // 1 == Camera
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(translation.t("profilePictureCameraPermissionText")); // Permission to access camera is required!
        setIsSelecting(false);
        return;
      }

      pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (type == 2) {
      // 2 == Galery
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(translation.t("profilePictureGaleryPermissionText")); // Permission to access camera roll is required!
        setIsSelecting(false);
        return;
      }

      pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (pickerResult.cancelled === true) {
      setIsSelecting(false);
      return;
    }

    setShowLoading(true);
    const resultUri = pickerResult.uri;
    let fileName = resultUri.split("/").pop();
    let match = /\.(\w+)$/.exec(fileName);
    let fileType = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append("image", { uri: resultUri, name: fileName, fileType });

    const url = "/user/updateClientImage/" + user.id;
    const data = formData;

    sendData(url, data).then((response) => {
      hideLoadingModal(() => {
        if (Object.keys(response).length > 0) {
          setProfileImage({ uri: pickerResult.uri });
          Alert.alert(
            translation.t("alertInfoTitle"),
            translation.t("profilePictureSaved")
          );
        }

        setIsSelecting(false);
      });
    });

    // const user = getAuthUser();
    // if (!!user) user.profileImage = profileImage;
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  const logout = () => {
    const user = asyncStorage.getItem("USER_LOGGED");
    if (!!user) {
      asyncStorage.removeItem("USER_LOGGED");
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  const supportedURL = "https://coopharma-83beb.web.app/termsandconditions";
  const unsupportedURL = "slack://open?team=123456";

  const OpenURLButton = async () => {
    const supported = await Linking.canOpenURL(supportedURL);
    if (supported) {
      await Linking.openURL(supportedURL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
    }
  };

  const deleteUser = async () => {
    checkStorage("USER_LOGGED", async (data: any) => {
      let url = `/user/deleteUser/${data}`;
      fetchData(url).then((res) => {
        if (res.ok) {
          logout();
        }
      });
    });
  };
  return (
    <Container>
      <HeaderComponent />
      <Loading showLoading={showLoading} translation={translation} />
      <Text style={styles.title}>
        {translation.t("profileMyAccountText") /* My Account */}
      </Text>
      <View style={styles.header}>
        <TouchableOpacity
          disabled={isSelecting}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 100,
          }}
          onPress={openImagePickerAsync}
        >
          <ImageBackground
            source={!!profileImage ? profileImage : null}
            style={styles.profilePicture}
            resizeMode={"cover"}
            imageStyle={{ borderRadius: 100 }}
          ></ImageBackground>
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          {Object.keys(user).length > 0 && (
            <>
              <Text style={styles.profileText}>{user.first_name}</Text>
              <Text style={styles.profileText}>{user.email}</Text>
            </>
          )}
        </View>
      </View>
      <ScrollView style={styles.body}>
        <View>
          {/* <Pressable
            style={[styles.option, {}]}
            onPress={() => navigation.navigate("MyOrders")}
          >
            <Text style={styles.optionText}>
              {translation.t("headerTitleMyOrders")}
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable> */}
          {/* <Pressable style={styles.option} onPress={() => navigation.navigate('Payments')}>
						<Text style={styles.optionText}>{translation.t('headerTitlePayments')}</Text>
						<AntDesign style={styles.optionIcon} name='right' size={16} />
					</Pressable> */}
          {/* <Pressable style={styles.option} onPress={() => navigation.navigate('Addresses')}>
						<Text style={styles.optionText}>{translation.t('headerTitleAddresses')}</Text>
						<AntDesign style={styles.optionIcon} name='right' size={16} />
					</Pressable> */}
          <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("UpdateUser", {userData: user})}
          >
            <Text style={styles.optionText}>
              {translation.t("MyInformation")}
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("SelectLanguage")}
          >
            <Text style={styles.optionText}>
              {translation.t("languageTitle")}
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("Notification")}
          >
            <Text style={styles.optionText}>
              Notification
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          {/* MyBoats */}
          {/* <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("MyBoats")}
          >
            <Text style={styles.optionText}>{translation.t("MyBoats")}</Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable> */}
          <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("Marinas", { showBack: true })}
          >
            <Text style={styles.optionText}>{translation.t("Marinas")}</Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          {/* Guest */}
          {/* <Pressable
            style={styles.option}
            onPress={() =>
              navigation.navigate("GuestScreen", { showBack: true })
            }
          >
            <Text style={styles.optionText}>{translation.t("Guest")}</Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable> */}
          <Pressable
            style={styles.option}
            onPress={() =>
              navigation.navigate("MyGuestScreen", { showBack: true })
            }
          >
            <Text style={styles.optionText}>{translation.t("recivedInvitation")}</Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              logout();
            }}
          >
            <Text style={styles.optionText}>
              {translation.t("profileLogOutText") /* Log Out */}
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable>
          
          <Pressable
            style={styles.option}
            onPress={() => {
              Alert.alert(
                translation.t("alertWarningTitle"),
                translation.t("deleteUserAccount"), // Do you want to delete this address?
                [
                  {
                    text: "Yes",
                    onPress: () => {
                      deleteUser();
                    },
                  },
                  {
                    text: translation.t("alertButtonNoText"),
                  },
                ]
              );
            }}
          >
            <Text style={styles.optionText}>
              {translation.t("deleteAccount") /* Log Out */}
            </Text>
            <AntDesign
              style={styles.optionIconDelete}
              name="delete"
              size={16}
            />
          </Pressable>
          {/* <Pressable
            style={styles.option}
            onPress={() => navigation.navigate("ListScreen")}
          >
            <Text style={styles.optionText}>
              {translation.t("maintenance") }
            </Text>
            <AntDesign style={styles.optionIcon} name="right" size={16} />
          </Pressable> */}
        </View>
        <View style={styles.footer}>
          
          <TouchableOpacity
            onPress={() => {
              OpenURLButton();
            }}
          >
            <Text style={{color:'#5f7ceb', fontSize:18}}>{translation.t("profileTermsText")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },
  profileText: {
    fontSize: 16,
  },
  option: {
    alignContent: "center",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderBottomColor: "rgba(0, 0, 0,  0.1)",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  optionIcon: {
    color: "rgba(0, 0, 0, 0.3)",
  },
  optionIconDelete: {
    color: "red",
  },
  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  footerText: {
    fontSize: 13,
  },
});
