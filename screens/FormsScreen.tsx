import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { LanguageContext } from '../LanguageContext';
import StepIndicator from 'react-native-step-indicator';
import { ObjectSchema } from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { fetchData, sendData } from '../httpRequests';
import { checkStorage, Loading } from '../components/Shared';
import axios from 'axios';
import WebView from 'react-native-webview';
import Toast from 'react-native-root-toast';
const labels = ["Personal Information", "Current Employment", "Bankin and credit", "Rental history"];
const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
}


export default function FormsScreen({ navigation, route }: any) {
    const { translation } = React.useContext(LanguageContext);
    const [currentPosition, setcurrentPosition] = useState(0);
    const [placetoPayUrl, setplacetoPayUrl] = useState('')
    const [placeToPayOperationFineshed, setplaceToPayOperationFineshed] = useState(false);
    const [showPlaceToPayview, setshowPlaceToPayview] = useState(false);
    const URLToRiderect = "https://coopharma-83beb.web.app/";
    const [isCreactedOrder, setisCreactedOrder] = useState(false);
    const [requestId, setrequestId] = useState('');
    const [showLoading, setShowLoading]: any = useState(false);
    const [TOKEN, setTOKEN] = useState('')
    const [defaultInformation, setdefaultInformation] = useState({})
  useEffect(() => {
    getDefaultRequest()
}, [])
const getDefaultRequest=()=>{
    const url='/occupancyRequest/getDefaultRequest'
      checkStorage('USER_LOGGED',  (user_id: any) => {
        sendData(url,{user_id}).then((response)=>{
            setdefaultInformation(response["OccupancyRequest"])
            console.log(defaultInformation)
        })
      })
      
  }

   let datai:any = {
        ...defaultInformation
        // code: '',
        // FullName: 'javier',
        // DateOfBirth: '',
        // SSN: '',
        // Phone: '',
        // Email: '',
        // Address: '',
        // City: '',
        // State: '',
        // Zipcode: '',

        // CurrentLandlord: '',

        // LandlordPhone: '',

        // RentAmount: '',

        // MoveInDate: '',

        // Expiration: '',

        // ReasonForMoving: '',

        // AreYouBeingEvicted: false,

        // WhoShouldWeContactInCaseEmergency: '',

        // EmergencyPhone: '',

        // EmergencyAddress: '',

        // EmergencyCity: '',

        // EmergencyState: '',

        // EmergencyZipcode: '',

        // EmergencyPersonRelationship: '',

        // FutureTenant: '',

        // FutureTenantBirthDay: ''

    }
    const [DataInfo, setDataInfo]: any = useState({...datai})
    const onPageChange = (position: any) => {
        //console.log(position)
        setcurrentPosition(position)
    }
    const renderItem = ({ item }: any) => {
        return <Item item={item} />
    }


    const Item = ({ item }: any) => {
        const [text, setText] = useState('')
        const structureData = () => {
            // DataInfo[item.name]=text
            let inputFields ={...datai}
            inputFields[item.name]=text
            setDataInfo({...inputFields})
            setdefaultInformation({...DataInfo})
            //datai[item.name] =t;
           // console.log(datai[item.name])
            //setData(data)
            //setDataInfo(datai)
           
        }
        //console.log(datai)
        //setDataInfo(datai)

        return (
            <View>
                <Text style={styles.labelInput}>
                    {item.displayName}
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(t)=>{setText(t); datai[item.name]=t}}
                    // onChange={structureData}
                    // onBlur={handleBlur('fullName')}
                    value={datai[item.name]}
                />
            </View>
        )
    };
    const personalInformation = [{
        name: 'FullName',
        displayName: 'Full Name',
        type: 'Text'
    },
    {
        name: 'DateOfBirth',
        displayName: 'Date of Birth',
        type: 'Date'
    }, {
        name: 'SSN',
        displayName: 'SSN',
        type: 'Text'
    }, {
        name: 'Phone',
        displayName: 'Phone',
        type: 'Text'
    }, {
        name: 'Email',
        displayName: 'Email',
        type: 'Text'
    }, {
        name: 'Address',
        displayName: 'Address',
        type: 'Text'
    }, {
        name: 'City',
        displayName: 'City',
        type: 'Text'
    }, {
        name: 'State',
        displayName: 'State',
        type: 'Text'
    }, {
        name: 'Zipcode',
        displayName: 'Zipcode',
        type: 'Text'
    }, {
        name: 'CurrentLandlord',
        displayName: 'Current Landlord',
        type: 'Text'
    }, {
        name: 'LandlordPhone',
        displayName: "Landlord's Phone",
        type: 'Text'
    }, {
        name: 'RentAmount',
        displayName: 'Rent Amount',
        type: 'Text'
    }, {
        name: 'MoveInDate',
        displayName: 'Move in Date',
        type: 'Date'
    }, {
        name: 'Expiration',
        displayName: 'Expiration',
        type: 'Text'
    }, {
        name: 'ReasonForMoving',
        displayName: 'Reason for Moving',
        type: 'Text'
    }, {
        name: 'AreYouBeingEvicted',
        displayName: 'Are you being evicted?',
        type: 'Bool'
    }, {
        name: 'WhoShouldWeContactInCaseEmergency',
        displayName: 'Who should we contact in case emergency?',
        type: 'Text'
    }, {
        name: 'EmergencyPhone',
        displayName: 'Emergency Phone',
        type: 'Text'
    }, {
        name: 'EmergencyAddress',
        displayName: 'Emergency Address',
        type: 'Text'
    }, {
        name: 'EmergencyCity',
        displayName: 'Emergency City',
        type: 'Text'
    }, {
        name: 'EmergencyState',
        displayName: 'Emergency State',
        type: 'Text'
    }, {
        name: 'EmergencyZipcode',
        displayName: 'Emergency zipcode',
        type: 'Text'
    }, {
        name: 'EmergencyPersonRelationship',
        displayName: "Emergency Person's relationship",
        type: 'Text'
    }, {
        name: "FutureTenantName",
        displayName: "Future Tenant's Name",
        type: 'Text'
    }, {
        name: 'FutureTenantBirthDay',
        displayName: "Future Tenant's birthday",
        type: 'Text'
    }
    ]


    const fields = personalInformation
    const apply = async () => {
       // console.log("dataToBeSent",data)
       //console.log(DataInfo)
        setShowLoading(true);
        checkStorage('USER_LOGGED',  (user_id: any) => {
            checkStorage('USER_PHARMACY', (response: any) => {
                let res = JSON.parse(response)
                const data2 = {
                    ...datai,
                    requestId,
                    pharmacy_id: 536,
                    TOKEN,
                    user_id,
                    product_pharmacy_id: route.params.product_pharmacy_id
                }
                const pharmacy = JSON.parse(response);
                const url = '/occupancyRequest/createOccupancyRequest';
                sendData(url, data2).then((response) => {
                    //    navigation.navigate('Root', { screen: 'ListPharmacies' }) 
                    // hideLoadingModal(() => {
                    //     const OccupancyRequest = response;
                    //    // console.log(OccupancyRequest, "or response")
                    //     if (OccupancyRequest) {
                    //         setisCreactedOrder(true)
                    //         Alert.alert(
                    //             translation.t('alertInfoTitle'),
                    //             (translation.locale.includes('en') && response.message) ||
                    //             (translation.locale.includes('es') && response.mensaje),
                    //             [
                    //                 {
                    //                     text: 'Ok',
                    //                     onPress: () => { }//createOrderNotification(order, pharmacy)
                    //                 }
                    //             ]
                    //         );
                    //     } else {
                    //         showErrorToast(translation.t('httpConnectionError'));
                    //     }
                    // });
                })
            })
        })
    }
    const confirmAplication= async()=>{
        checkStorage('USER_LOGGED', async (user: any) => {
            const url ='/occupancyRequest/confirmCreation'
            const data={
                user_id:user,
                requestId,
                TOKEN,
                ...datai
            }
            sendData(url,data).then((response)=>{
                hideLoadingModal(() => {
                    const OccupancyRequest = response;
                   // console.log(OccupancyRequest, "or response")
                    if (OccupancyRequest) {
                        setisCreactedOrder(true)
                        Alert.alert(
                            translation.t('alertInfoTitle'),
                            (translation.locale.includes('en') && response.message) ||
                            (translation.locale.includes('es') && response.mensaje),
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => { }//createOrderNotification(order, pharmacy)
                                }
                            ]
                        );
                    } else {
                        showErrorToast(translation.t('httpConnectionError'));
                    }
                });
            })
        })
    }
    //let dataToBeSent:any;
    const openPlaceToPayView = async () => {
        apply()
        //setDataInfo(datai)
        console.log("data to be sent", DataInfo["FullName"],"data change",datai["FullName"])
        //  //dataToBeSent=data;
        // //if ((address.id || pickupStatus) /*&& card*/) {
        // //console.log("adress", address)
        // //console.log("evaluate condition")
        // //setloading(true)
        // //await setShowLoading(true)
        // let pharmacy_id;
        // let userId;
        // // checkStorage('USER_PHARMACY',(response: any) => {response? console.log("pid",JSON.parse(response).id):false; pharmacy_id = response.id});

        // //esta misma linea aparece en 4 sitios mas en esta vista, crear una variable y volver reutilizable

        // //const TotalOrder = pickupStatus ? route.params.orderTotal - 6 - (6 * 0.115) : route.params.orderTotal;
        // //console.log("pTp",route.params.products,route.params.products.map((x:any)=>x.Product_Name).join(', '))
        async function getIpClient() {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                //console.log(response.data.ip)
                return response.data.ip
            } catch (error) {
                console.error(error);
            }
        }
        const url = '/placetopay/checkin/requestId';
        checkStorage('USER_PHARMACY', (response: any) => {
            checkStorage('USER_LOGGED', async (user: any) => {
                checkStorage('TOKEN', async (resp: any) => {
                    console.log('Console de prueba')
                    setTOKEN(resp)
                    //console.log(user); 
                    //userId = user
                    let res = JSON.parse(response)
                    //console.log(res.id)
                    const data3 = {
                        pharmacy_id: 536,
                        user_id: user,
                        ipAdress: await getIpClient(),
                        description:  'Occupancy Aplication',// route.params.products.map((x: any, index: any) => x.Product_Name).join(', ').replace('"', ''),//address.notes,
                        reference: Math.random().toString(36).substring(2),//route.params.products.map((x:any)=>x.Product_Name).join(', '),
                        amount: 35.00,
                        returnUrl: URLToRiderect,
                        token_client: TOKEN,
                        shopping: true
                    }
                    //console.log("before load url", data, url)
                    setShowLoading(true)
                     await sendData(url, data3).then((response) => {
                    setplacetoPayUrl(response.data.processUrl);
                    //     console.log("url response", response);
                        setrequestId(response.data.requestId)
                    //     //hideLoadingModal( ()=>setshowPlaceToPayview(true));
                    //    // setshowPlaceToPayview(true)
                         setShowLoading(false)
                     }).catch((e) => { console.log("Razon del  fallo", e); setShowLoading(false) })
                    //console.log("before load url,2", data, url)
                    setshowPlaceToPayview(true)
                })
            });
        });

        // //console.log(route.params.products)
        // //setloading(false)

        // await setShowLoading(false)
        // // }
        // // else {
        // // 	//if (address.id ||pickupStatus) 
        // // 	showErrorToast(translation.t('NoAddressOrPickUpError'));
        // // 	//else if (!card) showErrorToast(translation.t('NoCardError'));
        // // }
        console.log("data to be sent", DataInfo["FullName"],"data change",datai["FullName"])
    }
    const onNavigationStateChange = (state: any) => {
        console.log("estado", state)
        let intervalId: any;
        setplaceToPayOperationFineshed(URLToRiderect == state.url)
        if (placetoPayUrl != state.url && !placeToPayOperationFineshed && state.navigationType == 'other' && !state.loading) {
            //	console.log("transaction has been completed", placetoPayUrl != state.url, !placeToPayOperationFineshed)
            const url = `/placeToPay/consultSession/${requestId}`
            fetchData(url).then((res) => {
                console.log(res.respon.status.status)
                if (res.respon.status.status !== "REJECTED" && res.respon.status.status !== 'PENDING') {
                    if (!isCreactedOrder) {
                        clearInterval(intervalId);
                       // console.log("create data", data)
                       // apply();
                       confirmAplication()
                       setisCreactedOrder(!isCreactedOrder)
                       console.log("Aproved")
                    }
                    else {
                        clearInterval(intervalId);
                        console.log("return to home")
                        checkStorage('USER_PHARMACY', (response: any) => {
                            const pharmacy = JSON.parse(response);
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Root',
                                        params: {
                                            phId: 536,
                                            
                                        },
                                        screen: 'Home'
                                    }
                                ]
                            });
                        })
                    }
                }
                else if (res.respon.status.status === 'PENDING') {
                    hideLoadingModal(() => {
                        intervalId = setInterval(() => {
                            fetchData(url).then((res) => {
                                console.log(res.respon.status.status)
                                if (res.respon.status.status !== "REJECTED" /*&& res.respon.status.status !== 'PENDING'*/) {
                                    if (!isCreactedOrder) {
                                        clearInterval(intervalId);
                                       // apply();
                                       confirmAplication()
                                       console.log("return to home")
                                       setisCreactedOrder(!isCreactedOrder)
                                    }
                                    else {
                                        clearInterval(intervalId);
                                        checkStorage('USER_PHARMACY', (response: any) => {
                                            const pharmacy = JSON.parse(response);
                                            navigation.reset({
                                                index: 0,
                                                routes: [
                                                    {
                                                        name: 'Root',
                                                        params: {
                                                            phId: 536,
                                                        },
                                                        screen: 'Home'
                                                    }
                                                ]
                                            });
                                        })
                                    }
                                }
                            })
                            console.log("interval test")
                        }, 10000);
                    })

                }
                else {

                    // Alert.alert(
                    // 	"Alert Title",
                    // 	"My Alert Msg",
                    // 	[
                    // 		{
                    // 			text: "Cancel",
                    // 			onPress: () => console.log("Cancel Pressed"),
                    // 			style: "cancel"
                    // 		},
                    // 	]
                    // );
                    console.log("rejected")
                    clearInterval(intervalId);
                    console.log("shopping card")
                   // navigation.navigate('Root', { screen: 'ShoppingCart' })
                }

            }).catch((error) => console.log("error consult", error))

        }
        console.log(placeToPayOperationFineshed)
        if (placeToPayOperationFineshed) {
            //console.log("operation fineched")
            //console.log("Opera", placetoPayUrl, state.url)
            checkStorage('USER_PHARMACY', (response: any) => {
                const pharmacy = JSON.parse(response);
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Root',
                            params: {
                                phId: 536,
                                
                            },
                            screen: 'Home'
                        }
                    ]
                });
            })
            //setauxCont(0)
            setshowPlaceToPayview(false)
        }
        //setauxCont(auxCont + 1)
        //console.log(placeToPayOperationFineshed)
    }
    const hideLoadingModal = (callback: Function) => {
        setShowLoading(true);
        setTimeout(() => {
            callback();
            setShowLoading(false);
        }, 1500);
    };
    const showErrorToast = (message: string) => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: 'red', width: '80%' }
        });
    };
    //console.log(data)
    return (
        <SafeAreaView style={styles.container}>
            <Loading showLoading={showLoading} translation={translation} />
            {
                (!placeToPayOperationFineshed && showPlaceToPayview/*&&!showLoading*/) &&
                <View style={{ height: '100%' }}>
                    <WebView
                        source={{ uri: placetoPayUrl }}
                        //originWhitelist={['*']}
                        onNavigationStateChange={onNavigationStateChange}
                    />
                </View>
            }
            {
                !(!placeToPayOperationFineshed && showPlaceToPayview/*&&!showLoading*/) &&
                <View style={styles.body}>
                    <View>
                        <StepIndicator
                            customStyles={customStyles}
                            currentPosition={currentPosition}
                            onPress={onPageChange}
                            stepCount={4}
                            labels={labels}
                        />
                    </View>
                    <View  >
                        <FlatList
                            data={fields}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.name}
                        // extraData={selectedId}
                        />
                    </View>
                    {/* <Addresses navigation={navigation} translation={translation} /> */}
                    <View>
                        <TouchableOpacity style={styles.productAdd} onPress={() => {openPlaceToPayView() }}>
                            <Text style={styles.productAddText}>
                                {translation.t('productDetailsAddCartText')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#F7F7F7',
        height: '100%'
    },
    body: {
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,

        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: '75%'
    },

    productAdd: {
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: '#FF4E02',
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    labelInput: {
        fontSize: 15,
        color: '#8B8B97',
        marginTop: 10
    },
    textInput: {
        height: 50,
        width: '100%',
        borderColor: '#F7F7F7',
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        paddingRight: 45,
        paddingLeft: 20,
        borderRadius: 5
    },
    productAddText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    },
    item: {
        // backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});

