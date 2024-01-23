import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";

export default function Comment({ text, lineNumber }: any) {
    const [showFullText, setShowFullText] = useState(false);
    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    const renderText = () => {
        if (showFullText) {
            return (
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginLeft: 5,
                    marginRight: 5,
                    textAlign: 'justify',
                    color: 'gray'
                }}>{text}
                    <Text style={{ color: '#0F3D87' }} onPress={toggleShowFullText}>
                        Read less
                    </Text>
                </Text>
            );
        } else {
            return (
                <>
                    <Text
                        style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 5, marginRight: 5, textAlign: 'justify', color: 'gray' }}
                        // numberOfLines={lineNumber}
                        ellipsizeMode="tail"
                    >
                        {text}

                    </Text>
                    {/* <Text style={{ fontWeight: 'bold', fontSize: 14, marginLeft: 5, textAlign: 'justify', color: '#0F3D87', }} onPress={toggleShowFullText}>
                        Read more
                    </Text> */}
                </>
            );
        }

    }

    return (
        <View>
            {/* <Text
                ellipsizeMode="tail"
                numberOfLines={lineNumber}
                style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginLeft: 5,
                    marginRight: 5,
                    textAlign: 'justify',
                    color: 'gray'
                }}>
                {text}
            </Text> */}
            {renderText()}
        </View>
    )
}