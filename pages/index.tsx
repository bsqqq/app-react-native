import React, { useState, useContext } from 'react'
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

import AuthContext from '../contexts/auth'

export default function Login() {
    const [isFocusedCPF, setIsFocusedCPF] = useState(false)
    const [isFocusedSenha, setIsFocusedSenha] = useState(false)
    const [isFilledCPF, setIsFilledCPF] = useState(false)
    const [isFilledSenha, setIsFilledSenha] = useState(false)
    const [cpf, setCpf] = useState<string>()
    const [senha, setSenha] = useState<string>()
    const navigation = useNavigation()

    const { signIn } = useContext(AuthContext)

    async function handleSignIn(): Promise<void> {
        if ( (isFilledCPF && isFilledSenha) && (cpf == '01587063310' && senha == '999999') ) 
           await signIn();
    }
    function handleInputBlurCPF(): void {
        setIsFocusedCPF(false)
        setIsFilledCPF(!!cpf)
    }
    function handleInputBlurSenha(): void {
        setIsFocusedSenha(false)
        setIsFilledSenha(!!senha)
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
                                onFocus={() => setIsFocusedCPF(true)}
                                returnKeyType='next'
                                onChangeText={handleInputChangeCPF}
                                blurOnSubmit={false}
                            />
                            <TextInput  
                                placeholder="Senha" 
                                style={[
                                    style.input,
                                    (isFocusedSenha || isFilledSenha) && { borderColor: 'lightblue'}
                                ]} 
                                onFocus={() => setIsFocusedSenha(true)}
                                onBlur={handleInputBlurSenha}
                                onChangeText={handleInputChangeSenha}
                                secureTextEntry={true}
                            />
                            
                            <Button texto={"Entrar"} onPress={handleSignIn}/>
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
        justifyContent: "space-around",
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center',
        marginTop: 50
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 30
    },
    titulo: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        marginTop: 30,
    }
})