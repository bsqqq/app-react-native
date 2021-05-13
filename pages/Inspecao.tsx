import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native'

export default function Inspecao() {
    return (
        <SafeAreaView style={style.container}>
            <ScrollView>
                <TouchableOpacity activeOpacity={0.1}>
                    <Text style={style.cards}>Inspeção.tsx</Text>
                </TouchableOpacity>
                <Text style={style.cards}>Inspeção.tsx</Text> 
                <Text style={style.cards}>Inspeção.tsx</Text>
                <Text style={style.cards}>Inspeção.tsx</Text>
            </ScrollView> 
            <View style={style.buttonPosition}>
                <TouchableOpacity style={style.button} >
                    <Text style={style.buttonText}>
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50
    },
    button: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        height: 76,
        width: 76,
    },
    buttonText: {
        color: "white",
        fontSize: 35,
        paddingHorizontal: 21
    },
    buttonPosition: {
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 20,
        right: 20,
    },
    cards: {
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 2,
        paddingHorizontal: Dimensions.get('window').width * 0.36,
        paddingVertical: 100,
    },

})