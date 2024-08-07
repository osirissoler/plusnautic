import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Platform,
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
import RNDateTimePicker from "@react-native-community/datetimepicker";

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
  // const [date, setDate] = useState(dataToEdit?.date || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [namesArray, setNamesArray]: any = useState([]);
  const [boat, setBoats] = useState([]);
  const [dockValues, setDockValues] = useState([]);
  const [filteredDocks, setFilteredDocks] = useState(
    editMode ? dataToEdit.docksId : []
  );
  const [historialGuest, setHistorialGuest] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios"); // Para iOS, siempre muestra el selector de fecha
    setDate(currentDate);
  };

  useEffect(() => {
    if (dataToEdit) {
      const [month, day, year] = dataToEdit?.date.split("/");
      const fechaObj = new Date(`${year}-${month}-${day}T10:00:00.00Z`);
      console.log(fechaObj);
      setDate(fechaObj);
    }
  }, []);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    try {
      searchDock();
      checkStorage("USER_LOGGED", async (id: any) => {
        getHistorialGuest(id);
        getBoatRecord(id);
      });
    } catch (error) {
      showErrorToast("httpConnectionError");
      setShowLoading(false);
    }
  }, []);

  const getBoatRecord = (id: any) => {
    const url = `/boatsRecords/getBoatRecordByUser/${id}`;
    fetchData(url).then(async (res: any) => {
      const mappedValues = res.boatsRecord.map((boatsRecord: any) => ({
        label: boatsRecord.boat_name,
        value: boatsRecord.id,
        dock: boatsRecord.dock,
      }));
      setBoats(mappedValues);
    });
  };

  const searchDock = async () => {
    const url = `/products/getPharmacyProducts`;
    fetchData(url).then(async (res: any) => {
      const mappedValues = await res.pharmacyProduct.map((product: any) => ({
        label: product.product_name,
        value: product.product_id,
      }));
      await setDockValues(mappedValues);
    });
  };

  const filterDock = (dockId: any) => {
    const data = dockValues.find((a: any) => a.value == dockId);
    console.log(dockId);
    setFilteredDocks([data]);
    return data;
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

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1000);
  };

  const createInvitation = (values: any) => {
    try {
      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0);

      if (!date) {
        showErrorToast(translation.t("EnterDate"));
        return;
      }

      if (currentDate.getTime() > date.getTime()) {
        console.log(date.getTime())
        showErrorToast(translation.t("DateAfterTodayMsg"));
        return;
      }

      if (!editMode) {
        if (namesArray.length <= 0) {
          showErrorToast(translation.t("DateAfterTodayMsg"));
          return;
        }
      }

      const data = {
        title:
          values.title.charAt(0).toUpperCase() +
          values.title.slice(1).toLowerCase(),
        description: values.description,
        date: moment(date).format("MM/DD/YYYY"),
        guestDetails: namesArray,
        boat_id: values.boat_id,
        product_id: filteredDocks[0].value,
      };

      const dataPut = {
        id: dataToEdit?.idGuest,
        title:
          values.title.charAt(0).toUpperCase() +
          values.title.slice(1).toLowerCase(),
        description: values.description,
        date: moment(date).format("MM/DD/YYYY"),
        boat_id: values.boat_id,
        product_id: filteredDocks[0].value,
      };

      if (editMode) {
        setShowLoading(true);
        const url = `/guest/updateGuest`;
        sendDataPut(url, dataPut).then((res) => {
          if (res.ok) {
            hideLoadingModal(() => {
              showGoodToast(translation.t("sendRequestSuccess"));
              navigation.navigate("GuestScreen", { refresh: res });
            });
          } else {
            showErrorToast(res.message);
            setShowLoading(false);
          }
        });
      } else {
        setShowLoading(true);
        const url = `/guest/createGuest`;
        sendData(url, data).then((res) => {
          if (res.ok) {
            hideLoadingModal(() => {
              showGoodToast(translation.t("sendRequestSuccess"));
              navigation.navigate("GuestScreen", { refresh: res });
            });
          } else {
            showErrorToast(res.message);
            setShowLoading(false);
          }
        });
      }
    } catch (error) {
      showErrorToast(`${(translation.t("sendRequestError"), error)}`);
    }
  };

  const handleAddName = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name) {
      if (email || phone) {
        if (emailRegex.test(email)) {
          setNamesArray([...namesArray, { name, email, phone }]);
          setName("");
          setEmail("");
          setPhone("");
        } else {
          showErrorToast(translation.t("AddGuestEmailInvalid"));
        }
      } else {
        showErrorToast(translation.t("AddGuestErrorMsg"));
      }
    }
  };

  const handleDeleteName = () => {
    setNamesArray(namesArray.slice(0, -1));
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required(translation.t("TitleIsRequired")),
    description: yup.string().required(translation.t("DescriptionIsRequired")),
    boat_id: yup.string().required(translation.t("BoatIsRequired")),
    // product_id: yup.string().required(translation.t("DockIsRequired")),
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
    // setDate(formattedDate);
  };

  const getHistorialGuest = async (id: any) => {
    const url = `/guest/getHistorialGuest/${id}`;
    fetchData(url).then((res) => {
      if (res.ok) {
        setHistorialGuest(res.historialGuest);
      }
    });
  };

  return (
    <Container keyboard={true}>
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
          x,
        }: any) => (
          <View>
            <View
              style={{ padding: 15, height: `${!editMode ? "86%" : "80%"}` }}
            >
              <ScrollView>
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
                  style={[styles.textInput, { height: 80 }]}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  multiline={true}
                />

                <View>
                  <Text style={styles.labelInput}>
                    {translation.t("Boats")}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={boat}
                    value={
                      editMode &&
                      boat.find((a: any) => a.value === dataToEdit?.boat_id)
                    }
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={translation.t("ChooseBoats")}
                    searchPlaceholder={translation.t("Search")}
                    onChange={(items: any) => {
                      setFieldValue("boat_id", items.value);
                      filterDock(items.dock);
                    }}
                  />
                </View>

                <View>
                  <Text style={styles.labelInput}>
                    {translation.t("Docks")}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={filteredDocks}
                    value={filteredDocks[0]}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={translation.t("ChooseDocks")}
                    searchPlaceholder={translation.t("Search")}
                    onChange={(items: any) => {
                      // setFieldValue("product_id", items.value);
                    }}
                  />
                </View>

                <Text style={styles.labelInput}>{translation.t("Date")}</Text>

                <Text
                  style={{
                    fontSize: 15,
                    marginVertical: 10,
                    fontWeight: "600",
                  }}
                >
                  {moment(date).format("MM/DD/YYYY")}
                </Text>
                <View>
                  {Platform.OS === "android" && (
                    <View>
                      <TouchableOpacity
                        style={{
                          height: 40,
                          backgroundColor: "#5f7ceb",
                          borderRadius: 10,
                          padding: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={showDatepicker}
                      >
                        <Text
                          style={[
                            styles.registerButtonText,
                            { fontWeight: "500" },
                          ]}
                        >
                          {translation.t("ShowDatePicker")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {Platform.OS === "android" ? (
                    showDatePicker && (
                      <RNDateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                      />
                    )
                  ) : (
                    <RNDateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
                {!editMode && (
                  <View>
                    <View
                      style={{
                        width: "100%",
                        paddingTop: 30,
                        height: "100%",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        {translation.t("addGuests")}
                      </Text>
                      <View>
                        <Text style={styles.labelInput}>
                          {translation.t("FullName")}
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          value={name}
                          onChangeText={(text) => setName(text)}
                          placeholder={translation.t("TypeName")}
                        />
                        <Text style={styles.labelInput}>Email</Text>
                        <TextInput
                          style={styles.textInput}
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                          }}
                          placeholder={translation.t("TypeEmail")}
                          autoCapitalize="none"
                        />
                        <Text style={styles.labelInput}>
                          {translation.t("Phone")}
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          value={phone}
                          onChangeText={(text) => {
                            setPhone(text);
                          }}
                          placeholder={translation.t("TypePhone")}
                          keyboardType="numeric"
                        />

                        <Text style={styles.labelInput}>
                          {translation.t("guestHistory")}
                        </Text>
                        <Dropdown
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={historialGuest}
                          search
                          maxHeight={300}
                          labelField="fullName"
                          valueField="value"
                          placeholder={translation.t("addGuest")}
                          searchPlaceholder={translation.t("Search")}
                          onChange={(items: any) => {
                            const foundArr = namesArray.find(
                              (a: any) =>
                                a.name == items.fullName &&
                                a.email == items.email &&
                                a.phone == items.phone
                            );
                            if (foundArr) {
                              return;
                            }
                            setNamesArray([
                              ...namesArray,
                              {
                                name: items.fullName,
                                email: items.email,
                                phone: items.phone,
                              },
                            ]);
                          }}
                        />
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            title={translation.t("Delete")}
                            buttonStyle={{
                              backgroundColor: "#DF4D49",
                              borderRadius: 10,
                              padding: 10,
                            }}
                            onPress={handleDeleteName}
                            style={{ marginTop: 15, width: "100%" }}
                          />
                          <Button
                            title={translation.t("add")}
                            buttonStyle={{
                              borderRadius: 10,
                              backgroundColor: "#5f7ceb",
                              padding: 10,
                            }}
                            onPress={handleAddName}
                            style={{
                              marginTop: 15,
                              width: "100%",
                            }}
                          />
                        </View>
                        {namesArray.map((item: any, key: any) => (
                          <View key={key} style={styles.item}>
                            <Text style={{ fontSize: 15 }}>
                              ➤
                              <Text style={{ fontWeight: "500" }}>
                                {translation.t("FullName")}:{" "}
                              </Text>
                              {item.name}
                            </Text>
                            {item.email && (
                              <Text style={{ fontSize: 15, paddingLeft: 15 }}>
                                <Text style={{ fontWeight: "500" }}>
                                  Email:{" "}
                                </Text>
                                {item.email}
                              </Text>
                            )}
                            {item.phone && (
                              <Text style={{ fontSize: 15, paddingLeft: 15 }}>
                                <Text style={{ fontWeight: "500" }}>
                                  {translation.t("Phone")}:
                                </Text>

                                {item.phone}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
            <View style={{ paddingHorizontal: 10 }}>
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
  },
  registerButtonDisabled: {
    width: "100%",
    height: 50,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
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
    marginBottom: 3,
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

  profilePicture: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  item: {
    padding: 5,
  },
});
