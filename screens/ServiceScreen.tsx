import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, TextInput, ScrollView, Alert, ImageBackground, FlatList, Image } from 'react-native';
import HeaderComponent from '../components/Header';
import { checkLoggedUser, checkStorage, Container, Loading } from '../components/Shared';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { LanguageContext } from '../LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { fetchData, sendData } from '../httpRequests';
import Toast from 'react-native-root-toast';
import { AntDesign } from '@expo/vector-icons';
// import { ImagePicker } from 'expo-image-multiple-picker'


import { string } from 'yup';
import asyncStorage from '@react-native-async-storage/async-storage';


const validationSchema = yup.object().shape({
	description: yup.string().required('Description is required'),
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
	const [user_id, setUser_id] = useState(true)
	const [apartment_id, setApartment_id] = useState(0)
	const [listProducts, setListProducts]: any = useState([]);
	const [showLoading, setShowLoading]: any = useState(false)

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
					logout()
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
		getTypeServices()
		// getProducts()
	}, [])

	
	const getTypeServices = async () => {
		setFetching(true)
		let url = `/services/getTypeService`
		await fetchData(url).then((response) => {
			if (response.ok) {
				setTypeServices(response.services)
			}

		})
		setFetching(false)
	}
	return (
		<Container>
			<HeaderComponent />
			<Text style={styles.title}>{translation.t("BottomTabServiceText")}</Text>

			<View>
				{(Object.keys(typeServices).length > 0 && (
					<FlatList
						style={{ height: '85%' }}
						columnWrapperStyle={{ justifyContent: 'space-around' }}
						refreshing={fetching}
						data={typeServices}
						onRefresh={getTypeServices}
						renderItem={({ item }: any) => (
							<View style={{width:'32%'}}>
								<ServiceComponent
									title={(translation.locale.includes('en') && item.name) || translation.locale.includes('es') && item.nombre}
									icon={item.img}
									navigation={navigation}
									id={item.id}
									user_id={user_id}
									product_id={apartment_id}
								/>
							</View>
						)}
						numColumns={3}
					>
					</FlatList>
				)) || (
					<View style={{justifyContent: "center", alignItems: "center"}}>
						<Text style={{ fontSize: 16, fontWeight: "500" }}>
							{translation.t('homeNoCategoriestext') /* There are no active categories... */}
						</Text>
					</View>
					)}
			</View>
		</Container>
	);
}

