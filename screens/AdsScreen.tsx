
import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput,
    Linking
} from 'react-native';
import { fetchData } from '../httpRequests';
import { LanguageContext } from '../LanguageContext';

export default function AdsScreen({ code, img }: any) {
    const { translation } = React.useContext(LanguageContext);
    const [ads, setAds]: any = useState(true);
    const [arrayAllImage, setArrayAllImage]: any = useState([]);
    const [initialImg, setinitialImage] = useState(img);
    const [intervalo, setIntervalo]: any = useState(null);
    const [data, setData]: any = useState(null);

    let ce: any

    const open = async () => {
        Alert.alert(
            translation.t('alertWarningTitle'),
            translation.t('openSite'), // Do you want to delete this address?
            [
                {
                    text: 'Yes',
                    onPress: async () => {
                        const supported = await Linking.canOpenURL(data);
                        if (supported) {
                            await Linking.openURL(data);
                        } else {
                            Alert.alert(`Don't know how to open this URL: ${supported}`);
                        }
                    }
                },
                {
                    text: translation.t('alertButtonNoText')
                }
            ]
        );
    };

    useEffect(() => {
        getAds()
    }, []);

    const getAds = async () => {
        clearInterval(ce)
        const url = `/advertisements/getAdsBycode/${code}`;
        await fetchData(url).then(async (response) => {
            if (response.ok) {
                setAds(response.ads)
                const adsImg = await response.ads
                await setArrayAllImage(adsImg)
                let v1 = Math.floor(Math.random() * adsImg.length)
                setinitialImage(adsImg[v1].img)
                setData(adsImg[v1].website)
                setIntervalo(setInterval(() => {
                    let v0 = Math.floor(Math.random() * adsImg.length)
                    setinitialImage(adsImg[v0].img)
                    setData(adsImg[v0].website)
                    // console.log(adsImg[v0].img)
                }, 10000))
            }
        })
    }

    return (
        <View >
            <View style={styles.headerImage}>
                <TouchableOpacity onPress={() => open()}>
                    <Image style={styles.headerImage} source={{ uri: initialImg }} />

                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    headerImage: {
        marginBottom: 20,
        height: 180,
        width: '100%',
        borderRadius: 10,
        // aspectRatio:1/1
    },
});