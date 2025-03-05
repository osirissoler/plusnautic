import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { Container, checkStorage, Loading } from "../components/Shared";
import HeaderComponent from "../components/Header";
import Toast from "react-native-root-toast";
import { sendData } from "../httpRequests";
import asyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "../LanguageContext";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "./helper/TokenDevice";
// import { db, firebase } from '../firebase';
// import { collection, Firestore, onSnapshot, query, where } from '@firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    allowBadge: true,
  }),
});

export default function SignInScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLogin, setShowLogin]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [expoPushToken, setExpoPushToken]: any = useState("");
  const [errorMesage, setErrorMesage]: any = useState("");
  const [error, setError]: any = useState(false);

  const [notification, setNotification]:any = useState(null);

  const call:any = useRef(true);
  const notificationListener:any = useRef();
  const responseListener:any = useRef();

  useEffect(() => {
    // clearAsyncStorage()
    buscartoken();
  }, []);
  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };

  useEffect(() => {
    checkStorage("USER_LOGGED", (response: any) => {
      if (!!response)
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Root",
              params: { phId: 536 },
              screen: "Home",
            },
          ],
        });
      else setShowLogin(true);
    });
  }, []);
  const buscartoken = async () => {
    let token: any = await registerForPushNotificationsAsync();

    await setNotification(token);
    // await setNotification2(token)
    if (token) {
      asyncStorage.setItem("TOKEN", token);
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response:any) => {});
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  };

  const onSignIn = (values: any) => {
    setShowLoading(true);
    const url = "/auth/login";
    sendData(url, values).then((response: any) => {
      console.log(response.id);
      hideLoadingModal(() => {
        if(response.ok){
          setAuthUser(response.id);
          asyncStorage.setItem("USER_LOGGED_COUNTRY", JSON.stringify(response.country_id));
          asyncStorage.setItem("DATA_COUNTRY", JSON.stringify(response.data.Country));
        }else{
          // showErrorToast(response.message);
          setError(true);
          if(translation.locale.includes("en")){
            setErrorMesage(response.message);
          }else{
            setErrorMesage(response.mensaje);
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

  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "red", width: "80%" },
    });
  };

  const setAuthUser = (id: number) => {
    asyncStorage.setItem("USER_LOGGED", id + "");
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Root",
          params: { phId: 536 },
          screen: "Home",
        },
      ],
    });
  };

  function InputPassword({ handleChange, handleBlur, value }: any) {
    const [showPassword, setShowPassword]: any = useState(false);
    const [passwordIcon, setPasswordIcon]: any = useState("eye-slash");

    const toggleShowPassword = () => {
      if (showPassword) {
        setShowPassword(false);
        setPasswordIcon("eye-slash");
      } else {
        setShowPassword(true);
        setPasswordIcon("eye");
      }
    };

    return (
      <>
        <Text style={styles.labelInput}>
          {translation.t("userPasswordLabel") /*  Password */}
        </Text>
        <View style={styles.formInputIcon}>
          <TextInput
            style={[styles.textInput, { zIndex: 1 }]}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={value}
            secureTextEntry={!showPassword}
            keyboardType={!showPassword ? undefined : "visible-password"}
          />
          <FontAwesome
            style={styles.inputIcon}
            name={passwordIcon}
            size={16}
            onPress={() => toggleShowPassword()}
          />
        </View>
      </>
    );
  }

  return (
    <Container keyboard={false}>
      {showLogin && (
        <>
          <HeaderComponent screen="signin" navigation={navigation} />
          <Loading showLoading={showLoading} translation={translation} />
          <View style={styles.body}>
            <Text style={styles.title}>
              {translation.t("signInTitle") /*  Login */}
            </Text>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values) => onSignIn(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <>
                  <Text style={styles.labelInput}>
                    {translation.t("userEmailLabel")}
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize={"none"}
                  />
                  <InputPassword
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={values.password}
                  />

                  {error && (
                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: "#FDC0C6",
                        paddingVertical: 20,
                        borderRadius: 5,
                        borderLeftWidth: 8,
                        borderColor: "#FC808E",
                        borderRightWidth: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#C10516",
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        {errorMesage}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.loginButtonText}>
                      {translation.t("signInTitle")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => navigation.navigate("ForgotPassword")}
                  >
                    <Text style={styles.registerLink}>{translation.t("signInForgotPassword")}</Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text style={styles.registerText}>
                      {
                        translation.t(
                          "signInNewAccount"
                        ) /*  Don't have an account? */
                      }
                    </Text>
                    <Text
                      style={styles.registerLink}
                      onPress={() => navigation.navigate("SignUp")}
                    >
                      {translation.t("signUpTitle") /*  Sign Up */}
                    </Text>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    marginVertical: 15,
    marginBottom: 30,
  },
  labelInput: {
    fontSize: 15,
    color: "#8B8B97",
    marginTop: 20,
  },
  textInput: {
    height: 50,
    width: "100%",
    backgroundColor: "#F7F7F7",
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  formInputIcon: {
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    position: "absolute",
    right: 5,
    top: "25%",
    zIndex: 2,
    padding: 10,
  },
  forgotPassword: {
    width: 180,
    alignSelf: "flex-end",
    textAlign: "right",
    padding: 5,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: 30,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  registerText: {
    textAlign: "center",
    fontSize: 14,
  },
  registerLink: {
    padding: 5,
    color: "#5f7ceb",
  },
});
