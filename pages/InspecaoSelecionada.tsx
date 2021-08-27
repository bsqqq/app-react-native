import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default function InspecaoSelecionada() {
    return (
        <View style={style.container}>
            <Text>InspecaoSelecionada.tsx</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})