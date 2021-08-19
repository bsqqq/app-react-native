import React, { } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";


export default function ListaDeAPR() {
    const navigation = useNavigation()
    return (
        <View style={style.container}>
            <Text>ListaDeAPR.tsx</Text>
            <View style={style.buttonPosition}>
                <TouchableOpacity
                    style={style.button}
                    onPress={() => navigation.navigate("preAPR")}
                >
                    <Text style={style.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40
    },
    button: {
        backgroundColor: "lightblue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 40,
        height: 76,
        width: 76,
      },
      buttonText: {
        color: "white",
        fontSize: 35,
        paddingHorizontal: 21,
      },
      buttonPosition: {
        position: "absolute",
        alignSelf: "flex-end",
        bottom: 20,
        right: 20,
      },
})