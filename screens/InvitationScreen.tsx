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
  FlatList,
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
import { Button } from "react-native-elements";
import moment from "moment";

export default function InvitationScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [fetching, setFetching]: any = useState(false);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [namesArray, setNamesArray]: any = useState([]);
  const [boat, setBoats] = useState([]);

  useEffect(() => {
    checkStorage("USER_LOGGED", async (id: any) => {
      const url = `/boatsRecords/geatBoatRecordByUser/${id}`;
      fetchData(url).then(async (res: any) => {
        console.log(res);
        const mappedValues = res.boatsRecord.map((boatsRecord: any) => ({
          label: boatsRecord.boat_name,
          value: boatsRecord.id,
        }));
        console.log(mappedValues);
        setBoats(mappedValues);
      });
    });
  }, []);

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

  const createInvitation = (values: any) => {
    if (!date) {
      showErrorToast("Debes ingresa la fecha.");
      return;
    }

    if (!moment(date, "DD/MM/YYYY", true).isValid()) {
      showErrorToast("El formato de la fecha no es válido.");
      return;
    }

    const data = {
      title: values.title,
      description: values.description,
      date: date,
      name: namesArray,
      boat_id: values.boat_id,
    };
    const url = `/guest/createGuest`;
    sendData(url, data).then((res) => {
      if (res.ok) {
        setShowLoading(true);
        hideLoadingModal(() => {
            showGoodToast("Se ha enviado la solicitud correctamente.")
            navigation.navigate("Profile")
        });
      }
    });
  };

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };

  const handleAddName = () => {
    if (name) {
      setNamesArray([...namesArray, name]);
      setName("");
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Titulo es requerido"),
    description: yup.string().required("Descripcion es requerido"),
    boat_id: yup.string().required("El bote es requerido"),
  });

  const formatDate = (input: any) => {
    const numericValue = input.replace(/\D/g, "");
    // Aplicar formato MM/DD/YYYY
    let formattedDate = "";
    if (numericValue.length > 0) {
      formattedDate = numericValue.slice(0, 2);
      if (numericValue.length >= 3) {
        formattedDate += "/" + numericValue.slice(2, 4);
      }
      if (numericValue.length >= 5) {
        formattedDate += "/" + numericValue.slice(4, 8);
      }
    }
    return formattedDate;
  };

  const handleDateChange = (input: any) => {
    const formattedDate = formatDate(input);
    setDate(formattedDate);
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
        onSubmit={(values: any) => createInvitation(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          isValid,
          errors,
          touched,
        }: any) => (
          <View>
            <View style={{ padding: 15, height: "80%" }}>
              <Text style={styles.labelInput}>Title</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.boat_name}
              />

              <Text style={styles.labelInput}>Description</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />

              <View>
                <Text style={styles.labelInput}>{translation.t("Docks")}</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={boat}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={translation.t("ChooseMarine")}
                  searchPlaceholder="Search..."
                  value={values.id}
                  onChange={(items: any) => {
                    setFieldValue("boat_id", items.value);
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

              <Text style={styles.labelInput}>Date (DD/MM/YYYY)</Text>
              <TextInput
                placeholder="MM/DD/YYYY"
                style={styles.textInput}
                value={date}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />

              <View>
                <Text style={styles.labelInput}>Names</Text>
                <TextInput
                  style={styles.textInput}
                  value={values.name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Ingresa un nombre"
                />
                <Button
                  title="Añadir"
                  onPress={handleAddName}
                  style={{ marginTop: 15 }}
                />
              </View>

              <View style={styles.container}>
                <FlatList
                  data={namesArray}
                  renderItem={({ item }) => (
                    <View style={styles.item}>
                      <Text style={{ fontSize: 15 }}> - {item}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>

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
  container: {
    backgroundColor: "#fff",
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
    marginHorizontal: 15,
    backgroundColor: "gray",
    borderRadius: 10,
    paddingBottom: 40,
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
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
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
