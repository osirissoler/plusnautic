import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  Linking,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import HeaderComponent from "../components/Header";
import { checkStorage, Container, Loading } from "../components/Shared";
import { BottomPopup } from "../components/BottomPopup";
import { fetchData, sendData } from "../httpRequests";
import Toast from "react-native-root-toast";
import asyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "../LanguageContext";
import { CheckBox, Separator } from "react-native-btr";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import { translate } from "i18n-js";
import { useHandleNotifications } from "../hooks/useHandleNotifications";
import registerForPushNotificationsAsync from "./helper/TokenDevice";
export default function SignUpScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [termAndCoditionAccepted, settermAndCoditionAccepted] = useState(false);
  const [country_id, setCountry_id]: any = useState(0);
  const [countries, setCountries]: any = useState([]);
    const [expoPushToken, setExpoPushToken] = useState<string>("");

  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .required(
        translation.t("signUpFullNameRequiredText") /* First name is required */
      ),
    phone: yup
      .string()
      .required(
        translation.t(
          "signUpPhoneNumberRequiredText"
        ) /* Phone number is required */
      ),
    email: yup
      .string()
      .email(
        translation.t(
          "signUpEmailValidationText"
        ) /* Please enter valid email */
      )
      .required(
        translation.t("signUpEmailRequiredText") /* Email is required */
      ),
    password: yup
      .string()
      .matches(
        /\w*[a-z]\w*/,
        translation.t(
          "signUpPasswordValidationSmallLetterText"
        ) /*Password must have a small letter */
      )
      .matches(
        /\w*[A-Z]\w*/,
        translation.t(
          "signUpPasswordValidationCapitalLetterText"
        ) /* Password must have a capital letter */
      )
      .matches(
        /\d/,
        translation.t(
          "signUpPasswordValidationNumberText"
        ) /* Password must have a number */
      )
      .min(
        8,
        ({ min }: any) =>
          translation.t("signUpPasswordValidationCharactersText") +
          min /* `Password must be at least ${min} characters` */
      )
      .required(
        translation.t("signUpPasswordRequiredText") /* Password is required */
      ),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        translation.t(
          "signUpPasswordMatchErrorText"
        ) /* Passwords do not match */
      )
      .required(
        translation.t(
          "signUpPasswordConfirmationRequiredText"
        ) /* Confirm password is required */
      ),
    country_id: yup
      .string()
      .required(translation.t("CountryIsRequired")) /* Country is required */,
    address: yup
      .string()
      .required(
        translation.t("addressAddressRequiredText")
      ) /* Address is required */,
  });

  useEffect(() => {
    const cleanupNotifications = useHandleNotifications(navigation);
    getCountryActive();
    getToken();
  }, []);

  const getCountryActive = async () => {
    let url = `/country/getCountryActive`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        const mappedValues = response.country.map((boatsRecord: any) => ({
          label: boatsRecord.name,
          value: boatsRecord.id,
        }));
        setCountries(mappedValues);
      }
    });
  };

  const getToken = async () => {
    let token: any = await registerForPushNotificationsAsync();
    if (token) {
      setExpoPushToken(token);
      asyncStorage.setItem("TOKEN", token);
    }
  };

  const onSignUp = (values: any) => {
    setShowLoading(true);
    const url = "/user/createClient";
    const data = {
      first_name: values.fullName,
      lastName: "",
      email: values.email,
      phone: values.phone,
      password: values.password,
      country_id: values.country_id,
      address: values.address,
    };
    console.log(data);
    sendData(url, data)
      .then((response) => {
        hideLoadingModal(() => {
          if (response.ok) {
            console.log(response.ok, "aqui1");
            const url = "/auth/login";
            sendData(url, { ...values, expoToken: expoPushToken }).then(
              (response: any) => {
                if (response.ok) {
                  setAuthUser(response.id);
                  asyncStorage.setItem(
                    "USER_LOGGED_COUNTRY",
                    JSON.stringify(response.country_id)
                  );
                  // redirectToRecordBoats()
                }
              }
            );
          } else {
            showErrorToast(response.message);
            console.log(response, "aqui2");
          }
        });
      })
      .catch((error) => {
        hideLoadingModal(() => {
          showErrorToast(translation.t("httpConnectionError"));
        });
      });
  };

  const setAuthUser = (id: number) => {
    asyncStorage.setItem("USER_LOGGED", id + "");
    // navigation.navigate("Marinas", { showBack: false });
    navigation.reset({
    	index: 0,
    	routes: [
    		{
    			name: 'Root',
    			params: { phId: 536 },
    			screen: 'Home'
    		}
    	]
    });
  };

  const redirectToRecordBoats = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "RecordBoats" }],
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

  let popupRef: any = React.createRef();

  const onShowPopup = () => {
    popupRef.show();
  };

  const onClosePopup = () => {
    popupRef.close();
  };

  function InputPassword({
    handleChange,
    handleBlur,
    value,
    label,
    name,
  }: any) {
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
      <View style={{ backgroundColor: "white" }}>
        <Text style={styles.labelInput}>{label}</Text>
        <View style={styles.formInputIcon}>
          <TextInput
            style={[styles.textInput, { zIndex: 1 }]}
            onChangeText={handleChange(name)}
            onBlur={handleBlur(name)}
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
      </View>
    );
  }
  const [data, setData] = useState([
    { title: "Default" },
    { title: "Colored", checked: true, color: "#08f" },
    { title: "Disabled", checked: true, disabled: true },
  ]);

  function toggle(index: number) {
    const item = data[index];
    item.checked = !item.checked;
    setData([...data]);
  }

  const supportedURL = "https://coopharma-83beb.web.app/termsandconditions";

  const unsupportedURL = "slack://open?team=123456";

  const OpenURLButton = async () => {
    // const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(supportedURL);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(supportedURL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
    }
    // }, [url]);

    // return <Button title={children} onPress={handlePress} />;
  };
  return (
    <Container keyboard={false}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        > */}

      <Loading showLoading={showLoading} translation={translation} />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={{ marginBottom: 30 }}>
          <HeaderComponent navigation={navigation} />
        </View>
        <Text style={styles.title}>{translation.t("signUpTitle")}</Text>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            password: "",
            passwordConfirmation: "",
            address: "",
          }}
          onSubmit={(values: any) => onSignUp(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            errors,
            touched,
            setFieldValue,
          }: any) => (
            <View>
              <Text style={styles.labelInput}>
                {translation.t("userFullNameLabel") /*  Full Name */}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                value={values.fullName}
              />
              <Text style={styles.labelInput}>
                {translation.t("userEmailLabel") /*  Email */}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View>
                <Text style={styles.labelInput}>
                  {translation.t("country") /*  Email */}
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={countries}
                  search
                  maxHeight={300}
                  labelField={"label"}
                  valueField={"value"}
                  placeholder={translation.t("SelectCountry")}
                  searchPlaceholder={`${translation.t("SearchCountry")}...`}
                  onChange={(items: any) => {
                    setFieldValue("country_id", items.value);
                  }}
                />
              </View>
              <Text style={styles.labelInput}>
                {translation.t("addressAddressLabel") /*  Address */}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
              />

              <Text style={styles.labelInput}>
                {translation.t("userPhoneNumberLabel") /*  Phone Number */}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                keyboardType="numeric"
              />
              <InputPassword
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.password}
                label={translation.t("userPasswordLabel") /*  Password */}
                name={"password"}
              />
              <InputPassword
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.passwordConfirmation}
                label={
                  translation.t(
                    "userPasswordConfirmationLabel"
                  ) /*  Password Confirmation */
                }
                name={"passwordConfirmation"}
              />
              <View style={{ ...styles.row }}>
                <BouncyCheckbox
                  size={25}
                  fillColor="#5f7ceb"
                  textStyle={{
                    textDecorationLine: "none",
                    color: "#128780",
                  }}
                  disableText
                  text={translation.t("profileTermsText")}
                  onPress={(isChecked: boolean) => {
                    settermAndCoditionAccepted(isChecked);
                  }}
                />

                {/* <OpenURLButton url={supportedURL}>
                  {translation.t("profileTermsText")}
                </OpenURLButton> */}
                <TouchableOpacity
                  onPress={() => {
                    OpenURLButton();
                  }}
                >
                  <Text
                    style={{
                      color: "#5f7ceb",
                      fontSize: 18,
                      marginHorizontal: 2,
                    }}
                  >
                    {translation.t("profileTermsText")}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                disabled={!termAndCoditionAccepted}
                style={
                  termAndCoditionAccepted
                    ? styles.registerButton
                    : styles.registerButtonDisabled
                }
                onPress={() =>
                  Object.keys(errors).length > 0
                    ? onShowPopup()
                    : handleSubmit()
                }
              >
                <Text style={styles.registerButtonText}>
                  {translation.t("signUpButtonText") /*  Register */}
                </Text>
              </TouchableOpacity>
              {/* <View >
									<CheckBox
										checked={true}
										color={"#000"}
										disabled={false}
										onPress={() => {}}
									/>
									<Text style={styles.label}>Accep terms</Text>
								</View> */}
              <BottomPopup
                ref={(target: any) => (popupRef = target)}
                onTouchOutside={onClosePopup}
                title={"Alert"}
                errors={errors}
              />
            </View>
          )}
        </Formik>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text style={styles.loginText}>
            {translation.t("signUpExistingAccount")}
          </Text>
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("SignIn")}
          >
            {translation.t("signInTitle") /*  Sign In */}
          </Text>
        </View>
      </ScrollView>

      {/* </KeyboardAvoidingView>
      </TouchableWithoutFeedback> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  termCoditions: {
    // flex: 1,
    paddingHorizontal: 16,
    // marginBottom:40,
    color: "#128780",
  },

  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
  },
  label: {
    flex: 1,
    paddingHorizontal: 16,
  },
  body: {
    // marginHorizontal: 15,
    // backgroundColor: '#fff',
    // borderRadius: 30,
    // paddingBottom:40
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    marginBottom: 5,
    paddingLeft: 25,
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
    backgroundColor: "#F7F7F7",
    paddingRight: 45,
    paddingLeft: 20,
    borderRadius: 5,
  },
  formInputIcon: {
    position: "relative",
    flexDirection: "row",
  },
  inputIcon: {
    position: "absolute",
    right: 5,
    top: "15%",
    zIndex: 2,
    padding: 10,
  },
  errorText: {
    maxHeight: 20,
    textAlign: "center",
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 5,
  },
  registerButtonDisabled: {
    width: "100%",
    height: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 5,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
  },
  loginLink: {
    padding: 5,
    color: "#5f7ceb",
  },
  dropdown: {
    height: 50,
    borderBottomColor: "gray",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#CCCCCD",
    paddingLeft: 10,
    fontWeight: "500",
  },
  selectedTextStyle: {
    height: 50,
    width: "100%",
    borderColor: "#F7F7F7",
    borderWidth: 0.5,
    backgroundColor: "#F7F7F7",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 13,
    borderRadius: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    borderColor: "#F7F7F7",
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
