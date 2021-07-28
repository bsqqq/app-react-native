import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


export default function Checklist() {
    return (
        <View style={style.container}>
            <Text>Checklist.tsx</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})