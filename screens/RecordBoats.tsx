import React, { useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import HeaderComponent from '../components/Header';
import { checkStorage, Container, Loading } from '../components/Shared';
import { BottomPopup } from '../components/BottomPopup';
import { sendData } from '../httpRequests';
import Toast from 'react-native-root-toast';
import asyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../LanguageContext';
import { CheckBox, Separator } from "react-native-btr";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
export default function RecordBoats({ navigation }: any) {
	const { translation } = React.useContext(LanguageContext);
	const [showLoading, setShowLoading]: any = useState(false);
	const [termAndCoditionAccepted, settermAndCoditionAccepted] = useState(false)
    const [engineInputsCounter, setEngineInputsCounter] = useState(1)

	const validationSchema = yup.object().shape({
		fullName: yup.string().required(translation.t('signUpFullNameRequiredText') /* First name is required */),
		phone: yup.string().required(translation.t('signUpPhoneNumberRequiredText') /* Phone number is required */),
		email: yup
			.string()
			.email(translation.t('signUpEmailValidationText') /* Please enter valid email */)
			.required(translation.t('signUpEmailRequiredText') /* Email is required */),
		password: yup
			.string()
			.matches(
				/\w*[a-z]\w*/,
				translation.t('signUpPasswordValidationSmallLetterText') /*Password must have a small letter */
			)
			.matches(
				/\w*[A-Z]\w*/,
				translation.t('signUpPasswordValidationCapitalLetterText') /* Password must have a capital letter */
			)
			.matches(/\d/, translation.t('signUpPasswordValidationNumberText') /* Password must have a number */)
			.min(
				8,
				({ min }: any) =>
					translation.t('signUpPasswordValidationCharactersText') +
					min /* `Password must be at least ${min} characters` */
			)
			.required(translation.t('signUpPasswordRequiredText') /* Password is required */),
		passwordConfirmation: yup
			.string()
			.oneOf([yup.ref('password')], translation.t('signUpPasswordMatchErrorText') /* Passwords do not match */)
			.required(translation.t('signUpPasswordConfirmationRequiredText') /* Confirm password is required */)
	});

	const recordBoat = (values: any) => {
		setShowLoading(true);
		const url = '/user/createClient';
		const data = {
            boat_name: values.boat_name,
		    engine_1: values.engine_1,
            engineYear_1: values.engineYear_1,
            engine_2: values.engine_2,
            engineYear_2: values.engineYear_2,
            engine_3: values.engine_3,
            engineYear_3: values.engineYear_3,
            engine_4: values.engine_4,
            engineYear_4: values.engineYear_4,
            engine_5: values.engine_5,
            engineYear_5: values.engineYear_5,
            engine_6: values.engine_6,
            engineYear_6: values.engineYear_6,
            boat_hull: values.boat_hull,
            electric_plant: values.electric_plant,
            air_conditioner: values.air_conditioner,
            pharmacy_id: values.pharmacy_id
			
		};
		console.log(data)
		sendData(url, data)
			.then((response) => {
				hideLoadingModal(() => {
					if (response.ok) {
						console.log(response.ok, "aqui1");
						const url = '/auth/login';
						sendData(url, values).then((response: any) => {
							setAuthUser(response.id);
						});
					} else {
						showErrorToast(response.message);
						console.log(response, "aqui2");
					}
				});
			})
			.catch((error) => {
				hideLoadingModal(() => {
					showErrorToast(translation.t('httpConnectionError'));

				});
			});
	};

	const setAuthUser = (id: number) => {
		asyncStorage.setItem('USER_LOGGED', id + '');
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

	const hideLoadingModal = (callback: Function) => {
		setTimeout(() => {
			setShowLoading(false);
			callback();
		}, 1500);
	};

	const showErrorToast = (message: string) => {
		Toast.show(message, {
			duration: Toast.durations.LONG,
			containerStyle: { backgroundColor: 'red', width: '80%' }
		});
	};

	let popupRef: any = React.createRef();

	const onShowPopup = () => {
		popupRef.show();
	};

	return (
		<Container style={{ backgroundColor: '#fff', flex: 1, height: '100%' }} keyboard={true}>
			<HeaderComponent navigation={navigation} />
			<Loading showLoading={showLoading} translation={translation} />
			<Text style={styles.title}>{translation.t('signUpTitle')}</Text>
			<ScrollView style={{ padding: 10 }}>
				<Formik
					validationSchema={validationSchema}
					initialValues={{
						boat_name: 'Bote del duro',
						engine_1: 'Soler Y7',
						engineYear_1: '2018',
						engine_2: 'Soler U73',
                        engineYear_2: '2019',
                        engine_3: '',
                        engineYear_3: '',
                        engine_4: '',
                        engineYear_4: '',
                        engine_5: '',
                        engineYear_5: '',
                        engine_6: '',
                        engineYear_6: '',
						boat_hull: 'Bote G23',
                        electric_plant: 'Planta Q931',
                        air_conditioner: 'Aire K9',
                        // pharmacy_id: 'Una marina'
                        
					}}
					onSubmit={(values: any) => recordBoat(values)}
				>
					{({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }: any) => (
						<View>
							<Text style={styles.labelInput}>
								Boat name
							</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('boat_name')}
								onBlur={handleBlur('boat_name')}
								value={values.boat_name}
							/>

                            <Text style={styles.labelInput}>
								Boat hull
							</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('boat_hull')}
								onBlur={handleBlur('boat_hull')}
								value={values.boat_hull}
							/>
                            <Text style={styles.labelInput}>
								Electric plant
							</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('electric_plant')}
								onBlur={handleBlur('electric_plant')}
								value={values.electric_plant}
							/>
                            <Text style={styles.labelInput}>
                                Air conditioner
							</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('air_conditioner')}
								onBlur={handleBlur('air_conditioner')}
								value={values.air_conditioner}
							/>
                            <Text style={styles.labelInput}>
                                Marina
							</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('phone')}
								onBlur={handleBlur('phone')}
								value={values.phone}
								keyboardType='numeric'
							/>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							    <Text style={styles.labelInput}>Engine 1</Text>

                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <TouchableOpacity style={styles.addButton} onPress={() => engineInputsCounter > 1 &&  setEngineInputsCounter(engineInputsCounter - 1)}>
                                    <Text>remove engine</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addButton} onPress={() => engineInputsCounter < 6 && setEngineInputsCounter(engineInputsCounter + 1)}>
                                    <Text>Add engine</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_1')}
								onBlur={handleBlur('engine_1')}
								value={values.engine_1}
							/>

							<Text style={styles.labelInput}>{translation.t('Year') + ' 1'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_1')}
								onBlur={handleBlur('engineYear_1')}
								value={values.engineYear_1}
                                keyboardType='numeric'
							/>

                            {engineInputsCounter >= 2 && <>
                            <Text style={styles.labelInput}>{translation.t('Engine') + ' 2'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_2')}
								onBlur={handleBlur('engine_2')}
								value={values.engine_2} 
                            />
                            <Text style={styles.labelInput}>{translation.t('Year') + ' 2'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_2')}
								onBlur={handleBlur('engineYear_2')}
								value={values.engineYear_2}
                                keyboardType='numeric'
							/>
                            </>}

                            {engineInputsCounter >= 3 && <>
                            <Text style={styles.labelInput}>{translation.t('Engine') + ' 3'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_3')}
								onBlur={handleBlur('engine_3')}
								value={values.engine_3}
                            />
                            <Text style={styles.labelInput}>{translation.t('Year') + ' 3'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_3')}
								onBlur={handleBlur('engineYear_3')}
								value={values.engineYear_3}
                                keyboardType='numeric'
							/>
                            </>}

                            {engineInputsCounter >= 4 && <>
                            <Text style={styles.labelInput}>{translation.t('Engine') + ' 4'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_4')}
								onBlur={handleBlur('engine_4')}
								value={values.engine_4}
                            />
                            <Text style={styles.labelInput}>{translation.t('Year') + ' 4'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_4')}
								onBlur={handleBlur('engineYear_4')}
								value={values.engineYear_4}
                                keyboardType='numeric'
							/>
                            </>}

                            {engineInputsCounter >= 5 && <>
                            <Text style={styles.labelInput}>{translation.t('Engine') + ' 5'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_5')}
								onBlur={handleBlur('engine_5')}
								value={values.engine_5}
                            />
                            <Text style={styles.labelInput}>{translation.t('Year') + ' 5'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_5')}
								onBlur={handleBlur('engineYear_5')}
								value={values.engineYear_5}
                                keyboardType='numeric'
							/>
                            </>}

                            {engineInputsCounter >= 6 && <>
                            <Text style={styles.labelInput}>{translation.t('Engine') + ' 6'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engine_6')}
								onBlur={handleBlur('engine_6')}
								value={values.engine_6}
                            />
                            <Text style={styles.labelInput}>{translation.t('Year') + ' 6'}</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('engineYear_6')}
								onBlur={handleBlur('engineYear_6')}
								value={values.engineYear_6}
                                keyboardType='numeric'
							/>
                            </>}

                            <TouchableOpacity
								style={styles.registerButton}
								onPress={() => (Object.keys(errors).length > 0 ? onShowPopup() : handleSubmit())}
							>
								<Text style={styles.registerButtonText} >
									{translation.t('signUpButtonText') /*  Register */}
								</Text>
							</TouchableOpacity>

						</View>
					)}
				</Formik>
			</ScrollView>
		</Container>
	);
}

const styles = StyleSheet.create({
	termCoditions: {
		// flex: 1,
		paddingHorizontal: 16,
		// marginBottom:40,
		color: "#128780",

	},

	container: {
		// backgroundColor: '#fff',
		flex: 1,
		justifyContent: "center",
	},
	row: {
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
		padding: 16,
	},
	label: {
		flex: 1,
		paddingHorizontal: 16,
	},
	body: {
		// marginHorizontal: 15,
		// backgroundColor: '#fff',
		// borderRadius: 30,
		// paddingBottom:40

	},
	title: {
		fontSize: 36,
		fontWeight: '300',
		marginBottom: 5,
		paddingLeft: 25
	},
	labelInput: {
		fontSize: 15,
		color: '#8B8B97',
		marginTop: 10
	},
    addButton:{
		marginVertical: 20,
		fontSize: 20,
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
    },
	textInput: {
		height: 50,
		width: '100%',
		borderColor: '#F7F7F7',
		borderWidth: 2,
		backgroundColor: '#F7F7F7',
		paddingRight: 45,
		paddingLeft: 20,
		borderRadius: 5
	},
	formInputIcon: {
		position: 'relative',
		flexDirection: 'row'
	},
	inputIcon: {
		position: 'absolute',
		right: 5,
		top: '15%',
		zIndex: 2,
		padding: 10
	},
	errorText: {
		maxHeight: 20,
		textAlign: 'center'
	},
	registerButton: {
		width: '100%',
		height: 50,
		backgroundColor: '#5f7ceb',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		marginTop: 20
	},
	registerButtonDisabled: {
		width: '100%',
		height: 50,
		backgroundColor: '#ccc',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		marginTop: 20
	},

	registerButtonText: {
		color: '#ffffff',
		fontSize: 18
	},
	loginText: {
		textAlign: 'center',
		fontSize: 14
	},
	loginLink: {
		padding: 5,
		color: '#5f7ceb'
	}
});
