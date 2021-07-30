import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import APRContext from './../contexts/apr';

export default function preAPR() {
    return (
        <View style={style.container}>
            <Text>preAPR.tsx</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})