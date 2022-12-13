import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { sendData } from '../httpRequests';
import { checkStorage, Loading } from '../components/Shared';
import { LanguageContext } from '../LanguageContext';
import { formatter } from '../utils';
import { locale } from 'i18n-js';
import moment from 'moment'
export default function MyOrdersScreen({ navigation }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [orders, setOrders]: any = useState([]);
	const [showLoading, setShowLoading]: any = useState(false);

	useEffect(() => {
		let unsuscribe = navigation.addListener('focus', () => {
			fetchOrders();
		});
		return () => {
			unsuscribe;
			setOrders([]);
		};
	}, []);

	const fetchOrders = () => {
		checkStorage('USER_LOGGED', (userId: any) => {
			setShowLoading(true);
			const url = '/occupancyRequest/getOccupancyRequestsByUser';
			const data = {
				user_id: userId
			};
			sendData(url, data).then((response: any) => {
				hideLoadingModal(() => {
					if (Object.keys(response).length > 0) {
						const orders = response['OccupancyRequest'];
						orders.sort(function (a: any, b: any) {
							return a.code < b.code;
						});
						setOrders(orders);
					}
				});
			});
		});
	};

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 100);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Loading showLoading={showLoading} translation={translation} />
			<View style={styles.body}>
				{(Object.keys(orders).length > 0 && (
					<FlatList
						data={orders}
						renderItem={({ item }: any) => <Order item={item} navigation={navigation} />}
					/>
				)) || <Text>{translation.t('ordersNoItemsText') /* You don't have any orders. */}</Text>}
			</View>
		</SafeAreaView>
	);
}

