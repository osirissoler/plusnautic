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
// import { ImagePicker } from 'expo-image-multiple-picker'

import { string } from "yup";
import asyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = yup.object().shape({
  description: yup.string().required("Description is required"),
  // senderFaxNumber: yup.string().required('Sender fax number is required'),
  // senderEmail: yup.string().email('Please enter valid sender email').required('Sender email is required'),
  // receiverName: yup.string().required('Receiver name is required'),
  // receiverFaxNumber: yup.string().required('Receiver fax number is required'),
  // receiverEmail: yup.string().email('Please enter valid receiver email').required('Receiver email is required')
});

export default function ServiceScreen({ navigation }: any) {
  const { translation } = React.useContext(LanguageContext);
  const [typeServices, setTypeServices] = useState([]);
  const [fetching, setFetching]: any = useState(false);
  const [user_id, setUser_id] = useState(true);
  const [apartment_id, setApartment_id] = useState(0);
  const [listProducts, setListProducts]: any = useState([]);
  const [showLoading, setShowLoading]: any = useState(false);

  useEffect(() => {
    checkLoggedUser(
      (id: string) => {
        setShowLoading(true);
        const url = `/user/getUserById/${id}`;
        const data = { user_id: id };
        sendData(url, data).then((response) => {
          if (response.ok) {
            setShowLoading(false);
          } else {
            hideLoadingModal(() => {
              logout();
            });
          }
        });
      },
      navigation,
      translation
    );
  }, []);

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

  const hideLoadingModal = (callback: Function) => {
    setTimeout(() => {
      setShowLoading(false);
      callback();
    }, 1500);
  };

  useEffect(() => {
    getTypeServices();
    // getProducts()
  }, []);

  const getTypeServices = async () => {
    setFetching(true);
    let url = `/services/getTypeService`;
    await fetchData(url).then((response) => {
      if (response.ok) {
        setTypeServices(response.services);
      }
    });
    setFetching(false);
  };
  return (
    <Container>
      <HeaderComponent />
      <Text style={styles.title}>{translation.t("TypeServices")}</Text>
      <View>
        {(Object.keys(typeServices).length > 0 && (
          <FlatList
            style={{ height: "85%" }}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            refreshing={fetching}
            data={typeServices}
            onRefresh={getTypeServices}
            renderItem={({ item }: any) => (
              <View style={{ width: "32%" }}>
                <ServiceComponent
                  title={
                    (translation.locale.includes("en") && item.name) ||
                    (translation.locale.includes("es") && item.nombre) || (translation.locale.includes("fr") && item.nom)
                  }
                  icon={item.img}
                  navigation={navigation}
                  id={item.id}
                  user_id={user_id}
                  product_id={apartment_id}
                />
              </View>
            )}
            numColumns={3}
          ></FlatList>
        )) || (
          <Text style={styles.title}>
            {
              translation.t(
                "homeNoCategoriestext"
              ) /* There are no active categories... */
            }
          </Text>
        )}
      </View>
    </Container>
  );
}

