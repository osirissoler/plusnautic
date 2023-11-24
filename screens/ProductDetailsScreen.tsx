import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { fetchData, sendData } from '../httpRequests';
import { checkStorage, Loading } from '../components/Shared';
import { LanguageContext } from '../LanguageContext';
import ImageViewer from 'react-native-image-zoom-viewer';
export default function ProductDetailsScreen({ navigation, route }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [product, setProduct]: any = useState({});
	const [showLoading, setShowLoading]: any = useState(false);
	const [showModalImagen, setShowModalImagen]: any = useState(false);
	const [product_imgs, setProduct_imgs]: any = useState([]);
	const [product_img, setProduct_img]: any = useState({});
	const [index, setIndex]: any = useState(0);

	useEffect(() => fetchProduct(), []);
	const fetchProduct = () => {
		setShowLoading(true);
		checkStorage('USER_PHARMACY', (response: any) => {
			const url = '/products/getPharmaciesProductByid';
			const data = {
				id: route.params.item.pharmacy_product_id,
				pharmacy_id: route.params.item.pharmacy_id
			};

			sendData(url, data).then((response: any) => {
				hideLoadingModal(() => {
					if (Object.keys(response).length > 0) {
						const product = response['pharmacyProduct'];
						setProduct(product);
						const url2 = `/imagen/getImgs/${product.product_id}`
						fetchData(url2).then((response2: any) => {
							if (response2.ok) {
								setProduct_imgs([{ url: product.product_img }, ...response2.imagens])
								setProduct_img({ url: product.product_img })
							}
						})
					}
				});
			});
		});
	};

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 1500);
	};
	return (
		<SafeAreaView style={styles.container}>
			<Loading showLoading={showLoading} translation={translation} />
			<View style={styles.body}>
				<View style={styles.productImage} >
					<TouchableOpacity style={{ height: 150, width: '100%' }} onPress={() => setShowModalImagen(true)}>
						<Image source={product_img} style={{ height: 180, width: '100%' }} />
					</TouchableOpacity>
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
				<Text style={{ fontSize: 16 }}>{translation.t('headerTitleProductDetails')}</Text>
				<Text style={styles.productName}>{product.product_name}</Text>
				<Text style={styles.productDescription}>{product.description}</Text>
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
	productDescription: {
		marginVertical: 15,
		color: '#8B8B97'
	},
});
