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
    View
} from "react-native";
import Button from '../components/NextButton'
import cpfMask from '../utils/CpfMask'

import AuthContext from '../contexts/auth'

export default function Login() {
    const [isFocusedCPF, setIsFocusedCPF] = useState(false)
    const [isFocusedSenha, setIsFocusedSenha] = useState(false)
    const [isFilledCPF, setIsFilledCPF] = useState(false)
    const [isFilledSenha, setIsFilledSenha] = useState(false)
    const [cpf, setCpf] = useState("")
    const [senha, setSenha] = useState("")

    const { signIn } = useContext(AuthContext)

    async function handleSignIn(): Promise<void> {
        if ((isFilledCPF && isFilledSenha))
            await signIn(cpf, senha)
    }
    function handleInputBlurCPF(): void {
        setIsFocusedCPF(false)
        setIsFilledCPF(!!cpf)
    }
    function handleInputChangeCPF(value: string): void {
        setIsFilledCPF(!!value)
        setCpf(cpfMask(value))
    }
    function handleInputBlurSenha(): void {
        setIsFocusedSenha(false)
        setIsFilledSenha(!!senha)
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
                            <Text style={{ fontSize: 30, position: 'relative', top: 0 }}>Bem Vindo!</Text>
                            <Text style={style.titulo}>Login</Text>
                            <TextInput
                                placeholder="CPF"
                                style={[
                                    style.input,
                                    (isFocusedCPF || isFilledCPF) && { borderColor: 'lightblue' }
                                ]}
                                keyboardType='number-pad'
                                onBlur={handleInputBlurCPF}
                                onFocus={() => setIsFocusedCPF(true)}
                                onChangeText={handleInputChangeCPF}
                            />
                            <TextInput
                                placeholder="Senha"
                                style={[
                                    style.input,
                                    (isFocusedSenha || isFilledSenha) && { borderColor: 'lightblue' }
                                ]}
                                onFocus={() => setIsFocusedSenha(true)}
                                onBlur={handleInputBlurSenha}
                                onChangeText={handleInputChangeSenha}
                                secureTextEntry={true}
                            />
                            <Button texto={"Entrar"} onPress={handleSignIn} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
// matricula: 001745
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