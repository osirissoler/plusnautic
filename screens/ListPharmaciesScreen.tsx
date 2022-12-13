import React, { useState, useEffect } from 'react';
import {
	SafeAreaView,
	View,
	FlatList,
	TextInput,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Pressable
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { isObject } from 'formik';
import asyncStorage from '@react-native-async-storage/async-storage';
import { checkStorage, Loading } from '../components/Shared';
import { fetchData, sendData } from '../httpRequests';
import { LanguageContext } from '../LanguageContext';

export default function ListPharmaciesScreen({ navigation, route }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [showLoading, setShowLoading]: any = useState(false);
	const [pharmacies, setPharmacies]: any = useState([]);
	const [pharmaciesData, setPharmaciesData]: any = useState([]);
	const [showList, setShowList]: any = useState(false);

	useEffect(() => {
		let unsuscribe = checkStorage('USER_PHARMACY', (response: any) => {
			if (!!response) {
				if (!!route.params) {
					if (route.params.from != 'home') {
						const pharmacy = JSON.parse(response);
						navigation.reset({
							index: 0,
							routes: [
								{ name: 'Root', params: { phId: 536,  }, screen: 'Home' }
							]
						});
					} else {
						navigation.setOptions({
							headerBackVisible: true,
							gestureEnabled: true
						});
						fetchPharmacyData();
					}
				} else {
					const pharmacy = JSON.parse(response);
					navigation.reset({
						index: 0,
						routes: [{ name: 'Root', params: { phId: 536,  }, screen: 'Home' }]
					});
				}
			} else {
				fetchPharmacyData();
			}
		});
		return unsuscribe;
	}, []);

	const setDefaultPharmacy = (pharmacy: any) => {
		checkStorage('USER_LOGGED', (id: string) => {
			const url = '/cart/getCart';
			const data = {
				user_id: id
			};
			sendData(url, data).then((response: any) => {
				if (Object.keys(response).length > 0) {
					const url = '/cart/clearCart';
					const data = {
						user_id: id
					};
					sendData(url, data);
				}
				asyncStorage.setItem('USER_PHARMACY', JSON.stringify(pharmacy));

				navigation.reset({
					index: 0,
					routes: [{ name: 'Root', params: { phId: 536,  }, screen: 'Home' }]
				});
			})
		})
	};

	const setFavoritePharmacy = (pharmacy: any) => {
		// console.log(pharmacy, 'aki')
		navigation.reset({
			index: 0,
			routes: [{ name: 'Root', params: { phId: 536,  }, screen: 'Home' }]
		});
		// setShowLoading(true);
		// hideLoadingModal(() => {
		// 	const currentPharmacy = pharmacies.find((item: any) => item.id == 536);
		// 	if (isObject(currentPharmacy)) {
		// 		asyncStorage.removeItem('USER_PHARMACY');
		// 		setDefaultPharmacy(currentPharmacy);
		// 	}
		// });
	};

	const searchPharmacy = (text: string) => {
		const value = text.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();;
		// setTimeout(() => {
		const filteredPharmacies = pharmaciesData.filter(
			(item: any) => item.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value) || (item.city != null && item.city.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(value))
		);
		setPharmacies(filteredPharmacies);
		// }, 1000);
	};

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 1500);
	};

	const fetchPharmacyData = () => {
		setShowLoading(true);
		const url = '/pharmacies/getPharmacies';
		fetchData(url)
			.then((responsePharmacies) => {
				hideLoadingModal(() => {
					if (Object.keys(responsePharmacies).length > 0) {
						checkStorage('USER_PHARMACY', (responsePharmacy: any) => {
							const pharmacyData = JSON.parse(responsePharmacy);
							const pharmacies = responsePharmacies['pharmacy'];
							// console.log(pharmacies)
							if (pharmacyData) {
								const defaultPharmacy = pharmacies.find(
									(pharmacy: any) => pharmacy.id == 536
								);
								if (defaultPharmacy) {
									defaultPharmacy.favorite = true;
								}
							}
							let index = pharmacies.findIndex((e: any) => {
								return e.id == 536
							})
							console.log(index, "index", pharmacies[index])
							setFavoritePharmacy(pharmacies[index])
							setPharmacies(pharmacies)
							setPharmaciesData(pharmacies);
							setShowList(true);
						});
					} else {
						setPharmacies([]);
						setPharmaciesData([]);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<SafeAreaView style={styles.container}>
			<Loading showLoading={showLoading} translation={translation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	body: {
		flex: 1,
		paddingTop: 10,
		paddingBottom: 20,
		paddingHorizontal: 20
	},
	formInputIcon: {
		position: 'relative',
		flexDirection: 'row'
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
	itemCard: {
		paddingVertical: 30,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)'
	},
	itemImage: {
		width: 60,
		height: 60,
		marginRight: 10
	},
	itemTitle: {
		fontSize: 18,
		fontWeight: '500',
		paddingRight: 80
	},
	itemAddress: {
		maxWidth: 160,
		color: '#8B8B97',
		flexWrap: 'wrap'
	},
	itemFavorite: {
		color: 'orange'
	}
});
