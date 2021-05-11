import React, { useState } from 'react'
import { 
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    SafeAreaView, 
    StyleSheet, 
    TextInput, 
    Keyboard,
    Platform, 
    Text, 
    View } from "react-native";
import { useNavigation } from '@react-navigation/core';
import Button from '../components/NextButton'

export default function Login() {
    const [isFocusedCPF, setIsFocusedCPF] = useState(false)
    const [isFocusedSenha, setIsFocusedSenha] = useState(false)
    const [isFilledCPF, setIsFilledCPF] = useState(false)
    const [isFilledSenha, setIsFilledSenha] = useState(false)
    const [cpf, setCpf] = useState<string>()
    const [senha, setSenha] = useState<string>()
    const navigation = useNavigation()

    function handleEntry(): void {
        if((isFilledCPF && isFilledSenha) && (cpf == '01587063310' && senha == '999999')) return navigation.navigate("Menu")
    }
    function handleInputBlurCPF(): void {
        setIsFocusedCPF(false)
        setIsFilledCPF(!!cpf)
    }
    function handleInputBlurSenha(): void {
        setIsFocusedSenha(false)
        setIsFilledSenha(!!senha)
    }
    function handleInputFocusCPF(): void {
        setIsFocusedCPF(true)
    }
    function handleInputFocusSenha(): void {
        setIsFocusedSenha(true)
    }
    function handleInputChangeCPF(value: string): void {
        setIsFilledCPF(!!value)
        setCpf(value)
    }
    function handleInputChangeSenha(value: string): void {
        setIsFilledSenha(!!value)
        setSenha(value)
    }

    return (
        <SafeAreaView style={style.container}>
            <KeyboardAvoidingView style={style.container} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={style.content}>
                        <View style={style.form}>
                            <Text style={style.titulo}>Login</Text>
                            <TextInput 
                            placeholder="CPF" 
                            style={[
                                style.input,
                                (isFocusedCPF || isFilledCPF) && { borderColor: 'lightblue'}
                            ]} 
                            keyboardType='number-pad' 
                            onBlur={handleInputBlurCPF}
                            onFocus={handleInputFocusCPF}
                            onChangeText={handleInputChangeCPF}
                            
                            />
                            <TextInput 
                            placeholder="Senha" 
                            style={[
                                style.input,
                                (isFocusedSenha || isFilledSenha) && { borderColor: 'lightblue'}
                            ]} 
                            onFocus={handleInputFocusSenha}
                            onBlur={handleInputBlurSenha}
                            onChangeText={handleInputChangeSenha}
                            secureTextEntry={true}
                            />
                            
                            <Button texto={"Entrar"} onPress={handleEntry}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>    
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignContent: 'center',
    },
    header: {
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: "space-around"
    },
    form: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 54,
        alignItems: 'center',
        marginTop: 350,
        minHeight: '60%',
        paddingBottom: 20
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
    },
    titulo: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        marginTop: 30,
    }
})