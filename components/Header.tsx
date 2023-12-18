import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { checkStorage } from './Shared';
import { LanguageContext } from '../LanguageContext';

export default function HeaderComponent({ screen, navigation, openFilterModal }: any) {
	const { translation } = React.useContext(LanguageContext);
	const checkUserStorage = () => {
		navigation.reset({
			index: 0,
			routes: [
				{
					name: 'Root',
					params: { phId: 536 },
					screen: 'Home'
				}
			]
		});
	};

	return (
		<View style={styles.header}>
			<Image style={styles.logo} source={require('../assets/images/slogan.png')} />
			{/* {screen == 'signin' && (
				<Pressable
					style={[styles.screenOptions, { justifyContent: 'flex-end', padding: 10 }]}
					onPress={() => checkUserStorage()}
				>
					<Text style={styles.optionText}>{translation.t('headerSkipLabel')}</Text>
				</Pressable>
			)} */}

			{screen == 'home' && (
				<View style={[styles.screenOptions, { justifyContent: 'space-between' }]}>
					<Pressable style={styles.optionIcon} onPress={() => navigation.navigate('ListProducts')}>
						<AntDesign name='search1' size={22} />
					</Pressable>
					<Pressable style={styles.optionIcon} onPress={() => openFilterModal()}>
						<AntDesign name='filter' size={22} />
					</Pressable>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginTop: 10,
		height: 40,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	logo: {
		height: 50,
		width: '50%',
		// flex: 1,
		resizeMode: 'contain'
	},
	screenOptions: {
		flex: 1,
		width: '100%',
		paddingHorizontal: 30,
		position: 'absolute',
		flexDirection: 'row'
	},
	optionText: {
		fontSize: 17,
		color: '#8B8B97'
	},
	optionIcon: {
		backgroundColor: '#F7F7F7',
		height: 40,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100
	}
});
