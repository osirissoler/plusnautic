import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ImageBackground, Alert, BackHandler } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import asyncStorage from '@react-native-async-storage/async-storage';
import { fetchData, sendData, sendDataPut } from '../../httpRequests';
import { Ionicons } from '@expo/vector-icons';
import { formatter } from '../../utils';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ProfileScreen from '../ProfileScreen';
import moment from 'moment';
import { AntDesign } from '@expo/vector-icons';
import { LanguageContext } from '../../LanguageContext';
import Toast from 'react-native-root-toast';
import StepIndicator from 'react-native-step-indicator';
import axios from 'axios';
import WebView from 'react-native-webview';
import { checkStorage, Loading } from '../../components/Shared';




export default function AcceptedScreen({ navigation, route }: any) {
    const { translation } = React.useContext(LanguageContext);
    const [service_id, setService_id]: any = useState(route.params.service_id);
    const [minDate, setMinDate] = useState(moment().format('YYYY-MM-DD'));
    const [firstDate, setFirstDate]: any = useState(route.params.item.startDate)
    const [allDate, setAllDate]: any = useState(null)
    const [lastdate, setLastDate]: any = useState(route.params.item.finalDate)
    const [token, setToken]: any = useState('')
    const [userLogged, setUserLogged]: any = useState({})

    const [items, setItems]: any = useState(route.params.item)
    const [priceP, setPriceP]: any = useState(route.params.item.price)
    const [currentPosition, setcurrentPosition]: any = useState(0);
    const URLToRiderect = "https://coopharma-83beb.web.app/";
    const [placeToPayOperationFineshed, setplaceToPayOperationFineshed]: any = useState(false)
    const [showPlaceToPayview, setshowPlaceToPayview]: any = useState(false);
    const [placetoPayUrl, setplacetoPayUrl]: any = useState('')
    const [showLoading, setShowLoading]: any = useState(false);
    const [requestId, setrequestId]: any = useState('')
    

    useEffect(() => {
        fillMarkedDatesAll()
    }, [])

    const fillMarkedDatesAll = () => {
        let saveDAte: any = {}
        saveDAte[firstDate] = { startingDay: true, color: '#5f7ceb', textColor: 'white' }
        saveDAte[lastdate] = { endingDay: true, color: '#5f7ceb', textColor: 'white' }

        let fechas = [];
        let init = moment(firstDate)
        let fin = moment(lastdate)

        while (init.isSameOrBefore(fin)) {
            fechas.push(init.format('YYYY-MM-DD').toString());
            init.add(1, 'days');
        }
        fechas.pop()
        fechas.shift()
        fechas.forEach((e) => {
            saveDAte[e] = { color: '#5f7ceb', textColor: 'white' }
        })

        setAllDate(saveDAte)
    }

    const acceptRequest = async () => {
        const url = `/services/updateUserServicesAccepted`
        const data = {
            user_id: items.user_id,
            service_id: items.service_id,
            id: items.id
        }
        sendDataPut(url, data).then((response) => {
            if (response.ok) {
                showErrorToastGood('Request made correctly')
                navigation.navigate('Profile')
            }
        });
    }

    const showErrorToastGood = (message: string) => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: '#128780', width: '80%' }
        });
    };

    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, []);

    async function getIpClient() {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
           
            return response.data.ip
        } catch (error) {
            console.error(error);
        }
    }
    const sendPayments = async () => {
        setShowLoading(true);
        const url = `/placeToPay/save/requestId`
        const data = {
            ipAdress: await getIpClient(),
            description: "Pago de mantenimiento",
            returnUrl: URLToRiderect,
            amount: priceP,
            reference: Math.random().toString(36).substring(2),
            userServices_id: items.id,
            paymentNumber: 1,
            pharmacy_id: 534,
            user_id: items.user_id,
            token_client: items.services_token
        }
        await sendData(url, data).then((response) => {
            setplacetoPayUrl(response.data.processUrl)
            setshowPlaceToPayview(true)
            setrequestId(response.data.requestId)
        })
        setShowLoading(false);
    }

    const onNavigationStateChange = async (state: any) => {
        setplaceToPayOperationFineshed(URLToRiderect == state.url)
        if (placetoPayUrl != state.url && !placeToPayOperationFineshed && state.navigationType == 'other' && !state.loading) {
            const url = `/placeToPay/consultSession/${requestId}`
            fetchData(url).then((res) => {
                console.log(res.respon.status.status)
                if (res.respon.status.status !== "REJECTED" && res.respon.status.status !== 'PENDING') {
                    const url2 = `/services/updateUserServicesCompleted/${items.id}`
                    sendDataPut(url2, {}).then((res) => {
                        if (res.ok) {
                            showErrorToastGood('Request made correctly')
                            navigation.navigate('Profile')
                        }
                    })
                }
            })

        }

    }
    return (
        <View style={{ height: '100%', backgroundColor: '#ffffff' }}>
            <Loading showLoading={showLoading} translation={translation} />
            {(!placeToPayOperationFineshed && showPlaceToPayview) &&
                <View style={{ height: '100%' }}>
                    <WebView
                        source={{ uri: placetoPayUrl }}
                        onNavigationStateChange={onNavigationStateChange}
                    />
                </View>
            }

            {!(!placeToPayOperationFineshed && showPlaceToPayview) &&
                <View style={{ height: '100%', backgroundColor: 'white' }}>
                    <View style={{ height: '7%', paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' }}>
                        <Text style={styles.labelInput}>{translation.t('EstimatedPrice')} {formatter(items.price)}</Text>
                    </View>

                    <View style={{ height: '45%', paddingHorizontal: 10 }}>
                        <Calendar
                            style={{
                                borderColor: 'gray',
                                height: 310,
                            }}
                            theme={{
                                backgroundColor: '#5f7ceb',
                                textSectionTitleColor: '#5f7ceb',
                                selectedDayBackgroundColor: 'blue',
                                textDisabledColor: 'grey',
                                arrowColor: 'black',
                            }}
                            minDate={minDate}
                            markingType={'period'}
                            markedDates={allDate}
                        >
                        </Calendar>
                    </View>

                    <View style={{ height: '30%' }}>
                        <View style={{ height: '30%', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10 }}>
                            {(firstDate == null)
                                ? <Text style={{ color: '#5f7ceb' }}>{moment().format("LL").toUpperCase()}</Text>
                                : <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#5f7ceb' }}>
                                        {/* <Text style={{ color: 'black' }}> Selected date </Text> */}
                                        ({moment(firstDate).format("LL").toUpperCase()})
                                    </Text>
                                    <Text> {(lastdate != null ? 'to' : '')} </Text>
                                    {(lastdate != null) ? <Text style={{ color: '#5f7ceb' }}>({moment(lastdate).format("LL").toUpperCase()})</Text> : <Text></Text>}
                                </View>
                            }
                        </View>
                    </View>

                   {(items.ServicesStatus_code != 'COMPLETADO' && items.ServicesStatus_code != 'PROCCESING') && <View style={{ height: '18%' }}>
                        {(!items.accepted) ? 
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#5f7ceb',
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderTopEndRadius: 15,
                                    borderTopLeftRadius: 15
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        translation.t('alertWarningTitle'),
                                        translation.t('acceptedRequest'),
                                        [
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    acceptRequest()
                                                }
                                            },
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                    handleBackButtonClick()

                                                }
                                            }
                                        ]
                                    );
                                }}

                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <AntDesign name="checkcircleo" size={26} color="white" style={{ marginRight: 5 }} />
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 18,
                                        fontWeight: '500'
                                    }}>{ translation.t('Accept')}</Text>
                                </View>
                            </TouchableOpacity> :
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'center',
                                    backgroundColor: '#5f7ceb',
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                    borderTopEndRadius: 15,
                                    borderTopLeftRadius: 15
                                }}
                                onPress={() => {
                                    Alert.alert(
                                        translation.t('alertWarningTitle'),
                                        translation.t('acceptedRequest'),
                                        [
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    sendPayments()
                                                }
                                            },
                                            {
                                                text: 'No',
                                                onPress: () => {
                                                    handleBackButtonClick()

                                                }
                                            }
                                        ]
                                    );
                                }}

                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <FontAwesome name="dollar" size={26} color="white" style={{ marginRight: 5 }} />
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 18,
                                        fontWeight: '500'
                                    }}>{translation.t('checkoutPayNowText')}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>}

                </View>}
        </View>
    )
}



const styles = StyleSheet.create({
    body: {
        height: '85%',
        backgroundColor: 'white',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    productImage: {
        height: '69%',
        marginTop: '2%',
    },
    productCard2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3ecec',
        borderRadius: 60,
        marginVertical: 10,
        marginHorizontal: 10,
        width: 70,
        height: 70,
    },
    productTitle2: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4
    },
    productAdd: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#DE221E',
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    productAddText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    },
    labelInput: {
        fontSize: 18,
        color: 'black',
        marginTop: 5,
        fontWeight: '700'

    },
    textInput: {
        height: 50,
        width: '100%',
        backgroundColor: '#F7F7F7',
        paddingRight: 35,
        paddingLeft: 20,
        borderRadius: 5,
        marginVertical: 5
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(243, 27, 27, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700'

    },
    picker: {
        color: 'red',

    },
    calendar: {
        backgroundColor: 'dark'
    }

});
