
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, TextInput, ScrollView, Alert, ImageBackground, FlatList, Image } from 'react-native';
import HeaderComponent from '../components/Header';
import { checkLoggedUser, checkStorage, Container, Loading } from '../components/Shared';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as yup from 'yup';
import { LanguageContext } from '../LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { fetchData, sendData } from '../httpRequests';
import Toast from 'react-native-root-toast';
import { AntDesign } from '@expo/vector-icons';
import { CheckBox } from "react-native-elements";
let list: any[] = [];
export default function SendServicesScreen({ navigation, route }: any) {
    console.log(route.params.id);

    const { translation } = React.useContext(LanguageContext);
    // const defaultProductImg = 'http://openmart.online/frontend/imgs/no_image.png?'
    // const [listPharmacy, setListPharmacy]: any = useState([
    // ]);
    // const [fetching, setFetching]: any = useState(false)
    const [showLoading, setShowLoading]: any = useState(false)

    const validationSchema = yup.object().shape({
        description: yup.string().required('Description is required'),
        // senderFaxNumber: yup.string().required('Sender fax number is required'),
        // senderEmail: yup.string().email('Please enter valid sender email').required('Sender email is required'),
        // receiverName: yup.string().required('Receiver name is required'),
        // receiverFaxNumber: yup.string().required('Receiver fax number is required'),
        // receiverEmail: yup.string().email('Please enter valid receiver email').required('Receiver email is required')
    });


    return (
        <Container>
            <Loading showLoading={showLoading} translation={translation} />
            <HeaderComponent />
            <View style={{ position: 'relative', justifyContent: 'center', height: '5%', }}>
                <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                    {route.params.title}
                </Text>
            </View>

            <View style={{ maxHeight: '60%', marginHorizontal:10  }}>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        description: '',
                    }}
                    onSubmit={(values) => {
                        // send(values) 
                    }}
                >
                    {/* //TODO Crear la solicitud de servicios poner que se envie las fotos, description, bote, y el muelle */}
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }) => (
                        <ScrollView>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.labelInput}></Text>
                                    {touched.description && errors.description && (
                                        <Text style={{ color: 'red' }}>{errors.description}</Text>
                                    )}
                                    <Text style={styles.labelInput}>Description</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        value={values.description}
                                        placeholder={'description of the problem'}
                                    />
                                </View>

                            </View>

                            <TouchableOpacity
                                style={[
                                    {
                                        width: '100%',
                                        height: 50,
                                        backgroundColor: '#FB4F03',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 10,
                                        marginTop: 40
                                    },
                                    !isValid && { backgroundColor: '#FB4F03' }
                                ]}
                                onPress={() => handleSubmit()}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 18 }}>Send</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </Formik>
            </View>




        </Container>
    )
}
const styles = StyleSheet.create({
    title: {
        marginVertical: 20,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '700',
        color: '#000'
    },
    productCard: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 60,
        marginVertical: 10,
        width: 100,
        height: 100,
    },
    productIcon: {
        paddingRight: 20,
        color: '#FB4F03'
    },
    productTitle: {
        fontSize: 15,
        fontWeight: '400',
        textAlign: 'center'
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '500'
    },
    productAdd: {
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        height: 20,
        width: 20,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    productAddIcon: {
        color: '#ffffff'
    },
    labelInput: {
        fontSize: 15,
        color: '#8B8B97',
        marginTop: 10
    },
    textInput: {
        height: 150,
        width: '100%',
        borderColor: 'rgba(17, 115, 155, 0.2)',
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        paddingRight: 35,
        paddingLeft: 20,
        borderRadius: 5,
        marginBottom: 10
    },
    profilePicture: {
        height: 400,
        width: '100%',

    },

    productCard2: {

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
        backgroundColor: 'black',
        borderRadius: 10,
        height: 120,
        width: 120,
        marginRight: 10
    },



});