function ServiceComponent({
  title,
  icon,
  id,
  user_id,
  product_id,
  navigation,
}: any) {
  const { translation } = React.useContext(LanguageContext);
  const [showModal, setShowModal]: any = useState(false);

  const [isSelecting, setIsSelecting]: any = useState(false);
  const [showLoading, setShowLoading]: any = useState(false);
  const [images, setImages]: any = useState([]);
  const [refre, setRefre]: any = useState(false);
  const [countImages, setCountImages] = useState(true);

  const closeModal = () => {
    setImages([]);
    setShowModal(false);
  };

  // let openImagePickerAsync = async () => {
  // 	setIsSelecting(true);
  // 	Alert.alert(
  // 		translation.t('alertInfoTitle'),
  // 		'',
  // 		[
  // 			{
  // 				text: translation.t('profilePictureCameraText'), // Take picture
  // 				onPress: () => pickImg(1)
  // 			},
  // 			{
  // 				text: translation.t('profilePictureGaleryText'), // Upload from galery
  // 				onPress: () => pickImg(2)
  // 			}
  // 		],
  // 		{ cancelable: true, onDismiss: () => setIsSelecting(false) }
  // 	);
  // };

  // const send = async (values: any) => {
  // 	checkStorage('TOKEN', async (token: any) => {
  // 		if (images.length == 0) {
  // 			setCountImages(false)
  // 		} else {
  // 			setCountImages(true)
  // 		}

  // 		let url = /services/createService
  // 		const data = {
  // 			...values,
  // 			typeServices_id: id,
  // 			pharmacy_id: 536,
  // 			user_id: user_id,
  // 			product_id: product_id,
  // 			token: token
  // 		}
  // 		if (images.length >= 1) {
  // 			await sendData(url, data).then((response) => {
  // 				if (response.ok) {
  // 					sendFile(response.services.id)
  // 					setShowLoading(true)
  // 				}
  // 			})
  // 		}

  // 	})
  // }

  // const sendFile = async (id: any) => {
  // 	const url = /services/saveImagesServices/${id}
  // 	images.forEach(async (element: any) => {
  // 		let fileName = element.uri.split('/').pop();
  // 		let match = /\.(\w+)$/.exec(fileName);
  // 		let fileType = match ? image/${match[1]} : image;

  // 		let formData = new FormData();
  // 		formData.append('image', { uri: element.uri, name: fileName, fileType });
  // 		const data = formData
  // 		await sendData(url, data).then((response) => {
  // 			// if (response.ok) {
  // 			// 	console.log('llego', response)
  // 			// }

  // 		});
  // 	});

  // 	setTimeout(() => {
  // 		setImages([])
  // 		setShowLoading(false);
  // 		setShowModal(false)
  // 		showErrorToast('The service has been sent successfully')
  // 	}, 1500);
  // }
  const showErrorToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      containerStyle: { backgroundColor: "green", width: "80%" },
    });
  };
  // const pickImg = async (type: number) => {
  // 	let newImages: any = []
  // 	let result;
  // 	if (type == 2) {
  // 		result = await ImagePicker.launchImageLibraryAsync({
  // 			mediaTypes: ImagePicker.MediaTypeOptions.Images,
  // 			allowsEditing: false,
  // 			allowsMultipleSelection: true,
  // 			selectionLimit: 10,
  // 			aspect: [4, 3],
  // 			quality: 1,
  // 		})
  // 		// newImages.push({ uri: result.uri })
  // 		// setImages(newImages)
  // 		// setRefre(true)

  // 		if (!result.cancelled) {
  // 			if (result.selected) {
  // 				result.selected.forEach(E => {
  // 					newImages.push({ uri: E.uri })
  // 				})
  // 			} else {
  // 				newImages.push({ uri: result.uri })
  // 			}
  // 			setImages(newImages)
  // 			setRefre(true)
  // 		}
  // 	}

  // 	if (type == 1) {
  // 		let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  // 		if (permissionResult.granted === false) {
  // 			alert(translation.t('profilePictureGaleryPermissionText'));
  // 			return;
  // 		}
  // 		result = await ImagePicker.launchCameraAsync({
  // 			mediaTypes: ImagePicker.MediaTypeOptions.Images,
  // 			allowsEditing: true,
  // 			aspect: [4, 3],
  // 			quality: 1
  // 		});
  // 		if (!result.cancelled) {
  // 			newImages.push({ uri: result.uri })
  // 			setImages(newImages)
  // 			setRefre(true)
  // 		}
  // 	}

  // }

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => {
            navigation.navigate("Solicitudes", { id: id, title });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ height: 60, width: 60, marginBottom: 10 }}>
              <Image
                source={{ uri: icon }}
                style={{ flex: 1, resizeMode: "contain" }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.productTitle}>{title}</Text>
      </View>
    </>
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
    // backgroundColor: '#F7F7F7',
    // borderRadius: 60,
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
    marginTop: 10,
  },
  textInput: {
    height: 150,
    width: "100%",
    borderColor: "rgba(17, 115, 155, 0.2)",
    borderWidth: 2,
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
});