function ServiceComponent({ title, icon, id, user_id, product_id, navigation }: any) {

	const { translation } = React.useContext(LanguageContext);
	const [showModal, setShowModal]: any = useState(false);

	const [isSelecting, setIsSelecting]: any = useState(false);
	const [showLoading, setShowLoading]: any = useState(false);
	const [images, setImages]: any = useState([]);
	const [refre, setRefre]: any = useState(false);
	const [countImages, setCountImages] = useState(true)

	const closeModal = () => {
		setImages([])
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

	// 		let url = `/services/createService`
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
	// 	const url = `/services/saveImagesServices/${id}`
	// 	images.forEach(async (element: any) => {
	// 		let fileName = element.uri.split('/').pop();
	// 		let match = /\.(\w+)$/.exec(fileName);
	// 		let fileType = match ? `image/${match[1]}` : `image`;

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
			containerStyle: { backgroundColor: 'green', width: '80%' }
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
			<View style={{ alignItems: 'center', }}>
				<TouchableOpacity style={styles.productCard} onPress={() => {navigation.navigate('Solicitudes', {id:id, title})}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
						<View style={{ height: 50, width: 50, marginBottom: 10,  }}>
							<Image source={{ uri: icon }} style={{ flex: 1, resizeMode: 'contain' }} />
						</View>
					</View>
				</TouchableOpacity>
				<Text style={styles.productTitle}>{title}</Text>
			</View>

			{/* <Modal visible={showModal} animationType='slide'>
				<Loading showLoading={showLoading} translation={translation} />
				<View style={{ paddingVertical: 50, paddingHorizontal: 10 }}>
					<View style={{ position: 'relative', justifyContent: 'center', height: '5%', }}>
						<Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
							{title}
						</Text>
						<TouchableOpacity style={{ position: 'absolute', right: 0, borderRadius: 50, height: 24, width: 24 }}>
							<AntDesign name="closecircle" size={24} color="red" onPress={() => closeModal()} />
						</TouchableOpacity>
					</View>

					<View style={{ height: '90%' }}>
						{(countImages == false) ? <Text style={{ color: 'red' }}>Imagen es obligatoria</Text> : <Text></Text>}

						<TouchableOpacity style={{
							height: '10%',
							borderColor: 'rgba(0, 0, 0, 0.3)',
							borderWidth: 1,
							borderStyle: 'dashed',
							marginTop: 0,
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: 10
						}} onPress={() => openImagePickerAsync()}>
							<FontAwesome name='file-image-o' size={20} color={'rgba(0, 0, 0, 0.3)'} />
							<Text >Select image</Text>
						</TouchableOpacity>

						<View style={{ maxHeight: '40%' }}>
							{(Object.keys(images).length > 0 && (
								<FlatList
									refreshing={refre}
									style={{ backgroundColor: 'powderblue' }}
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
									contentContainerStyle={{
										borderColor: 'rgba(0, 0, 0, 0.3)',
										borderWidth: 1,
										borderStyle: 'dashed',
									}}
									numColumns={4}
								/>
							))}
						</View>
						<View style={{ maxHeight: '60%' }}>
							<Formik
								validationSchema={validationSchema}
								initialValues={{
									description: '',
								}}
								onSubmit={(values) => { send(values) }}
							>
								{({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }) => (
									<ScrollView>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<View style={{ width: '100%' }}>
												<Text style={styles.labelInput}></Text>
												{touched.description && errors.description && (
													<Text style={{ color: 'red' }}>{errors.description}</Text>
												)}
												<Text style={styles.labelInput}>Description</Text>
												<TextInput
													style={styles.textInput}
													multiline={true}
													numberOfLines={4}
													onChangeText={handleChange('description')}
													onBlur={handleBlur('description')}
													value={values.description}
													placeholder={'description of the problem'}
												/>
											</View>

										</View>

										<TouchableOpacity
											style={[
												{
													width: '100%',
													height: 50,
													backgroundColor: '#FB4F03',
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 10,
													marginTop: 40
												},
												!isValid && { backgroundColor: '#FB4F03' }
											]}
											onPress={() => handleSubmit()}
										>
											<Text style={{ color: '#ffffff', fontSize: 18 }}>Send</Text>
										</TouchableOpacity>
									</ScrollView>
								)}
							</Formik>
						</View>
					</View>

				</View>
			</Modal> */}
		</>
	);
}

const styles = StyleSheet.create({
	title: {
		marginVertical: 20,
		fontSize: 18,
		textAlign: 'center',
		fontWeight: '700',
		color: '#000'
	},
	productCard: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#F7F7F7',
		borderRadius: 60,
		marginVertical: 10,
		width: 100,
		height: 100,
	},
	productIcon: {
		paddingRight: 20,
		color: '#FB4F03'
	},
	productTitle: {
		fontSize: 15,
		fontWeight: '400',
		textAlign: 'center'
	},
	productPrice: {
		fontSize: 16,
		fontWeight: '500'
	},
	productAdd: {
		borderColor: 'rgba(0, 0, 0, 0.2)',
		borderWidth: 1,
		height: 20,
		width: 20,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},
	productAddIcon: {
		color: '#ffffff'
	},
	labelInput: {
		fontSize: 15,
		color: '#8B8B97',
		marginTop: 10
	},
	textInput: {
		height: 150,
		width: '100%',
		borderColor: 'rgba(17, 115, 155, 0.2)',
		borderWidth: 2,
		backgroundColor: '#FFFFFF',
		paddingRight: 35,
		paddingLeft: 20,
		borderRadius: 5,
		marginBottom: 10
	},
	profilePicture: {
		height: 400,
		width: '100%',

	},

	productCard2: {

		padding: 8,
		marginVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		flexDirection: 'row',
		// justifyContent: 'space-around',
		alignItems: 'center'
	},

	productImage: {
		backgroundColor: 'black',
		borderRadius: 10,
		height: 120,
		width: 120,
		marginRight: 10
	},



});
