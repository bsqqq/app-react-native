import React from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import Button from '../components/NextButton'

export default function NovaInspecao() {
function handleNewInspecao() {

}

    const date = new Date()
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.titulo}>Número da inspeção:</Text>
                <TextInput style={styles.input} keyboardType='numeric'/>
                <Text style={styles.titulo}>Data e hora da inspeção:</Text>
                <TextInput 
                    style={styles.input} 
                    value={`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${new Date().toLocaleTimeString()}`} 
                    editable={false}
                />
                <Text style={styles.titulo}>OT / OS / SI:</Text>
                <TextInput style={styles.input} keyboardType='numeric'/>
                <Text style={styles.titulo}>Município:</Text>
                <TextInput style={styles.input} keyboardType='default'/>
                <Text style={styles.titulo}>Bairro / Localidade:</Text>
                <TextInput style={styles.input} keyboardType='default'/>
                </View>
            
                <View style={styles.centralizarBotao}>
                    <Button texto='Iniciar' onPress={handleNewInspecao}/>
                </View>
        </>
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
    },
    centralizarBotao: {
        alignItems: 'center',
        bottom: 60
    }
})