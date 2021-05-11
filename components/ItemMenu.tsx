import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native'
import { Entypo,  } from '@expo/vector-icons'

interface ItemProps extends TouchableOpacityProps {
    titulo: string;
    icone: any
}

export default function ItemMenu({ titulo, icone, ...resto }: ItemProps) {
    return (
        <TouchableOpacity style={ styles.item } { ...resto }>
            <Entypo name={ icone } style={{fontSize: 70}}/>
            <Text style={{ fontSize: 50 }}> { titulo } </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 20,
        width: 400,
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: "gray",
        borderWidth: 5,
        borderRadius: 10
    }
})