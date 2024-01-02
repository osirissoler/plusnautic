import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { AntDesign, FontAwesome, Octicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import HeaderComponent from "../components/Header";
import { checkStorage, Container, Loading } from "../components/Shared";
import { fetchData, sendData } from "../httpRequests";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";

export default function RecordBoats({ navigation, route }: any) {
  // console.log(route.params)
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [engineInputsCounter, setEngineInputsCounter] = useState(1);
  const [pharmacyValues, setPharmacyValues] = useState([]);
  const [dockValues, setDockValues] = useState([]);
  const [dockSelected, setDockSelected] = useState([]);
  const [boat, setBoat] = useState(route.params.boats[0]);
  const [boatImage, setBoatImage]: any = useState("");
  const [initialValues, setInitialValues] = useState({
    id: boat.id,
    boat_name: boat.boat_name,
    engine_1: boat.engine_1,
    engineYear_1: boat.engineYear_1,
    engine_2: boat.engine_2,
    engineYear_2: boat.engineYear_2,
    engine_3: boat.engine_3,
    engineYear_3: boat.engineYear_3,
    engine_4: boat.engine_4,
    engineYear_4: boat.engineYear_4,
    engine_5: boat.engine_5,
    engineYear_5: boat.engineYear_5,
    engine_6: boat.engine_6,
    engineYear_6: boat.engineYear_6,
    boat_hull: boat.boat_hull,
    electric_plant: boat.electric_plant,
    air_conditioner: boat.air_conditioner,
    pharmacy_id: boat.Pharmacy_id,
    docks: boat.docks,
    img: boat.img,
  });

  useEffect(() => {
    const url = `/userPharmacy/getUserPharmacyByUserId/${route.params.id}`;
    fetchData(url).then(async (res) => {
      const mappedValues = res.userPharmacy.map((pharmacy: any) => ({
        label: pharmacy.pharmacy_name,
        value: pharmacy.pharmacy_id,
      }));
      setPharmacyValues(mappedValues);

      if (initialValues.engine_2 && initialValues.engineYear_2) {
        setEngineInputsCounter(2);
      }

      if (initialValues.engine_3 && initialValues.engineYear_3) {
        setEngineInputsCounter(3);
      }

      if (initialValues.engine_4 && initialValues.engineYear_4) {
        setEngineInputsCounter(4);
      }

      if (initialValues.engine_4 && initialValues.engineYear_4) {
        setEngineInputsCounter(4);
      }

      if (initialValues.engine_5 && initialValues.engineYear_5) {
        setEngineInputsCounter(5);
      }

      if (initialValues.engine_6 && initialValues.engineYear_6) {
        setEngineInputsCounter(6);
      }

      if (route.params.editMode) {
        await searchDock(boat.Pharmacy_id)
        // const data = await boat.docks?.split(',').map((a: any) => (dockValues.find((b: any) => (b.value == a))));        console.log(dockValues.find((b: any) => (b.value == 88)))
        setDockSelected(boat.docks?.split(',').map((item: any) => parseInt(item, 10)));      }
    });

    setBoatImage(boat.img);
  }, []);

  const searchDock = async (id: any) => {
    const url = `/products/getProductsByPharmacy/${id}`;
    fetchData(url).then((res: any) => {
      const mappedValues = res.pharmacyproduct.map((product: any) => ({
        label: product.product_name,
        value: product.product_id,
      }));
      console.log(mappedValues)
      setDockValues(mappedValues);
    });
  };

  const validationSchema = yup.object().shape({
    boat_name: yup.string().required(),
    engine_1: yup.string().required(),
    engineYear_1: yup.string().required(),
    boat_hull: yup.string().required(),
    electric_plant: yup.string().required(),
    air_conditioner: yup.string().required(),
    pharmacy_id: yup.string().required(),
  });

  const recordBoat = (values: any) => {
    if (!boatImage) {
      showErrorToast("Debe poner una imagen");
      return;
    }

    if(dockSelected.length < 1) {
      showErrorToast("Debe seleccionar uno o varios muelles");
      return
    }

    setShowLoading(true);
    const url = "/boatsRecords/createBoatRecord";
    const urlEdit = `/boatsRecords/updateBoatRecordByUser/${values.id}`;
    const data = {
      boat_name: values.boat_name,
      engine_1: values.engine_1,
      engineYear_1: values.engineYear_1,
      engine_2: values.engine_2,
      engineYear_2: values.engineYear_2,
      engine_3: values.engine_3,
      engineYear_3: values.engineYear_3,
      engine_4: values.engine_4,
      engineYear_4: values.engineYear_4,
      engine_5: values.engine_5,
      engineYear_5: values.engineYear_5,
      engine_6: values.engine_6,
      engineYear_6: values.engineYear_6,
      boat_hull: values.boat_hull,
      electric_plant: values.electric_plant,
      air_conditioner: values.air_conditioner,
      pharmacy_id: values.pharmacy_id,
      user_id: route.params.id,
      docks: dockSelected.toString(),
      img: boatImage,
    };

    if (route.params.editMode) {
      sendData(urlEdit, data).then((response) => {
        hideLoadingModal(() => {
          if (response.ok) {
            showSuccessToast(response.message);
            redirectToMyBoats("Mal");
          } else {
            showErrorToast(response.message);
          } 
        });
      });
    } else {
      sendData(url, data).then((response) => {
        hideLoadingModal(() => {
          if (response.ok) {
            showSuccessToast(response.message);
            redirectToMyBoats("Bien");
          } else {
            showErrorToast(response.message);
          }
        });
      });
    }
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

  const showSuccessToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
    });
  };

  const redirectToMyBoats = (data: any) => {
    navigation.navigate("MyBoats", {refresh: data});
  };

  const incrementCounter = () => {
    engineInputsCounter < 6 && setEngineInputsCounter(engineInputsCounter + 1);
  };

  const decrementCounter = (setFieldValue: any) => {
    engineInputsCounter > 1 && setEngineInputsCounter(engineInputsCounter - 1);
    if (engineInputsCounter <= 2) {
      setFieldValue("engine_2", "");
      setFieldValue("engineYear_2", "");
    }

    if (engineInputsCounter <= 3) {
      setFieldValue("engine_3", "");
      setFieldValue("engineYear_3", "");
    }

    if (engineInputsCounter <= 4) {
      setFieldValue("engine_4", "");
      setFieldValue("engineYear_4", "");
    }

    if (engineInputsCounter <= 5) {
      setFieldValue("engine_5", "");
      setFieldValue("engineYear_5", "");
    }

    if (engineInputsCounter <= 6) {
      setFieldValue("engine_6", "");
      setFieldValue("engineYear_6", "");
    }
  };

  let openImagePickerAsync = async () => {
    Alert.alert(
      translation.t("alertInfoTitle"),
      "",
      [
        // {
        //   text: translation.t("profilePictureCameraText"), // Take picture
        //   onPress: () => {
        //     return setProfilePicture(1);
        //   },
        // },
        {
          text: translation.t("profilePictureGaleryText"), // Upload from galery
          onPress: () => {
            return setProfilePicture(2);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const setProfilePicture = async (type: number) => {
    let result: any;

    if (type === 2) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false, // Solo permitir la selección de una imagen
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setBoatImage(result.assets[0].uri);
      }
    }

    if (type === 1) {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(translation.t("profilePictureGaleryPermissionText"));
        return;
      }

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setBoatImage(result.assets.uri);
      }
    }
  };

  return (
    <Container
      style={{ backgroundColor: "#fff", height: "95%" }}
      keyboard={true}
    >
      <HeaderComponent navigation={navigation} />
      <Loading showLoading={showLoading} translation={translation} />
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values: any) => recordBoat(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }: any) => (
          <View>
            <ScrollView style={{ padding: 10, height: "80%" }}>
              <View style={{}}>
                <Text style={styles.labelInput}>Boat name</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("boat_name")}
                  onBlur={handleBlur("boat_name")}
                  value={values.boat_name}
                />

                <Text style={styles.labelInput}>Boat hull</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("boat_hull")}
                  onBlur={handleBlur("boat_hull")}
                  value={values.boat_hull}
                />
                <Text style={styles.labelInput}>Electric plant</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("electric_plant")}
                  onBlur={handleBlur("electric_plant")}
                  value={values.electric_plant}
                />
                <Text style={styles.labelInput}>Air conditioner</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  style={styles.textArea}
                  onChangeText={handleChange("air_conditioner")}
                  onBlur={handleBlur("air_conditioner")}
                  value={values.air_conditioner}
                />
                <Text style={styles.labelInput}>Boat Image</Text>

                <TouchableOpacity
                  style={{
                    marginVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "35%",
                    borderWidth: 1,
                    borderColor: "rgba(0, 0, 0, 0.2)",
                  }}
                  onPress={async () => {
                    openImagePickerAsync();
                  }}
                >
                  <Image
                    source={{ uri: boatImage ? boatImage : null }}
                    style={styles.profilePicture}
                  />
                </TouchableOpacity>

                <View>
                  <Text style={styles.labelInput}>
                    {translation.t("Marine")}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={pharmacyValues}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={translation.t("ChooseMarine")}
                    searchPlaceholder="Search..."
                    value={values.pharmacy_id}
                    onChange={(items: any) => {
                      setFieldValue("pharmacy_id", items.value);
                      searchDock(items.value);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>

                <View>
                  <Text style={styles.labelInput}>
                    {translation.t("Docks")}
                  </Text>
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dockValues}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={translation.t("ChooseDocks")}
                    searchPlaceholder="Search..."
                    value={dockSelected}
                    onChange={(items: any) => {
                      setDockSelected(items)
                      console.log(items)
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                      />
                    )}
                    renderItem={(item: any) => (
                      <View style={styles.item}>
                        <Text style={styles.selectedTextStyle}>
                          {item.label}
                        </Text>
                        <AntDesign
                          style={styles.icon}
                          color="black"
                          name="Safety"
                          size={20}
                        />
                      </View>
                    )}
                    renderSelectedItem={(item, unSelect) => (
                      <TouchableOpacity
                        onPress={() => unSelect && unSelect(item)}
                      >
                        <View style={styles.selectedStyle}>
                          <Text style={styles.textSelectedStyle}>
                            {item.label}
                          </Text>
                          <AntDesign color="black" name="delete" size={17} />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>

              <View style={{}}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.labelInput}>Engine 1</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => decrementCounter(setFieldValue)}
                    >
                      <Octicons name="dash" size={30} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => incrementCounter()}
                    >
                      <AntDesign name="pluscircle" size={30} color="green" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("engine_1")}
                  onBlur={handleBlur("engine_1")}
                  value={values.engine_1}
                />

                <Text style={styles.labelInput}>
                  {translation.t("Year") + " 1"}
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={handleChange("engineYear_1")}
                  onBlur={handleBlur("engineYear_1")}
                  value={values.engineYear_1}
                  keyboardType="numeric"
                />

                {engineInputsCounter >= 2 && (
                  <>
                    <Text style={styles.labelInput}>
                      {translation.t("Engine") + " 2"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engine_2")}
                      onBlur={handleBlur("engine_2")}
                      value={values.engine_2}
                    />
                    <Text style={styles.labelInput}>
                      {translation.t("Year") + " 2"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engineYear_2")}
                      onBlur={handleBlur("engineYear_2")}
                      value={values.engineYear_2}
                      keyboardType="numeric"
                    />
                  </>
                )}

                {engineInputsCounter >= 3 && (
                  <>
                    <Text style={styles.labelInput}>
                      {translation.t("Engine") + " 3"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engine_3")}
                      onBlur={handleBlur("engine_3")}
                      value={values.engine_3}
                    />
                    <Text style={styles.labelInput}>
                      {translation.t("Year") + " 3"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engineYear_3")}
                      onBlur={handleBlur("engineYear_3")}
                      value={values.engineYear_3}
                      keyboardType="numeric"
                    />
                  </>
                )}

                {engineInputsCounter >= 4 && (
                  <>
                    <Text style={styles.labelInput}>
                      {translation.t("Engine") + " 4"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engine_4")}
                      onBlur={handleBlur("engine_4")}
                      value={values.engine_4}
                    />
                    <Text style={styles.labelInput}>
                      {translation.t("Year") + " 4"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engineYear_4")}
                      onBlur={handleBlur("engineYear_4")}
                      value={values.engineYear_4}
                      keyboardType="numeric"
                    />
                  </>
                )}

                {engineInputsCounter >= 5 && (
                  <>
                    <Text style={styles.labelInput}>
                      {translation.t("Engine") + " 5"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engine_5")}
                      onBlur={handleBlur("engine_5")}
                      value={values.engine_5}
                    />
                    <Text style={styles.labelInput}>
                      {translation.t("Year") + " 5"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engineYear_5")}
                      onBlur={handleBlur("engineYear_5")}
                      value={values.engineYear_5}
                      keyboardType="numeric"
                    />
                  </>
                )}

                {engineInputsCounter >= 6 && (
                  <>
                    <Text style={styles.labelInput}>
                      {translation.t("Engine") + " 6"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engine_6")}
                      onBlur={handleBlur("engine_6")}
                      value={values.engine_6}
                    />
                    <Text style={styles.labelInput}>
                      {translation.t("Year") + " 6"}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={handleChange("engineYear_6")}
                      onBlur={handleBlur("engineYear_6")}
                      value={values.engineYear_6}
                      keyboardType="numeric"
                    />
                  </>
                )}
              </View>
            </ScrollView>

            <View style={{ height: "20%", padding: 10 }}>
              <TouchableOpacity
                style={
                  isValid
                    ? styles.registerButton
                    : styles.registerButtonDisabled
                }
                disabled={!isValid}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text style={styles.registerButtonText}>
                  {translation.t("Save")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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
    // backgroundColor: '#fff',
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 16,
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
  addButton: {
    marginVertical: 20,
    fontSize: 20,
    padding: 5,
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
  textArea: {
    borderColor: "#F7F7F7",
    borderWidth: 2,
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingRight: 45,
    paddingLeft: 20,
    textAlignVertical: "top", // Alineación vertical del texto
    minHeight: 100, // Altura mínima del área de texto
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
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  profilePicture: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
});
