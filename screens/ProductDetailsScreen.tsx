import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, Alert, TouchableOpacity, Modal, FlatList, Linking } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { fetchData, sendData } from '../httpRequests';
import { checkLoggedUser, checkStorage, Loading } from '../components/Shared';
import Toast from 'react-native-root-toast';
import { LanguageContext } from '../LanguageContext';
import { formatter } from '../utils';
import ImageViewer from 'react-native-image-zoom-viewer';
import axios from 'axios';
import WebView from 'react-native-webview';


export default function ProductDetailsScreen({ navigation, route }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [product, setProduct]: any = useState({});
	const [productPrice, setProductPrice]: any = useState(0.0);
	const [productQuantity, setProductQuantity]: any = useState(1);
	const [showLoading, setShowLoading]: any = useState(false);
	const [showModalImagen, setShowModalImagen]: any = useState(false);
	const [product_imgs, setProduct_imgs]: any = useState([]);
	const [product_img, setProduct_img]: any = useState({});
	const [index, setIndex]: any = useState(0);
	const [placetoPayUrl, setplacetoPayUrl] = useState('')
	const [placeToPayOperationFineshed, setplaceToPayOperationFineshed] = useState(false);
	const [showPlaceToPayview, setshowPlaceToPayview] = useState(false);
	const URLToRiderect = "https://coopharma-83beb.web.app/";
	const [isCreactedOrder, setisCreactedOrder] = useState(false);
	const [requestId, setrequestId] = useState('');
	const [TOKEN, setTOKEN] = useState('')

	useEffect(() => fetchProduct(), []);

	const fetchProduct = () => {
		console.log("shodetail",route.params.showDetail)
		setShowLoading(true);
		checkStorage('USER_PHARMACY', (response: any) => {
			const pharmacy = JSON.parse(response);
			const url = '/products/getPharmaciesProductByid';

			const params = route.params;
			console.log(params, "params")
			const data = {
				id: params.productId,
				pharmacy_id: 536
			};
			//console.log(data,params,"detail")
			sendData(url, data).then((response: any) => {
				hideLoadingModal(() => {
					if (Object.keys(response).length > 0) {
						const product = response['pharmacyProduct'];
						
						setProduct(product);
						const url2 = `/imagen/getImgs/${product.product_id}`
						//console.log(product)
						fetchData(url2).then((response2: any) => {
							if (response2.ok) {
								// console.log(response2)
								setProduct_imgs([{ url: product.product_img }, ...response2.imagens])
								setProduct_img({ url: product.product_img })

							}

						})
						// console.log(product.product_id, url2)
						setProductPrice(product.price);
					} else {
						setProduct({});
						setProduct(0);
					}
				});
			});
		});
	};

	const modifyPrice = (type: number) => {
		let price: number = productPrice;
		let quantity: number = productQuantity;
		if (type == 1) {
			price = +price + +product.price;
			quantity += 1;
		} else {
			price = price - product.price;
			quantity -= 1;
		}

		if (quantity <= product.stock) {
			if (price >= product.price) {
				setProductPrice(roundNumber(price));
				setProductQuantity(quantity);
			}
		} else {
			showErrorToast(translation.t('productDetailsMaxQuantityError')); // The quantity is greater than the stock, please choose a lesser one.
		}
	};

	const roundNumber = (number: number) => {
		return Number.parseFloat((Math.round(number * 100) / 100).toFixed(2));
	};

	const addProductToShoppingCart = (id: string) => {
		const shoppingProduct = {
			user_id: id,
			pharmacy_product_id: product.product_pharmacy_id,
			ammount: productQuantity,
			price: productPrice
		};
		console.log('shopping cart')
		const url = '/cart/addToCart';
		sendData(url, shoppingProduct).then((response) => {
			if (Object.keys(response).length > 0) {
				Alert.alert(
					translation.t('alertInfoTitle'), // Information
					translation.t('productDetailsAddedProductText'), // Product added to shopping cart
					[
						{
							text: translation.t('productDetailsKeepBuyingText'), // Keep Buying
							onPress: () => {
								navigation.navigate('Root', { screen: 'home' });
							}
						},
						{
							text: translation.t('productDetailsGoCartText'), // Go to Cart
							onPress: () => {
								navigation.navigate('Root', { screen: 'ShoppingCart' });
							}
						}
					]
				);
			} else {
				showErrorToast(translation.t('httpConnectionError'));
			}
		});
	}

	const addToCart = () => {
		setShowLoading(true);
		checkLoggedUser(
			(id: string) => {
				const url = '/cart/getCartById';
				const data = {
					user_id: id,
					product_id: product.product_pharmacy_id
				};
				console.log('add to cart', data,)
				console.log(data)
				sendData(url, data)
					.then((response: any) => {
						hideLoadingModal(() => {
							if (Object.keys(response).length > 0) {
								const cartDetail = response['cartdetail'];
								if (productQuantity + cartDetail.ammount <= product.stock) {
									addProductToShoppingCart(id);
								} else showErrorToast(translation.t('productDetailsMaxStockError')); // The quantity of this product whithin the shopping cart has reached the maximum available, either choose a lesser quantity to add or remove it.
							} else {
								addProductToShoppingCart(id);
							}
						});
					})
					.catch((error) => {
						hideLoadingModal(() => {
							showErrorToast(translation.t('httpConnectionError'));
							console.log(error);
						});
					});
			},
			navigation,
			translation
		);
	};

	const showErrorToast = (message: string) => {
		Toast.show(message, {
			duration: Toast.durations.LONG,
			containerStyle: { backgroundColor: 'red', width: '80%' }
		});
	};

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 1500);
	};

	const createRent = () => {
		checkStorage('USER_LOGGED', (user_id: any) => {
			checkStorage('USER_PHARMACY', (response: any) => {
				const url = '/rent/createRent';
				const data = {
					first_payment:true,
					TOKEN,
					user_id,
					requestId,
					pharmacy_id:536,
					occupancy_request_id:route.params.occupancy_request_id,
					pharmacy_product_id:route.params.productId,
					RentDetail:[{
						total_payment:route.params.order_state_id === 5 ? product.gift_price : productPrice,
						nota:'',
					}]
				}
				sendData(url, data).then((response)=>{
					hideLoadingModal(() => {
                        const Rent = response;
                       // console.log(OccupancyRequest, "or response")
                        if (Rent) {
                            setisCreactedOrder(true)
                            Alert.alert(
                                translation.t('alertInfoTitle'),
                                (translation.locale.includes('en') && response.message) ||
                                (translation.locale.includes('es') && response.mensaje),
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => { }//createOrderNotification(order, pharmacy)
                                    }
                                ]
                            );
                        } else {
                            showErrorToast(translation.t('httpConnectionError'));
                        }
                    });
				})
			})
		})
	}
	const openPlaceToPayView = async () => {
		//if ((address.id || pickupStatus) /*&& card*/) {
		//console.log("adress", address)
		console.log("evaluate condition")
		//setloading(true)
		//await setShowLoading(true)
		let pharmacy_id;
		let userId;
		// checkStorage('USER_PHARMACY',(response: any) => {response? console.log("pid",JSON.parse(response).id):false; pharmacy_id = response.id});

		//esta misma linea aparece en 4 sitios mas en esta vista, crear una variable y volver reutilizable

		//const TotalOrder = pickupStatus ? route.params.orderTotal - 6 - (6 * 0.115) : route.params.orderTotal;
		//console.log("pTp",route.params.products,route.params.products.map((x:any)=>x.Product_Name).join(', '))
		async function getIpClient() {
			try {
				const response = await axios.get('https://api.ipify.org?format=json');
				//console.log(response.data.ip)
				return response.data.ip
			} catch (error) {
				console.error(error);
			}
		}
		const url = '/placetopay/checkin/requestId';
		checkStorage('USER_PHARMACY', (response: any) => {
			checkStorage('USER_LOGGED', async (user: any) => {
				checkStorage('TOKEN', async (resp: any) => {
					setTOKEN(resp)
					console.log(response);
					userId = user
					// let res = JSON.parse(response)
					//console.log(res.id)
					const data = {
						pharmacy_id: 536,//res.id,
						user_id: userId,
						ipAdress: await getIpClient(),
						description: product.product_name,//'Occupancy Aplication',// route.params.products.map((x: any, index: any) => x.Product_Name).join(', ').replace('"', ''),//address.notes,
						reference: Math.random().toString(36).substring(2),//route.params.products.map((x:any)=>x.Product_Name).join(', '),
						amount: route.params.order_state_id === 5 ? product.gift_price : productPrice,
						returnUrl: URLToRiderect,
						token_client: TOKEN,
						shopping: true
					}
					//	console.log("before load url", data, url)
					setShowLoading(true)
					await sendData(url, data).then((response) => {
						setplacetoPayUrl(response.data.processUrl);
						console.log("url response", response);
						setrequestId(response.data.requestId)
						//hideLoadingModal( ()=>setshowPlaceToPayview(true));
						setshowPlaceToPayview(true)
						setShowLoading(false)
					}).catch((e) => { console.log("Razon del fallo", e); setShowLoading(false) })
					//console.log("before load url,2", data, url)
					//setshowPlaceToPayview(true)
				})
			});
		});

		//console.log(route.params.products)
		//setloading(false)

		await setShowLoading(false)
		// }
		// else {
		// 	//if (address.id ||pickupStatus) 
		// 	showErrorToast(translation.t('NoAddressOrPickUpError'));
		// 	//else if (!card) showErrorToast(translation.t('NoCardError'));
		// }
	}
	const onNavigationStateChange = (state: any) => {
		console.log("estado", state)
		let intervalId: any;
		setplaceToPayOperationFineshed(URLToRiderect == state.url)
		if (placetoPayUrl != state.url && !placeToPayOperationFineshed && state.navigationType == 'other' && !state.loading) {
			//	console.log("transaction has been completed", placetoPayUrl != state.url, !placeToPayOperationFineshed)
			const url = `/placeToPay/consultSession/${requestId}`
			fetchData(url).then((res) => {
				console.log(res.respon.status.status)
				if (res.respon.status.status !== "REJECTED" && res.respon.status.status !== 'PENDING') {
					if (!isCreactedOrder) {
						clearInterval(intervalId);
						// apply();
						createRent()
					}
					else {
						clearInterval(intervalId);
						checkStorage('USER_PHARMACY', (response: any) => {
							const pharmacy = JSON.parse(response);
							navigation.reset({
								index: 0,
								routes: [
									{
										name: 'Root',
										params: {
											phId: pharmacy.id,
											phName: pharmacy.name
										},
										screen: 'Home'
									}
								]
							});
						})
					}
				}
				else if (res.respon.status.status === 'PENDING') {
					hideLoadingModal(() => {
						intervalId = setInterval(() => {
							fetchData(url).then((res) => {
								console.log(res.respon.status.status)
								if (res.respon.status.status !== "REJECTED" && res.respon.status.status !== 'PENDING') {
									if (!isCreactedOrder) {
										clearInterval(intervalId);
										// apply();
										createRent()
									}
									else {
										clearInterval(intervalId);
										checkStorage('USER_PHARMACY', (response: any) => {
											const pharmacy = JSON.parse(response);
											navigation.reset({
												index: 0,
												routes: [
													{
														name: 'Root',
														params: {
															phId: pharmacy.id,
															phName: pharmacy.name
														},
														screen: 'Home'
													}
												]
											});
										})
									}
								}
							})
							console.log("interval test")
						}, 10000);
					})

				}
				else {

					// Alert.alert(
					// 	"Alert Title",
					// 	"My Alert Msg",
					// 	[
					// 		{
					// 			text: "Cancel",
					// 			onPress: () => console.log("Cancel Pressed"),
					// 			style: "cancel"
					// 		},
					// 	]
					// );
					console.log("rejected")
					clearInterval(intervalId);
					navigation.navigate('Root', { screen: 'ShoppingCart' })
				}

			}).catch((error) => console.log("error consult", error))

		}
		console.log(placeToPayOperationFineshed)
		if (placeToPayOperationFineshed) {
			//console.log("operation fineched")
			//console.log("Opera", placetoPayUrl, state.url)
			checkStorage('USER_PHARMACY', (response: any) => {
				const pharmacy = JSON.parse(response);
				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'Root',
							params: {
								phId: pharmacy.id,
								phName: pharmacy.name
							},
							screen: 'Home'
						}
					]
				});
			})
			//setauxCont(0)
			setshowPlaceToPayview(false)
		}
		//setauxCont(auxCont + 1)
		//console.log(placeToPayOperationFineshed)
	}
	const supportedURL = "https://coopharma-83beb.web.app/frequentquestions";

	const OpenURLButton = ({ url, children }: any) => {
		const handlePress = useCallback(async () => {
			// Checking if the link is supported for links with custom URL scheme.
			const supported = await Linking.canOpenURL(url);

			if (supported) {
				// Opening the link with some app, if the URL scheme is "http" the web link should be opened
				// by some browser in the mobile
				await Linking.openURL(url);
			} else {
				Alert.alert(`Don't know how to open this URL: ${url}`);
			}
		}, [url]);

		return <TouchableOpacity onPress={handlePress} style={{ padding: 10 }}>
			<Text style={{
				width: '94%',
				alignSelf: 'flex-end',
				textAlign: 'right',
				padding: 5,
				fontSize: 16,
				paddingRight: 10,
				color: "#3366CC"

			}}>
				FAQ
				<Feather name="help-circle" size={24} color="#3366CC" />
			</Text>
		</TouchableOpacity>;
	};
	return (
		<SafeAreaView style={styles.container}>
			<Loading showLoading={showLoading} translation={translation} />
			{
				(!placeToPayOperationFineshed && showPlaceToPayview/*&&!showLoading*/) &&
				<View style={{ height: '100%' }}>
					<WebView
						source={{ uri: placetoPayUrl }}
						//originWhitelist={['*']}
						onNavigationStateChange={onNavigationStateChange}
					/>
				</View>
			}
			<View style={styles.body}>
				<View style={styles.productImage} >
					{/* <View  > */}
					<TouchableOpacity style={{ height: 150, width: '100%' }} onPress={() => setShowModalImagen(true)}>
						<Image source={product_img} style={{ height: 180, width: '100%' }} />
					</TouchableOpacity>

					{/* </View> */}

				</View>
				<View>
					<FlatList
						horizontal={true}
						style={{ height: '15%' }}
						data={product_imgs}
						renderItem={({ item }: any) => (
							<TouchableOpacity onPress={() => {
								let index = product_imgs.findIndex((e: any) => {
									return e.url === item.url
								})

								setIndex(index)
								setProduct_img({ url: item.url })
							}
							}>
								<View style={{ height: 70, width: 70, marginBottom: 10, margin: 2 }}>
									<Image source={{ uri: item.url }} style={{ width: '100%', flex: 1, resizeMode: 'contain' }} />
								</View>
							</TouchableOpacity>
						)}

					>

					</FlatList>

				</View>
				<Text style={styles.productName}>{product.product_name}</Text>
				{
					route.params.order_state_id ? <Text style={styles.productName}>Request Status:{
						(route.params.order_state_id == 1 && ' Pending') ||
						(route.params.order_state_id == 2 && ' Processing') ||
						(route.params.order_state_id == 3 && ' Ready for pick up by delivery') ||
						(route.params.order_state_id == 4 && 'On the way') ||
						(route.params.order_state_id == 5 && ' Completed') ||
						(route.params.order_state_id == 6 && 'Rejected') ||
						(route.params.order_state_id == 7 && 'Ready to be picked up by client')
					}</Text> : false
				}
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
					<Text style={styles.productPrice}>{formatter(route.params.order_state_id === 5 ? product.gift_price : productPrice)}</Text>

					{/* {product.stock > 0 && (
						<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
							<AntDesign name='minus' size={24} style={styles.priceIcon} onPress={() => modifyPrice(2)} />
							<Text style={{ fontSize: 20, alignSelf: 'center' }}>{productQuantity}</Text>
							<AntDesign name='plus' size={24} style={styles.priceIcon} onPress={() => modifyPrice(1)} />
						</View>
					)} */}
				</View>
				<Text style={{ fontSize: 16 }}>{translation.t('headerTitleProductDetails') /* Product Details */}</Text>
				<OpenURLButton url={supportedURL}>
					</OpenURLButton>
				<Text style={styles.productDescription}>{product.description}</Text>
				{
					route.params.showDetail&&
				<TouchableOpacity style={styles.rentDetail} onPress={() => { //console.log("first"); navigation.navigate('Forms', { product_pharmacy_id: product.product_pharmacy_id })
				 }}>
						<Text style={styles.rentDetailText}>
							{'Rent detail' /* Rent detail */}
						</Text>
					</TouchableOpacity>
				}
				{route.params.order_state_id === 5 ||route.params.showDetail? <TouchableOpacity style={styles.productAdd} onPress={() => { openPlaceToPayView() }}>
					<Text style={styles.productAddText}>
						Pay Rent
					</Text>
				</TouchableOpacity> : false}
			
				{((product.stock > 0 && !route.params.order_state_id &&!route.params.showDetail) && (
					<>
					<TouchableOpacity style={styles.productAdd} onPress={() => { console.log("first"); navigation.navigate('Forms', { product_pharmacy_id: product.product_pharmacy_id }) }}>
						<Text style={styles.productAddText}>
							{translation.t('productDetailsAddCartText') /* Add to Cart */}
						</Text>
					</TouchableOpacity>
					</>
				)) ||
					(product.stock == 0 && (
						<Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: 'red' }}>
							{translation.t('productDetailsStockError') /* Product out of stock */}
						</Text>
					))}
			</View>

			<View>
				<Modal visible={showModalImagen} >

					<ImageViewer imageUrls={product_imgs} saveToLocalByLongPress={true} enableSwipeDown={true} onCancel={() => { setShowModalImagen(false) }} index={index} />

				</Modal>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	body: {
		paddingVertical: 20,
		paddingHorizontal: 15
	},
	productImage: {
		justifyContent: 'center',
		alignItems: 'center',
		// padding: 40,
		paddingBottom: 40,
		// backgroundColor: 'rgba(213, 240, 219, 0.5)',
		borderRadius: 20
	},
	productName: {
		marginTop: 30,
		marginBottom: 20,
		fontSize: 22,
		fontWeight: '600'
	},
	productPrice: {
		fontSize: 20,
		fontWeight: '600',
		color: '#40AA54'
	},
	priceIcon: {
		marginHorizontal: 15,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderRadius: 10,
		padding: 3,
		color: '#40AA54'
	},
	productDescription: {
		marginVertical: 15,
		color: '#8B8B97'
	},
	productAdd: {
		marginTop: 20,
		alignSelf: 'center',
		backgroundColor: '#5f7ceb',
		height: 60,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15
	},
	rentDetail: {
		marginTop: 20,
		alignSelf: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FF4E02',
		height: 60,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15
	},
	rentDetailText:{
		color: '#FF4E02',
		fontSize: 16,
		fontWeight: '500'
	},
	productAddText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '500'
	}
});
