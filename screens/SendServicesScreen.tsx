import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import HeaderComponent from "../components/Header";
import {
  checkLoggedUser,
  checkStorage,
  Container,
  Loading,
} from "../components/Shared";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { LanguageContext } from "../LanguageContext";
import * as ImagePicker from "expo-image-picker";
import { fetchData, sendData } from "../httpRequests";
import Toast from "react-native-root-toast";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";
let list: any[] = [];
export default function SendServicesScreen({ navigation, route }: any) {
  const [boatsRecord, setBoatsRecord]: any = useState([]);
  const [boatsRecord_id, setBoatsRecord_id]: any = useState(null);
  const { translation } = React.useContext(LanguageContext);
  const [isSelecting, setIsSelecting]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [images, setImages]: any = useState([]);
  const [refre, setRefre]: any = useState(false);

  const validationSchema = yup.object().shape({
    description: yup.string().required("Description is required"),
    // senderFaxNumber: yup.string().required('Sender fax number is required'),
    // senderEmail: yup.string().email('Please enter valid sender email').required('Sender email is required'),
    // receiverName: yup.string().required('Receiver name is required'),
    // receiverFaxNumber: yup.string().required('Receiver fax number is required'),
    // receiverEmail: yup.string().email('Please enter valid receiver email').required('Receiver email is required')
  });

  const send = async (item: any) => {
    if (boatsRecord_id != null) {
      setShowLoading(true);
      checkStorage("USER_LOGGED", async (id: any) => {
        checkStorage("TOKEN", async (token: any) => {
          let url = `/services/createService`;
          const data = {
            description: item.description,
            typeServices_id: route.params.id,
            user_id: id,
            boatsRecord_id: boatsRecord_id,
            token: token,
            product_id:87
          };
          await sendData(url, data).then((response) => {
            sendFile(response.services.id);
            // if (response.ok) { showErrorToast('The service has been sent successfully') }
            // navigation.goBack()
          });
        });
      });
    } else {
      alert("Please select a boat");
    }
    // setShowLoading(false)
  };
  useEffect(() => {
    getBoatRecordByUser();
  }, []);

  const getBoatRecordByUser = async () => {
    checkStorage("USER_LOGGED", async (id: any) => {
      let url = `/boatsRecords/getBoatRecordByUser/${id}`;
      await fetchData(url).then((response) => {
        if (response.ok) {
          setBoatsRecord(response.boatsRecord);
        }
      });
    });
  };
  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
    });
  };

  const openImagePickerAsync = async () => {
    setIsSelecting(true);
    Alert.alert(
      translation.t("alertInfoTitle"),
      "",
      [
        // {
        //     text: translation.t('profilePictureCameraText'), // Take picture
        //     // onPress: () => pickImg(1)
        // },
        {
          text: translation.t("profilePictureGaleryText"), // Upload from galery
          onPress: () => pickImg(2),
        },
      ],
      { cancelable: true, onDismiss: () => setIsSelecting(false) }
    );
  };
  const pickImg = async (type: number) => {
    let newImages: any = [];
    let result;
    if (type == 2) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        result.assets.forEach((asset: any) => {
          newImages.push({ uri: asset.uri });
        });
        setImages(newImages);
        setRefre(true);
      }
    }
  };

  const sendFile = async (id: any) => {
    const url = `/services/saveImagesServices/${id}`;
    images.forEach(async (element: any) => {
      let fileName = element.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName);
      let fileType = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append("image", { uri: element.uri, name: fileName, fileType });
      const data = formData;
      await sendData(url, data);
    });

    setTimeout(() => {
      setImages([]);
      setShowLoading(false);
      showErrorToast("The service has been sent successfully");
      navigation.goBack();
    }, 1500);
  };

  return (
    <Container>
      <Loading showLoading={showLoading} translation={translation} />
      <HeaderComponent />
      <View
        style={{ position: "relative", justifyContent: "center", height: "5%" }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {route.params.title}
        </Text>
      </View>

      <View style={{ maxHeight: "100%", marginHorizontal: 10 }}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            description: "",
            boatsRecord_id: "",
          }}
          onSubmit={(values) => {
            send(values);
          }}
        >
          {/* //TODO Crear la solicitud de servicios poner que se envie las fotos, description, bote, y el muelle */}
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
              <View style={{ maxHeight: "40%", backgroundColor: "white" }}>
                <TouchableOpacity
                  style={{
                    width: "30%",
                    height: 50,
                    backgroundColor: "#5f7ceb",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                  onPress={() => openImagePickerAsync()}
                >
                  <FontAwesome name="file-image-o" size={20} color={"white"} />
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Select image
                  </Text>
                </TouchableOpacity>

                <View style={{ maxHeight: "70%" }}>
                  {Object.keys(images).length > 0 && (
                    <FlatList
                      refreshing={refre}
                      style={{ marginTop: 4 }}
                      data={images}
                      renderItem={({ item }: any) => (
                        <TouchableOpacity>
                          <View>
                            <Image
                              source={{ uri: item.uri }}
                              style={{ width: 100, height: 100 }}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.uri}
                      numColumns={4}
                    />
                  )}
                </View>
              </View>
              <ScrollView style={{ maxHeight: "60%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <Text style={styles.labelInput}></Text>
                    {touched.description && errors.description && (
                      <Text style={{ color: "red" }}>{errors.description}</Text>
                    )}
                    <Text style={styles.labelInput}>Description</Text>
                    <TextInput
                      style={styles.textInput}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      value={values.description}
                      placeholder={"description of the problem"}
                    />
                  </View>
                </View>
                <View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    // iconStyle={styles.iconStyle}
                    iconColor={"#5f7ceb"}
                    data={boatsRecord}
                    search
                    maxHeight={300}
                    labelField="boat_name"
                    valueField={""}
                    placeholder="Seleciona  Bote"
                    searchPlaceholder="Search bote"
                    value={values.boatsRecord_id}
                    onChange={(items: any) => {
                      setBoatsRecord_id(items.id);
                    }}
                  />
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
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </Container>
  );
}
const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
    color: "#000",
  },
  productCard: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 60,
    marginVertical: 10,
    width: 100,
    height: 100,
  },
  productIcon: {
    paddingRight: 20,
    color: "#FB4F03",
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  productAdd: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  productAddIcon: {
    color: "#ffffff",
  },
  labelInput: {
    fontSize: 15,
    color: "#8B8B97",
  },
  textInput: {
    height: 150,
    width: "100%",
    borderColor: "#5f7ceb",
    borderWidth: 0.5,
    backgroundColor: "#FFFFFF",
    paddingRight: 35,
    paddingLeft: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  profilePicture: {
    height: 400,
    width: "100%",
  },

  productCard2: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    // justifyContent: 'space-around',
    alignItems: "center",
  },

  productImage: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 120,
    width: 120,
    marginRight: 10,
  },

  dropdown: {
    height: 50,
    marginBottom: 20,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    height: 50,
    width: "100%",
    borderColor: "#5f7ceb",
    borderWidth: 0.5,
    backgroundColor: "#FFFFFF",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 13,
    borderRadius: 5,
    marginBottom: 3,
  },
  selectedTextStyle: {
    height: 50,
    width: "100%",
    borderColor: "#5f7ceb",
    borderWidth: 0.5,
    backgroundColor: "#FFFFFF",
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
    // width: "100%",
    borderColor: "#F7F7F7",
    // borderWidth: 2,
    backgroundColor: "#F7F7F7",
    // paddingRight: 45,
    // paddingLeft: 20,
    // paddingTop:25,
    borderRadius: 5,
  },
});
