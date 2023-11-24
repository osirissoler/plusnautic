import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from 'react-native';

import HeaderComponent from '../components/Header';
import { checkStorage, Container, Loading } from '../components/Shared';
import { fetchData } from '../httpRequests';
import { LanguageContext } from '../LanguageContext';
import AdsScreen from './AdsScreen';

export default function HomeScreen({ navigation, route }:any) {
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
	const goMuelles = (id:number) => {
		navigation.navigate('Muelles', {id:id})
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
							onPress={() => { goMuelles(item.pharmacy_id)}}
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
	
	body: {
		padding: 20,
		flexDirection: 'column',
		marginBottom: 60
	},
	headerImage: {
		marginBottom: 20,
		height: 180,
		width: '100%',
		borderRadius: 10,
		// aspectRatio:1/1
	},
	categoryName: {
		fontSize: 15,
		fontWeight: '400',
		textAlign: 'center'
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
});
