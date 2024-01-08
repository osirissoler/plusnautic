
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
import AdsScreen from './AdsScreen';
let list: any[] = [];

export default function MuellesScreen({ navigation, route }:any) {
    const { translation } = React.useContext(LanguageContext);
    const defaultProductImg = 'https://img.freepik.com/vector-premium/muelle-pesca-oceano-ilustracion_155504-1.jpg'
    const [initialImg, setinitialImage] = useState('https://file-coopharma.nyc3.digitaloceanspaces.com/16817528019excursiones-desde-san-sebastian.jpg');
    const [listProduct, listProducs]: any = useState([
    ]);
    const [fetching, setFetching]: any = useState(false)
    const [showLoading, setShowLoading]: any = useState(false)
    const [visible, setVisible] = useState(true);



    useEffect(() => {
        getPharmacies()
    }, [])

    const getPharmacies = async () => {
        setFetching(true)
        let url = `/products/getProductsByPharmacy/${route.params.id}`
        await fetchData(url).then((response) => {
            if (response.ok) {
                listProducs(response.pharmacyproduct)

            } else {
            }
            setFetching(false)
        })
    }



    const sendPharmacyUser = async () => {
        checkStorage('USER_LOGGED', async (id: any) => {
            const url = '/userPharmacy/createUserPharmacy';
            const newList = list.filter((element: any) => {
                return element.selected === true
            }).map((e) => {
                return {
                    pharmacy_id: e.id,
                    user_id: id
                }
            })
            await sendData(url, { data: newList }).then((response) => {
                if (response.ok) {
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
                }
            })
        })

    }

    return (
        <Container>
            <Loading showLoading={showLoading} translation={translation} />
            <HeaderComponent />

            <View style={{ height: '100%' }}>
                <FlatList
                    refreshing={fetching}
                    data={listProduct}
                    onRefresh={getPharmacies}
                    style={styles.body}
                    ListHeaderComponent={
                        <View>
                            {(visible)
                                ? <AdsScreen code={"Services"} img={initialImg} />
                                : <Image style={styles.headerImage} source={{ uri: initialImg }} />
                            }
                        </View>
                    }
                    renderItem={({ item, index }: any) => (
                        <TouchableOpacity style={styles.productCard} onPress={() => {
                            navigation.navigate('ProductDetails', {item})
                            // ProductDetails
                        }

                        }>
                            <View style={styles.productImage}>
                                <Image
                                    source={{ uri: item.product_img ? item.product_img : defaultProductImg }}
                                    style={{ flex: 1, resizeMode: 'contain' }}
                                />
                            </View>
                            <View style={{ justifyContent: 'space-between', width: 160 }}>
                                <Text style={styles.productTitle}>{item.product_name}</Text>
                                <Text style={styles.productTitle}>{item.product_description}</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: 20
                                    }}
                                >
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                >
                </FlatList>
            </View>
        </Container >
    )
}
const styles = StyleSheet.create({
    productCard: {
        padding: 10,
        marginVertical: 4,
        // marginHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    body: {
        padding: 20,
        flexDirection: 'column',
        marginBottom: 60
    },
    productImage: {
        height: 80,
        width: 80
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '500'
    },

    productAdd: {
        backgroundColor: '#FE6A00',
        padding: 4,
        borderRadius: 100
    },
    headerImage: {
        marginBottom: 20,
        height: 180,
        width: '100%',
        borderRadius: 10,
        // aspectRatio:1/1
    },
    productAddIcon: {
        // color: 'white',
        // fontSize: 20
    },
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#5f7ceb",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
    },

})