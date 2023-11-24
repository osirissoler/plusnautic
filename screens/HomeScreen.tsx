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


import { number } from 'yup';

import { formatter } from '../utils';
import AdsScreen from './AdsScreen';



export default function HomeScreen({ navigation, route }: RootTabScreenProps<'Home'>) {
	const defaultProductImg = 'http://openmart.online/frontend/imgs/no_image.png?'
	const [initialImg, setinitialImage] = useState('https://file-coopharma.nyc3.digitaloceanspaces.com/16817528019excursiones-desde-san-sebastian.jpg');
	const { translation } = React.useContext(LanguageContext);
	const [fetching, setFetching]: any = useState(false)
	const [showLoading, setShowLoading]: any = useState(false)
	const [listPharmacy, setListPharmacy]: any = useState([]);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		getPharmaciesByUSer()
	}, [])

	const getPharmaciesByUSer = async () => {
		checkStorage('USER_LOGGED', async (id: any) => {
			setFetching(true)
			let url = `/userPharmacy/getUserPharmacyByUserId/${id}`
			await fetchData(url).then((response) => {
				if (response.ok) {
					setListPharmacy(response.userPharmacy)
					console.log(response.userPharmacy);
				} else {

				}
				setFetching(false)

			})
		})

	}


	return (
		<Container>
			<HeaderComponent />
			<Loading showLoading={showLoading} translation={translation} />

			<View style={{ height: '100%' }}>
				<FlatList
					columnWrapperStyle={{ justifyContent: 'space-around' }}
					refreshing={fetching}
					data={listPharmacy}
					onRefresh={getPharmaciesByUSer}
					ListHeaderComponent={
						<View>
							{(visible)
								? <AdsScreen code={"Services"} img={initialImg} />
								: <Image style={styles.headerImage} source={{ uri: initialImg }} />
							}
						</View>
					}
					style={styles.body}
					renderItem={({ item, index }: any) => (
						
						<TouchableOpacity
							style={{
								padding: 10,
								justifyContent: 'center',
								alignItems: 'center',
								width: '35%',
							}}
							// onPress={() => setActiveCategory(item)}
							key={item.id}
						>
							<View style={{ height: 80, width: 80, marginBottom: 10, }}>
								<Image source={{ uri: item.pharmacy_img }} style={{ flex: 1, resizeMode: 'contain' }} />
							</View>
							<Text style={styles.categoryName}>
								{item.pharmacy_name}
							</Text>
						</TouchableOpacity>
					)}
					numColumns={2}
				>
				</FlatList>
			</View>
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
		flexDirection: 'column',
		marginBottom: 60
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
		minHeight: 200
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
		marginVertical: 6,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
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
