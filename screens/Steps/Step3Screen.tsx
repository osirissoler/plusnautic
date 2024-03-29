import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import asyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../../LanguageContext';

export default function Step3Screen({ navigation }: any) {
	const { translation } = React.useContext(LanguageContext);
	const redirectToSignIn = () => {
		asyncStorage.setItem('USER_STEPS', '1');
		navigation.navigate('SignIn');
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.imageParent}>
				<Image style={styles.image} source={require('../../assets/images/plusnauticIcon.png')} />
			</View>
			<Text style={styles.title}>{translation.t('step3Title')}</Text>
			<View style={styles.buttonOutline}>
				<Pressable style={styles.button} onPress={() => redirectToSignIn()}>
					<FontAwesome name='arrow-right' size={24} color='#ffffff' />
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ffffff'
	},
	imageParent: {
		height: 330
	},
	image: {
		width: 300,
		height: 330
	},
	title: {
		color: '#000000',
		textAlign: 'center',
		paddingHorizontal: 15,
		marginVertical: 30,
		paddingTop: 20,
		fontSize: 23
	},
	buttonOutline: {
		borderRadius: 40,
		borderWidth: 6,
		borderColor: '#5f7ceb',
		height: 80,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		borderRadius: 100,
		backgroundColor: '#5f7ceb',
		height: 55,
		width: 55,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
