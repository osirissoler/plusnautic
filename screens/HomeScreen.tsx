import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Pressable,
	Image,
	StyleSheet,
	FlatList,
	ScrollView,
	TouchableOpacity,
	Modal,
	Alert,
	TextInput
} from 'react-native';
import { isObject } from 'formik';
import { Feather, SimpleLineIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import HeaderComponent from '../components/Header';
import { RootTabScreenProps } from '../types';
import { checkStorage, Container, Loading } from '../components/Shared';
import { fetchData, sendData } from '../httpRequests';
import { LanguageContext } from '../LanguageContext';
// import { collection, Firestore, onSnapshot, query, where } from '@firebase/firestore';
// import { db } from '../firebase'

//import 'Intl';
//import 'intl/locale-data/jsonp/en'
// import { firebase } from '../firebase';
import registerForPushNotificationsAsync from './helper/TokenDevice';
import { number } from 'yup';
import * as Notifications from 'expo-notifications';
import { formatter } from '../utils';



Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		allowBadge: true,
	}),
});


export default function HomeScreen({ navigation, route }: RootTabScreenProps<'Home'>) {
	const params: any = route.params;
	const { translation } = React.useContext(LanguageContext);

	const [listCategories, setListCategories]: any = useState([]);
	const [listCategoriesSearch, setListCategoriesSearch]: any = useState([]);

	const [fetchingCategories, setFetchingCategories]: any = useState(false);
	const [showFilterModal, setShowFilterModal]: any = useState(false);
	const [listProducts, setListProducts]: any = useState([]);
	const [showLoading, setShowLoading]: any = useState(false);
	const [initial, setinitial] = useState(0);
	const [limit, setlimit] = useState(10)
	const [itemsQuatityByPage, setitemsQuatityByPage] = useState(10)
	const [defaultCategoryId, setdefaultCategoryId] = useState()
	const defaultProductImg = 'http://openmart.online/frontend/imgs/no_image.png?'
	const [initialImg, setinitialImage] = useState('https://coopharma-file.nyc3.digitaloceanspaces.com/WhatsApp%20Image%202022-12-12%20at%204.32.10%20PM.jpeg');
	const [arrayAllImage, setArrayAllImage]: any = useState([]);
	const [intervalo, setIntervalo]: any = useState(null);
	let ce: any
	const seen = new Set();
	let auxProduct: any[] = []
	let newArray: any[] = []
	const [isFilterActive, setisFilteredActive] = useState(false)
	const [ActiveCategoryName, setActiveCategoryName] = useState('')
	const [currentPageProducts, setcurrentPageProducts] = useState([])






	useEffect(() => {
		getAds()
		getCategories()
	}, []);


	const getAds = async () => {
		clearInterval(ce)
		const url = `/planAds/getPlanAdsActiveByPharmacy/${536}`;
		fetchData(url).then(async (response) => {
			const adsImg = await response.plans

			// console.log(adsImg.length, "res")
			await setArrayAllImage(adsImg)
			if (response['plans'] != undefined && response['plans'].length > 0 && response['plans'] != null) {
				let v1 = Math.floor(Math.random() * adsImg.length)
				setinitialImage(adsImg[v1].img)
				// ce = setInterval(() => {
				// 	let v0 = Math.floor(Math.random() * adsImg.length)
				// 	setinitialImage(adsImg[v0].img)
				// }, 5000)
				setIntervalo(setInterval(() => {
					let v0 = Math.floor(Math.random() * adsImg.length)
					setinitialImage(adsImg[v0].img)
				}, 5000))
			}
		})
	}

	const getAdsByCategory = (id: any) => {
		// console.log(intervalo)
		// clearInterval(intervalo)
		const url = `/planAds/getPlanAdsActiveByPharmacyCategory/${id}`;

		fetchData(url).then(async (response) => {
			// console.log(response)
		})
		// setinitialImage("https://file-coopharma.nyc3.digitaloceanspaces.com/1654178248602WhatsApp%20Image%202022-05-11%20at%204.14.38%20PM.jpeg")
	}
	const getProducts = async () => {

		setlimit(limit + itemsQuatityByPage)
		const url = '/products/getProductsByPharmacy';
		const data = { pharmacy_id: 536, category_id: defaultCategoryId, initial: initial, limit: limit };
		//console.log(data)
		//let hash: any = {};
		await sendData(url, data).then((response) => {
			//	console.log("is active",response['pharmacyproduct'])
			if (response['pharmacyproduct'] == undefined && isFilterActive) {
				// console.log("is active")
				setListProducts([])
				setisFilteredActive(false)
				//console.log("listproduct",listProducts)
			}
			//console.log("make request",initial,limit)
			if (response['pharmacyproduct'] != undefined && response['pharmacyproduct'].length > 0) {
				setcurrentPageProducts(response['pharmacyproduct'])
				//console.log("pharmacyp",response)
				//auxProduct.push(...currentPageProducts)//.filter((el:any) => {
				setListProducts(response['pharmacyproduct']
					//.sort((a:any,b:any) => (a.product_name > b.product_name) ? 1 : ((b.product_name > a.product_name) ? -1 : 0))//currentPageProducts//auxProduct
					// 	.filter((el: any) => {
					// 	const duplicate = seen.has(el.product_id);
					// 	seen.add(el.product_id);
					// 	return !duplicate;
					// })
				)
				// console.log("pharmacyproduct",listProducts)
				// 	const duplicate = seen.has(el.product_id);
				// 	seen.add(el.product_id);
				// 	return !duplicate;
				//   })

				//console.log(listProducts)

			}
			// else{
			// 		setListProducts([])
			// 	}
			// console.log(listProducts)
		}
		)

		setFetchingCategories(false)

	}

	const getMoreProducts = () => {
		//auxProduct = listProducts
		if (currentPageProducts.length > 0 && currentPageProducts != undefined) {
			//setListProducts([])
			// setinitial(limit)
			setlimit(limit + itemsQuatityByPage)
			getProducts()
			//	newArray.push(...listProducts,...currentPageProducts)
			//console.log('test',newArray)
			//auxProduct=newArray ;
			//console.log(auxProduct)
			//	 setListProducts(newArray//.filter((el:any) => {
			// 		const duplicate = seen.has(el.pharmacy_product_id);
			// 		seen.add(el.pharmacy_product_id);
			// 		return !duplicate;
			// 	  })
			//)

		}
		//console.log("get more products",listProducts)
	}
	const getCategories = () => {
		const url = '/categories/getCategories';
		const url2 = `/categories/getCategoriesStatusMobile/${536}`;
		fetchData(url2).then((response) => {
			const categories = response['categoryStatus']//.filter((x:any)=>{x.id in categoriesStatus.category_id});
			setListCategories(categories)
			setListCategoriesSearch(categories)
		});
	}

	const setActiveCategory = (category: any) => {
		// console.log(category)
		setActiveCategoryName(category.name)
		setdefaultCategoryId(category ? category.id : defaultCategoryId)
		getAdsByCategory(category.id)
		setisFilteredActive(true)
		closeFilterModal()

		console.log(defaultCategoryId)
	}
	const openFilterModal = () => {
		setShowFilterModal(true);
		getCategories()
	};

	const closeFilterModal = () => {
		setShowFilterModal(false);
	};

	const onRefresh = () => {
		setFetchingCategories(true);
		getProducts();
	};

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 1500);
	};

	const changeDefaultPharmacy = () => {
		checkStorage('USER_LOGGED', (id: string) => {
			const url = '/cart/getCart';
			const data = { user_id: id };
			sendData(url, data).then((response: any) => {
				if (Object.keys(response).length == 0) navigation.navigate('ListPharmacies', { from: 'home' });
				else {
					Alert.alert(
						translation.t('alertWarningTitle'),
						translation.t('homePharmacyChangeAlert'), // Can not change the pharmacy, you already have products on the shopping cart.
						[
							{
								text: 'Ok',
								onPress: () => {
									navigation.navigate('Root', { screen: 'ShoppingCart' });
								}
							}
						]
					);
				}
			});
		});
	};

	useEffect(
		//() => orderCategories()
		() => {
			setinitial(0)
			setlimit(itemsQuatityByPage)
			//getProducts()
			getProducts()
			// getCategories()
		},
		[defaultCategoryId]
	);

	const filterCategory = (text: any) => {
		const value = text.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

		const categories = listCategoriesSearch.filter(
			(item: any) => !!item.nombre && item.nombre.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value) || !!item.name && item.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value)
		);
		setListCategories(categories)

	}
	return (
		<Container>
			<Loading showLoading={showLoading} translation={translation} />
			<HeaderComponent screen='home' navigation={navigation} openFilterModal={openFilterModal} />
			<Modal visible={showFilterModal} animationType='slide'>

				<View style={{ paddingHorizontal: 20 }}>

					<View style={{ position: 'relative', justifyContent: 'center' }}>
						<Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, marginBottom: 30 }}>
							{translation.t('homeModalCategoriesLabel')}
						</Text>
						<View style={{ position: 'absolute', right: 0 }}>
							<MaterialCommunityIcons
								name='close'
								size={24}
								style={styles.categoryIcon}
								onPress={() => closeFilterModal()}
							/>
						</View>
						<View style={styles.formInputIcon}>
							{/* <Text>osiris</Text> */}
							<TextInput
								placeholder={translation.t('listCategoriesSearchPlaceholder') /* Search a name of a product */}
								placeholderTextColor={'gray'}
								style={[styles.textInput, { zIndex: 1 }]}
								onChangeText={filterCategory}
							/>
						</View>
					</View>
					{/* <Text style={{ fontSize: 16, marginVertical: 10 }}>
						translation.t('homeModalCategoriesLabel') 
					</Text> */}
					{(Object.keys(listCategories).length > 0 && (
						<FlatList
							style={{ height: '85%' }}
							columnWrapperStyle={{ justifyContent: 'space-around' }}
							data={listCategories}
							refreshing={fetchingCategories}
							onRefresh={onRefresh}
							renderItem={({ item }: any) => (
								<TouchableOpacity
									style={[styles.categoryCard, item.active ? styles.categoryCardActive : null]}
									onPress={() => setActiveCategory(item)}
									key={item.id}
								>
									<View style={{ height: 120, width: 120, marginBottom: 10, }}>
										<Image source={{ uri: item.icon }} style={{ flex: 1, resizeMode: 'contain' }} />
									</View>
									<Text style={styles.categoryName}>
										{(translation.locale.includes('en') && item.name) ||
											(translation.locale.includes('es') && item.nombre)}
									</Text>

								</TouchableOpacity>


							)}
							numColumns={2}
						></FlatList>
					)) || (
							<Text style={{ fontSize: 16, marginTop: 20 }}>
								{translation.t('homeNoCategoriestext') /* There are no active categories... */}
							</Text>
						)}
				</View>
			</Modal>


			{(defaultCategoryId) &&
			<View style={{ height: '100%' }}>
				<FlatList
					//style={{ height: '85%' }}
					//columnWrapperStyle={{ justifyContent: 'space-around' }}
					data={listProducts}
					refreshing={fetchingCategories}
					onRefresh={onRefresh}
					ListEmptyComponent={
						<Text style={{ fontSize: 16, marginTop: 20 }}>
							{
								translation.t(
									'homeNoProductsText'
								) /* No products available within this category... */
							}
						</Text>

					}
					ListHeaderComponent={
						// <Image style={styles.headerImage} source={require('../assets/images/ads1.jpeg')} />
						<View>
							{/* <Image style={styles.headerImage} source={require('../assets/images/product_ad.png')} /> */}
							<Image style={styles.headerImage} source={{ uri: initialImg }} />
						</View>
					}

					onEndReached={
						getProducts//getMoreProducts
					}
					onEndReachedThreshold={0}
					keyExtractor={item => item.pharmacy_product_id}
					style={styles.body}
					renderItem={({ item }: any) => (
						<View key={item.pharmacy_product_id}>
							<Pressable
								style={styles.productCard}
								key={item.pharmacy_product_id}
								onPress={() => navigation.navigate('ProductDetails', {
									productId: item.pharmacy_product_id,
								})}
							>
								<View style={styles.productImage}>
									<Image
										source={{ uri: item.product_img ? item.product_img : defaultProductImg }}
										style={{ flex: 1, resizeMode: 'contain' }}
									/>
								</View>
								<View style={{ justifyContent: 'space-between', width: '60%' }}>
									<Text style={styles.productTitle}>{item.product_name}</Text>

									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-between',
											marginTop: 20
										}}
									>
										<Text style={styles.productPrice}>Rent price: {formatter(item.price)}</Text>
										<Text style={styles.productPrice}></Text>
										<Pressable
											style={styles.productAdd}
											onPress={() =>
												navigation.navigate('ProductDetails', {
													productId: item.pharmacy_product_id
												})
											}
										>

										</Pressable>
									</View>
									<View style={{

									}}>
										<AntDesign name='eye' size={22} style={styles.productAddIcon} />
									</View>

								</View>
							</Pressable>
						</View>
					)}
				>


				</FlatList>
			</View>}

			{(!defaultCategoryId) &&
			 <View style={{ height: '100%' }}>
				<FlatList
					// style={{ height: '100%' }}
					columnWrapperStyle={{ justifyContent: 'space-around' }}
					data={listCategories}
					refreshing={fetchingCategories}
					onRefresh={onRefresh}
					ListHeaderComponent={
						// <Image style={styles.headerImage} source={require('../assets/images/ads1.jpeg')} />
						<View>
							{/* <Image style={styles.headerImage} source={require('../assets/images/product_ad.png')} /> */}
							<Image style={styles.headerImage} source={{ uri: initialImg }} />
						</View>
					}
					style={styles.body}
					renderItem={({ item }: any) => (
						<TouchableOpacity
							style={[styles.categoryCard, item.active ? styles.categoryCardActive : null]}
							onPress={() => setActiveCategory(item)}
							key={item.id}
						>
							<View style={{ height: 120, width: 120, marginBottom: 10, }}>
								<Image source={{ uri: item.icon }} style={{ flex: 1, resizeMode: 'contain' }} />
							</View>
							<Text style={styles.categoryName}>
								{(translation.locale.includes('en') && item.name) ||
									(translation.locale.includes('es') && item.nombre)}
							</Text>

						</TouchableOpacity>
					)}
					numColumns={2}
				></FlatList>

			</View>}

		</Container>
	);
}

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingTop: 20,
		marginBottom: 10
	},
	body: {
		padding: 20,
		flexDirection: 'column'
	},
	locationTitle: {
		marginHorizontal: 5,
		alignSelf: 'flex-end'
	},
	locationText: {
		marginTop: 5,
		fontSize: 16,
		fontWeight: '600',
		color: 'rgba(22, 22, 46, 0.3)'
	},
	headerImage: {
		marginBottom: 20,
		height: 180,
		width: '100%',
		borderRadius: 10,
		// aspectRatio:1/1
	},
	listCategories: {},
	categoryCard: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F7F7F7',
		borderRadius: 15,
		marginVertical: 10,
		width: '40%',
		minHeight:200
	},
	categoryCardActive: {
		borderWidth: 1,
		borderColor: '#000'
	},
	categoryIcon: {
		marginBottom: 15
	},
	categoryName: {
		fontSize: 15,
		fontWeight: '400',
		textAlign: 'center'
	},
	productsContainer: {},
	productsContainerHeader: {
		marginVertical: 15,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	productsContainerBody: {
		marginBottom: 30
	},
	productsPopularTitle: {
		fontSize: 16
	},
	productsViewAll: {
		color: '#40AA54'
	},
	productCard: {
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
		backgroundColor: 'white',
		borderRadius: 10,
		height: 120,
		width: 120,
		marginRight: 10
	},
	productTitle: {
		fontSize: 16,
		fontWeight: '500'
	},
	productPrice: {
		fontSize: 16,
		fontWeight: '500'
	},
	productAdd: {
		// backgroundColor: '#40AA54',
		padding: 4,
		borderRadius: 100
	},
	productAddIcon: {
		color: '#5f7ceb'
	},
	formInputIcon: {
		position: 'relative',
		flexDirection: 'row',
		marginTop: 20
	},
	textInput: {
		height: 50,
		width: '100%',
		backgroundColor: '#F7F7F7',
		paddingRight: 40,
		paddingLeft: 20,
		borderRadius: 5,
		marginVertical: 10
	},
	inputIcon: {
		position: 'absolute',
		right: 15,
		top: '35%',
		zIndex: 2
	},

});
