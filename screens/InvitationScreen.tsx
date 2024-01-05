import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import HeaderComponent from "../components/Header";
import { checkStorage, Container, Loading } from "../components/Shared";
import { fetchData, sendData, sendDataPut } from "../httpRequests";
import Toast from "react-native-root-toast";
import { LanguageContext } from "../LanguageContext";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Button } from "react-native-elements";
import moment from "moment";

export default function InvitationScreen({ navigation, route }: any) {
  const { editMode, dataToEdit } = route.params;
  const { translation } = React.useContext(LanguageContext);
  const [showLoading, setShowLoading]: any = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: dataToEdit?.title || "",
    description: dataToEdit?.description || "",
    boat_id: dataToEdit?.boat_id || "",
    product_id: dataToEdit?.product_id || "",
  });
  const [date, setDate] = useState(dataToEdit?.date || "");
  const [name, setName] = useState("");
  const [namesArray, setNamesArray]: any = useState([]);
  const [boat, setBoats] = useState([]);
  const [dockValues, setDockValues] = useState([]);
  const [filteredDocks, setFilteredDocks] = useState(editMode ? dataToEdit.docksId : []);

  useEffect(() => {
    searchDock();
    checkStorage("USER_LOGGED", async (id: any) => {
      const url = `/boatsRecords/geatBoatRecordByUser/${id}`;
      fetchData(url).then(async (res: any) => {
        const mappedValues = res.boatsRecord.map((boatsRecord: any) => ({
          label: boatsRecord.boat_name,
          value: boatsRecord.id,
          docks: boatsRecord.docks,
        }));
        setBoats(mappedValues);
      });
    });
  }, []);

  const searchDock = async () => {
    const url = `/products/getProducts`;
    fetchData(url).then(async (res: any) => {
      const mappedValues = await res.product.map((product: any) => ({
        label: product.name,
        value: product.id,
      }));
      await setDockValues(mappedValues);
    });
  };

  const filterDock = (docks: any) => {
        const data = docks.split(",").map((a: any) => dockValues.find((b: any) => b.value == a));
        setFilteredDocks(data);
        return data
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

  const createInvitation = (values: any) => {
    try {
      if (!date) {
        showErrorToast(translation.t("EnterDate"));
        return;
      }

      if (!moment(date, "DD/MM/YYYY", true).isValid()) {
        showErrorToast(translation.t("EnterValidDateFormat"));
        return;
      }

      const data = {
        title: values.title,
        description: values.description,
        date: date,
        name: namesArray,
        boat_id: values.boat_id,
        product_id: values.product_id,
      };

      const dataPut = {
        id: dataToEdit?.idGuest,
        title: values.title,
        description: values.description,
        date: date,
        boat_id: values.boat_id,
        product_id: values.product_id,
      }

      if (editMode) {
        const url = `/guest/updateGuest`;
        sendDataPut(url, dataPut).then((res) => {
          if (res.ok) {
            setShowLoading(true);
            hideLoadingModal(() => {
              showGoodToast(translation.t("sendRequestSuccess"));
              navigation.navigate("GuestScreen", {refresh: res});
            });
          }
        });
      } else {
        const url = `/guest/createGuest`;
        sendData(url, data).then((res) => {
          if (res.ok) {
            setShowLoading(true);
            hideLoadingModal(() => {
              showGoodToast(translation.t("sendRequestSuccess"));
              navigation.navigate("GuestScreen", {refresh: res});
            });
          }
        });
      }
    } catch (error) {
      showErrorToast(`${translation.t("sendRequestError"), error}`);
    }
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

  const handleDeleteName = () => {
    setNamesArray(namesArray.slice(0, -1));
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required(translation.t("TitleIsRequired")),
    description: yup.string().required(translation.t("DescriptionIsRequired")),
    boat_id: yup.string().required(translation.t("BoatIsRequired")),
    product_id: yup.string().required(translation.t("DockIsRequired")),
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
      style={{ backgroundColor: "#fff", height: "100%" }}
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
            <View
              style={{ padding: 15, height: `${!editMode ? "80%" : "67%"}` }}
            >
              <Text style={styles.labelInput}>{translation.t("Title")}</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
              />

              <Text style={styles.labelInput}>
                {translation.t("Description")}
              </Text>
              <TextInput
                style={styles.textInput}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />

              <View>
                <Text style={styles.labelInput}>{translation.t("Boats")}</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={boat}
                  value={editMode && boat.find((a: any) => a.value === dataToEdit?.boat_id)}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={translation.t("ChooseBoats")}
                  searchPlaceholder={translation.t("Search")}
                  onChange={(items: any) => {
                    setFieldValue("boat_id", items.value);
                    filterDock(items.docks);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color="#8B8B97"
                      name="Safety"
                      size={20}
                    />
                  )}
                />
              </View>

              <View>
                <Text style={styles.labelInput}>{translation.t("Docks")}</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={filteredDocks}
                  value={editMode && dockValues.find((a: any) => a.value === dataToEdit?.product_id)}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={translation.t("ChooseDocks")}
                  searchPlaceholder={translation.t("Search")}
                  onChange={(items: any) => {
                    setFieldValue("product_id", items.value);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color="#8B8B97"
                      name="tool"
                      size={20}
                    />
                  )}
                />
              </View>

              <Text style={styles.labelInput}>
                {translation.t("Date")} (DD/MM/YYYY)
              </Text>
              <TextInput
                placeholder="MM/DD/YYYY"
                style={styles.textInput}
                value={date}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
              />

                {!editMode && <View>
                  <Text style={styles.labelInput}>{translation.t("Name")}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={values.name}
                    onChangeText={(text) => setName(text)}
                    placeholder={translation.t("TypeName")}
                  />
                  <View
                    style={{
                      justifyContent: "space-between",
                      marginTop: 5,
                      height: "34%",
                    }}
                  >
                    <FlatList
                      data={namesArray}
                      renderItem={({ item }) => (
                        <View style={styles.item}>
                          <Text style={{ fontSize: 15 }}> ➤ {item}</Text>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      title={translation.t("Delete")}
                      buttonStyle={{ backgroundColor: "red", borderRadius: 8 }}
                      onPress={handleDeleteName}
                      style={{ marginTop: 15, width: "100%" }}
                    />
                    <Button
                      title={translation.t("add")}
                      buttonStyle={{ borderRadius: 8 }}
                      onPress={handleAddName}
                      style={{
                        marginTop: 15,
                        width: "100%",
                      }}
                    />
                  </View>
                </View>}
            </View>

            <View style={{ height: "20%", padding: 10, paddingHorizontal: 15 }}>
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
    height: "35%",
    backgroundColor: "#5f7ceb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,

  },
  registerButtonDisabled: {
    width: "100%",
    height: "35%",
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
    marginBottom: 15,
    backgroundColor: "#F7F7F7"
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#8B8B97",
  },
  selectedTextStyle: {
    fontSize: 16,
    backgroundColor: "#F7F7F7"
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
    padding: 5,
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