function Order({ item, navigation }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [pharmacy, setPharmacy]: any = useState({});
	const defaultProductImg = 'http://openmart.online/frontend/imgs/no_image.png?'
	console.log(item.product_pharmacy_id, "test")
	// useEffect(() => {
	// 	const url = '/pharmacies/getPharmacyById';
	// 	const data = {
	// 		id: item.pharmacy_id
	// 	};
	// 	sendData(url, data).then((response) => {
	// 		if (Object.keys(response).length > 0) {
	// 			const pharmacy = response['pharmacy'];
	// 			setPharmacy(pharmacy);
	// 		}
	// 	});

	// 	return () => {
	// 		setPharmacy({});
	// 	};
	// }, []);

	return (
		<TouchableOpacity
			// style={styles.card}
			onPress={() => navigation.navigate('ProductDetails', { productId: item.product_pharmacy_id, order_state_id: item.order_state_id, occupancy_request_id: item.id })}
		>
			<View style={styles.container}>
				<View style={{ ...styles.innerBox }}>
					<View style={{ ...styles.rowHeader }}>
						<View style={{...styles.row,alignItems:'center'}}>
							<Image
								source={{ uri: item.product_img ? item.product_img : defaultProductImg }}
								style={{ ...styles.productImage, resizeMode: 'contain' }}
							/>
							<Text style={{}}>
							{
								item.product_name
							}					
							</Text>
						</View>
						<View style={{ ...styles.rowReverse,alignItems:'flex-end'}}>
							<Text
								style={[
									(item.order_state_id == 1 && { color: 'maroon' }) ||
									(item.order_state_id == 5 && { color: '#128780' }) ||
									(item.order_state_id == 7 && { color: '#128780' }) ||
									(item.order_state_id == 6 && { color: 'red' }) || { color: '#8B8B97' },
									{
										marginTop: 3,
										fontWeight: '500',
										paddingRight: 10
									}

								]}
							>
								{
									(item.order_state_id == 1 && translation.t('orderStatusPendingText')) ||
									(item.order_state_id == 2 && translation.t('orderStatusPreparingText')) ||
									(item.order_state_id == 3 &&
										translation.t('orderStatusReadyPickupText')) ||
									(item.order_state_id == 4 && translation.t('orderStatusPickedUpText')) ||
									(item.order_state_id == 5 && 'Security Deposit'//translation.t('orderStatusDeliveredText')
									) ||
									(item.order_state_id == 6 && translation.t('orderStatusRejectedText')) ||
									(item.order_state_id == 7 &&
										translation.t('orderStatusPickupUserText'))
								}
							</Text>
							<Text style={{ fontWeight: '500', paddingRight: 10 }}> {moment(item.created_at).format('L')}</Text>
						</View>
						{/* <View style={{ flex: 1, ...styles.rowReverse }}>
						</View> */}
					</View>
					<View style={{ ...styles.row }}>
						<Text style={{ ...styles.cardNumber, }}> Request: </Text><Text style={{ ...styles.cardPrice }}> #{item.code}</Text>
					</View>
					<View style={{ ...styles.row }}>
						<Text style={{ ...styles.cardNumber, }}> Request fee: </Text><Text style={{ ...styles.cardPrice }}> {formatter(35)}</Text>
					</View>
					<View style={{ ...styles.row }}>
						<Text style={{ ...styles.cardNumber, }}> Rent fee: </Text><Text style={{ ...styles.cardPrice }}> {formatter(item.price)}</Text>
					</View>
					<View style={{ ...styles.row }}>
						<Text style={{ ...styles.cardNumber, }}> Security deposit: </Text><Text style={{ ...styles.cardPrice }}> {formatter(item.security_deposit)}</Text>
					</View>
					<View style={{ ...styles.row }}>
						<Text style={{ ...styles.cardNumber, }}> Prorateo: </Text><Text style={{ ...styles.cardPrice }}> {formatter(item.prorateo)}</Text>
					</View>
				</View>
				{/* <Text style={[styles.cardNumber, { marginBottom: 10 }]}>#{item.code}</Text>
				<Text style={styles.cardPharmacy}>{pharmacy.name}</Text>
				<Text
					style={[
						(item.order_state_id == 5 && { color: '#128780' }) ||
						(item.order_state_id == 7 && { color: '#128780' }) ||
						(item.order_state_id == 6 && { color: 'red' }) || { color: '#8B8B97' },
						{
							marginTop: 3
						}
					]}
				>
					{
						(item.order_state_id == 1 && translation.t('orderStatusPendingText'))  Pending  ||
						(item.order_state_id == 2 && translation.t('orderStatusPreparingText')) Preparing  ||
						(item.order_state_id == 3 &&
							translation.t('orderStatusReadyPickupText')) /* Waiting for carrier  ||
						(item.order_state_id == 4 && translation.t('orderStatusPickedUpText')) On the way ||
						(item.order_state_id == 5 && translation.t('orderStatusDeliveredText')) Delivered ||
						(item.order_state_id == 6 && translation.t('orderStatusRejectedText')) Rejected ||
						(item.order_state_id == 7 &&
							translation.t('orderStatusPickupUserText')) /* Ready to be picked up 
					}
				</Text> 
				*/}

			</View>
			{/* <View>
				<Text style={[styles.cardPrice, { marginBottom: 8 }]}>${item.RequestFee.toFixed(2)}</Text>
			</View> */}
			{/* <Ionicons name="arrow-forward" size={20} style={{ position: 'absolute', top: 5, right: 10, color: "#8B8B97" }}/> */}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: '#F7F7F7',
		borderRadius: 10,
		marginVertical: 7,
		padding: 3

	},
	innerBox: {
		shadowColor: 'rgb(255,78,2)',
		// shadowOpacity: 0.5,
		// textShadowRadius: 10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.5,
		shadowRadius: 3.84,
		elevation: 5,
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 10
	},
	productImage: {
		backgroundColor: 'black',
		borderRadius: 100,
		height: 60,
		width: 60,
		marginRight: 10
	},
	body: {
		marginHorizontal: 20,
		marginVertical: 30,
		padding: 20,
		backgroundColor: '#ffffff',
		borderRadius: 20
	},
	card: {
		alignContent: 'center',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-around',
		paddingVertical: 20,
		borderBottomColor: 'rgba(0, 0, 0,  0.1)',
		borderBottomWidth: 1,
		position: 'relative',
		marginVertical: 10,
		paddingHorizontal: '10%'
	},
	cardNumber: {
		fontSize: 16,
		fontWeight: '700',
		paddingVertical: 7,
		//color:'white'
	},
	cardPrice: {
		textAlign: 'right',
		fontSize: 14,
		fontWeight: '600',
		color: '#8B8B97',
		paddingVertical: 7

	},
	cardPharmacy: {
		fontSize: 14,
		color: '#8B8B97'
	},
	// container: {
	// 	flex: 1,
	// 	marginTop: 8,
	// 	backgroundColor: "aliceblue",
	//   },
	box: {
		width: 50,
		height: 50,
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",

	},
	rowHeader: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: 'space-around'
	},
	rowReverse: {
		flexDirection: 'column-reverse',
		flexWrap: "nowrap",
		display: "flex"
	},
	button: {
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 4,
		backgroundColor: "oldlace",
		alignSelf: "flex-start",
		marginHorizontal: "1%",
		marginBottom: 6,
		minWidth: "48%",
		textAlign: "center",
	},
	selected: {
		backgroundColor: "coral",
		borderWidth: 0,
	},
	buttonLabel: {
		fontSize: 12,
		fontWeight: "500",
		color: "coral",
	},
	selectedLabel: {
		color: "white",
	},
	label: {
		textAlign: "center",
		marginBottom: 10,
		fontSize: 24,
	},
});
