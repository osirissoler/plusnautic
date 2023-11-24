
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
export default function SelectMarinasScreen({ navigation }: any) {
    const { translation } = React.useContext(LanguageContext);
    const defaultProductImg = 'http://openmart.online/frontend/imgs/no_image.png?'
    const [listPharmacy, setListPharmacy]: any = useState([
    ]);
    const [fetching, setFetching]: any = useState(false)
    const [showLoading, setShowLoading]: any = useState(false)



    useEffect(() => {
        getPharmacies()
    }, [])

    const getPharmacies = async () => {
        setFetching(true)
        let url = `/pharmacies/getPharmacies`
        await fetchData(url).then((response) => {
            if (response.ok) {
                setListPharmacy(response.pharmacy)
                response.pharmacy.forEach((element: any) => {
                    list.push({ name: element.name, id: element.id, img: element.img, selected: false })
                });
            } else {
            }
            setFetching(false)
        })
    }

    const selectPharmacy = (index: any) => {
        list[index].selected = !list[index].selected
        setTimeout(() => {
            setFetching(false)
        }, 100)
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
            <View style={{ height: '10%' }}>
                <Text>Buscador</Text>
            </View>
            <View style={{ height: '75%' }}>
                {/* <FlatList
                    refreshing={fetching}
                    data={list}
                    onRefresh={getPharmacies}
                    renderItem={({ item, index }: any) => (
                        <TouchableOpacity style={styles.productCard} onPress={() => {
                            selectPharmacy(index)
                            setFetching(true)
                        }

                        }>
                            <View style={styles.productImage}>
                                <Image
                                    source={{ uri: item.img ? item.img : defaultProductImg }}
                                    style={{ flex: 1, resizeMode: 'contain' }}
                                />
                            </View>
                            <View style={{ justifyContent: 'space-between', width: 160 }}>
                                <Text style={styles.productTitle}>{item.name}</Text>

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
                </FlatList> */}
            </View>
            <View style={{ height: '10%', marginHorizontal: 15, marginTop: 10 }}>
                <TouchableOpacity style={styles.registerButton} onPress={() => {
                    sendPharmacyUser();
                }}>
                    <Text>Save</Text>
                </TouchableOpacity>
            </View>


        </Container >
    )
}
const styles = StyleSheet.create({
    productCard: {
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
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