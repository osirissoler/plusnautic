import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import asyncStorage from '@react-native-async-storage/async-storage';
import { fetchData, sendData } from '../../httpRequests';
import { Ionicons } from '@expo/vector-icons';
import { formatter } from '../../utils';
import { LanguageContext } from '../../LanguageContext';
import { checkStorage, Loading } from '../../components/Shared';

export default function ListScreen({ navigation }: any) {
    const [fetching, setFetching]: any = useState(false);
    const [typeServices, setTypeServices] = useState([]);
    const [userServicesPrice, setUserServicesPrice] = useState([]);
    const [userServicesPrice1, setUserServicesPrice1] = useState([]);
    const [text, setText] = useState('All request');
    const { translation } = React.useContext(LanguageContext);
    const [showLoading, setShowLoading]: any = useState(false);

    useEffect(() => {
        getInfoPriceService()
        getTypeServices()
    }, [])


    const getTypeServices = async () => {
        setFetching(true)
        let url = `/services/getTypeServiceById/${536}`
        await fetchData(url).then(async (res) => {
            if (res.ok) {
                setTypeServices(res.services)
            }
        })
        setFetching(false)
    }

    const getInfoPriceService = async () => {
        setFetching(true)
        checkStorage('USER_LOGGED', (response: any) => {
            const id = response
            setText('All request')
            let url = `/services/getInfoPriceService/${id}`
            fetchData(url).then((response) => {
                if (response.ok) {
                    setUserServicesPrice(response.service)
                    setUserServicesPrice1(response.service)
                }
            });
            setFetching(false)
        });
    }

    const filterServicesPrice = async (id: any) => {
        const data = userServicesPrice1.filter((e) => {
            return e.Services.TypeServices.id === id
        })
        setUserServicesPrice(data)
    }

    return (
        
        <View style={styles.body}>
            <Loading showLoading={showLoading} translation={translation} />
            <View style={{ height: '20%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                    <Text style={styles.productTitle2}>
                        {translation.t('TypeServices')}
                    </Text>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        onPress={() => { navigation.navigate('Home') }}>
                        <Text style={styles.seeAll}>
                            {translation.t('home')}
                        </Text>
                        <Ionicons name="md-exit-outline" size={20} color="#5f7ceb" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    horizontal
                    refreshing={fetching}
                    data={typeServices}
                    onRefresh={getTypeServices}P
                    renderItem={({ item }: any) => (
                        <View>
                            <View style={{ alignItems: 'center', }}>
                                <TouchableOpacity
                                    style={styles.productCard}
                                    onPress={() => {
                                        filterServicesPrice(item.id)
                                        setText((translation.locale.includes('en') && item.name) ||
                                        translation.locale.includes('es') && item.nombre)
                                    }}
                                >
                                    <View style={{ height: 40, width: 40, marginBottom: 10 }}>
                                        <Image source={{ uri: item.img }} style={{ height: '100%', width: 45 }} />
                                    </View>
                                    <Text style={styles.productTitle}>
                                        {
                                            (translation.locale.includes('en') && item.name) ||
                                            translation.locale.includes('es') && item.nombre
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                >
                </FlatList>
            </View>
            <View style={{ height: '80%', marginBottom: 10 }}>
                <Text style={styles.productTitle2}>
                    {/* My request Services */}
                    {/* maintenance */}
                    {translation.t('maintenance')}
                </Text>
                <Text style={styles.seeAll}>{text}</Text>
                <FlatList
                    refreshing={fetching}
                    data={userServicesPrice}
                    onRefresh={getInfoPriceService}
                    renderItem={({ item }: any) => (
                        <TouchableOpacity style={{ height: 90, borderColor: '#8B8B9720', backgroundColor: '#F7F7F7', marginBottom: 10, borderRadius: 10 }}
                            onPress={() => { navigation.navigate('Accept', { item: item }) }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.productCard2}>
                                        <ImageBackground
                                            source={{ uri: (item.driver_img == null || item.driver_img == '') ? 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png' : item.driver_img }}
                                            resizeMode={'cover'}
                                            style={{ width: 30, height: 30 }}
                                            imageStyle={{ borderRadius: 8 }}
                                        />
                                    </View>
                                    <View style={{}}>
                                        <Text style={{ fontWeight: 'bold', marginVertical: 5 }}>{item.driver_first_name} {item.driver_last_name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{translation.t('price')} </Text>
                                            <Text>{formatter(item.price)}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{translation.t('payout')} </Text>
                                            <Text>{
                                                (translation.locale.includes('en') && item.ServicesStatus_name) ||
                                                translation.locale.includes('es') && item.ServicesStatus_nombre
                                            }</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ paddingRight: 10 }}>
                                    <View style={{ marginHorizontal: 10 }}>
                                        <Ionicons name="md-exit-outline" size={25} color="#5f7ceb" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                >
                </FlatList>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    productCard: {
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcecf2',
        borderRadius: 20,
        marginVertical: 10,
        width: 115,
        height: 115,
        marginLeft: 10

    },
    productCard2: {
        // padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcecf2',
        borderRadius: 60,
        marginVertical: 10,
        marginHorizontal: 10,
        width: 70,
        height: 70,

    },
    productTitle: {
        fontSize: 13,
        fontWeight: '600'
    },
    productTitle2: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2
    },
    seeAll: {
        fontSize: 14,
        marginRight: 2,
        color: 'gray',
        marginBottom: 3

    }

});
