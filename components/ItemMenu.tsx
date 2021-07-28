import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, Dimensions } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface ItemProps extends TouchableOpacityProps {
    titulo: string;
    icone: any
}

export default function ItemMenu({ titulo, icone, ...resto }: ItemProps) {
    return (
        <TouchableOpacity style={ styles.item } { ...resto }>
            <Feather name={ icone } style={{fontSize: 60}}/>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}> { titulo } </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 14,
        width: Dimensions.get('window').width * 0.79,
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: "gray",
        borderWidth: 5,
        borderRadius: 15
    }
})