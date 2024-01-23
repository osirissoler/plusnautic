import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Image,
    
} from 'react-native';
import { Container, Loading } from '../components/Shared';
import { LanguageContext } from '../LanguageContext';

export default function PaymentsScreent1({ navigation, route }: any) {
    const { translation } = React.useContext(LanguageContext);
    const [showLoading, setShowLoading]: any = useState(true);
    const [initialImg, setinitialImage] = useState('https://i.pinimg.com/originals/3f/e5/32/3fe532c1bdc63084ab65c1427609a3bd.gif');

    useEffect(() => {
        setTimeout(() => {
            setShowLoading(false);

        }, 1500);

    }, []);



    return (
        <Container>
            <Loading showLoading={showLoading} translation={translation} />
            <View
                style={{
                    width: '100%', height: '100%', padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F7F7F7',
                    borderRadius: 15,
                    marginVertical: 10,
                    minHeight: 200
                }}
            >
                <View >
                    <Text style={{
                        fontWeight: 'bold', fontSize: 20, marginBottom:10
                    }}>There are no activities to show</Text>
                </View>
                {/* <Image source={{ uri: 'https://i.gifer.com/origin/7b/7bce0846b060c95fd5d256b370c5897e.gif' }} style={{ flex: 1, resizeMode: 'contain' }} /> */}
                {/* <Image source={{ uri: 'https://coopharma-file.nyc3.digitaloceanspaces.com/WhatsApp%20Image%202022-12-12%20at%204.32.10%20PM.jpeg' }} style={{ flex: 1, resizeMode: 'contain' }} /> */}

                <Image style={{
                    // marginBottom: 20,
                    height: 180,
                    width: '90%',
                    borderRadius: 100,
                }} source={{ uri: initialImg }} />

            </View>
        </Container>

    )
}