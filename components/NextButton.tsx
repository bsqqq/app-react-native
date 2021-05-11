import React from 'react'
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
    texto: string
}

export default function Button({ texto, ...resto }: ButtonProps) {
    return(
        <TouchableOpacity style={style.button} {...resto}>
            <Text style={style.buttonText}>
                { texto }
            </Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    button: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 30,
        minHeight: 56,
        minWidth: 56,
        maxWidth: 300,
        paddingHorizontal: 10
    },
    buttonText: {
        color: "white",
        fontSize: 25,
        paddingHorizontal: 50
    }
})