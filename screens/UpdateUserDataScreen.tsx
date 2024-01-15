import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Linking,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import HeaderComponent from "../components/Header";
import { checkStorage, Container, Loading } from "../components/Shared";
import { BottomPopup } from "../components/BottomPopup";
import { fetchData, sendData, sendDataPut } from "../httpRequests";
import Toast from "react-native-root-toast";
import asyncStorage from "@react-native-async-storage/async-storage";
import { LanguageContext } from "../LanguageContext";
import { Dropdown } from "react-native-element-dropdown";
export default function UpdateUserDataScreen({ navigation, route }: any) {
  const { userData } = route.params;
  console.log(userData);
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [country_id, setCountry_id]: any = useState(0);
  const [countries, setCountries]: any = useState([]);
  const [initialValues, setInitialValues]: any = useState({
    id: userData.id,
    fullName: userData.first_name,
    email: userData.email,
    phone: userData.phone,
    country_id: userData.country_id,
    password: "",
    passwordConfirmation: "",
  });
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
  });

  useEffect(() => {
    getCountryActive();
  }, []);

  const getCountryActive = async () => {
    let url = `/country/getCountryActive`;
    await fetchData(url).then((response: any) => {
      if (response.ok) {
        const mappedValues = response.country.map((country: any) => ({
          label: country.name,
          value: country.id,
        }));
        setCountries(mappedValues);
        console.log(mappedValues);
        setCountry_id(userData ? userData.country_id : response.country[0].id);
      }
    });
  };

  console.log(country_id);

  const updateData = (values: any) => {
    setShowLoading(true);
    const url = "/user/updateCliente";
    const data = {
      first_name: values.fullName,
      email: values.email,
      phone: values.phone,
      // password: values.password,
      country_id: country_id,
      user_id: values.id,
    };
    console.log(data);
    sendData(url, data)
      .then((response) => {
        hideLoadingModal(() => {
          if (response.ok) {
            navigation.navigate("Profile");
            showGoodToast("User updated");
          } else {
            showErrorToast(response.message);
          }
        });
      })
      .catch((error) => {
        hideLoadingModal(() => {
          showErrorToast(translation.t("httpConnectionError"));
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

  const showGoodToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
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

  return (
    <Container keyboard={false}>
      <Loading showLoading={showLoading} translation={translation} />
      <View style={{ marginBottom: 30 }}>
        <HeaderComponent navigation={navigation} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Actualizar datos</Text>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values: any) => updateData(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isValid,
            errors,
            touched,
          }: any) => (
            <View>
              <Text style={styles.labelInput}>
                {"Nombre completo" /*  Full Name */}
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
                  // iconStyle={styles.iconStyle}
                  iconColor={"#5f7ceb"}
                  data={countries}
                  value={countries.find((a: any) => a.value === country_id)}
                  search
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  placeholder="Selecionar Pais"
                  searchPlaceholder="Buscar pais"
                  onChange={(items: any) => {
                    setCountry_id(items.value);
                  }}
                />
              </View>

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

              <Text style={styles.titlePassword}>
                Contraseña (dejar campos vacíos en caso de no querer actualizar)
              </Text>
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
              <TouchableOpacity
                style={styles.registerButton}
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
              <BottomPopup
                ref={(target: any) => (popupRef = target)}
                onTouchOutside={onClosePopup}
                title={"Alert"}
                errors={errors}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  titlePassword: {
    fontSize: 15,
    alignItems: "center",
    fontWeight: "bold",
    marginVertical: 20,
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
    marginTop: 20,
  },
  registerButtonDisabled: {
    width: "100%",
    height: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
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
    borderRadius: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    height: 50,
    width: "100%",
    borderColor: "#5f7ceb",
    borderWidth: 0.5,
    backgroundColor: "#F7F7F7",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 13,
    borderRadius: 5,
    marginBottom: 3,
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
    marginBottom: 3,
  },
  inputSearchStyle: {
    height: 50,
    // width: "100%",
    borderColor: "#F7F7F7",
    // borderWidth: 2,
    backgroundColor: "#F7F7F7",
    // paddingRight: 45,
    // paddingLeft: 20,
    // paddingTop:25,
    borderRadius: 5,
  },
  scrollViewContainer: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
