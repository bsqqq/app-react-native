import React, { useState } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import Button from '../components/NextButton'

export default function NovaInspecao() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Número da inspeção:</Text>
            <TextInput style={styles.input} keyboardType='numeric'/>
            <Text style={styles.titulo}>Data da inspeção:</Text>
            <TextInput 
                style={styles.input} 
                value={`${String(new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'}))} ${String(new Date().toLocaleTimeString())}`} 
                editable={false}
            />
            <Text style={styles.titulo}>OT / OS / SI:</Text>
            <TextInput style={styles.input} keyboardType='numeric'/>
            <Text style={styles.titulo}>Município:</Text>
            <TextInput style={styles.input} keyboardType='numeric'/>
            <Text style={styles.titulo}>Bairro / Localidade:</Text>
            <TextInput style={styles.input} keyboardType='numeric'/>
            <Button texto='Iniciar'/>
        </View>
    )   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input:{
        backgroundColor: 'lightgrey',
        padding: 10,
        width: '100%',
        marginBottom: 20
    }
})