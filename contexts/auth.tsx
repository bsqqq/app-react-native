import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/auth'
import * as auth from '../services/auth'
import fb from '../services/firebase'

interface AuthContextData {
    signed: boolean,
    user: object | null | undefined,
    loading: boolean,
    signIn(cpf: string, senha: string): Promise<void>,
    signOut(): void    
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)
export default AuthContext


export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<object | null | undefined>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStorageData() {
           const storagedUser = await AsyncStorage.getItem('@mais-parceria:user')
           const storagedToken = await AsyncStorage.getItem('@mais-parceria:token')
           setLoading(true)
           if(storagedUser && storagedToken) {
            api.defaults.headers.Authorization = `Bearer ${storagedToken}`
            setUser(JSON.parse(storagedUser))
            setLoading(false)
           }
        }
        loadStorageData()
    }, [])

    async function signIn(cpf: string, senha: string) {
        const response = await auth.signIn(cpf, senha)
        setUser(response?.user)
        api.defaults.headers['Authorization'] = `Bearer ${response?.token}`
        await AsyncStorage.setItem('@mais-parceria:user', JSON.stringify(response?.user))
        await AsyncStorage.setItem('@mais-parceria:token', String(response?.token))
        await fb.auth().signInWithCustomToken(response?.token)
        console.log(`logado como ${response?.user.name}`)
    }

    async function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null)
        })
        await fb.auth().signOut()
        console.log(`Deslogou`)
    }
    return (
        <AuthContext.Provider value={{signed: !!user, user, loading, signIn, signOut}}>
            { children }
        </AuthContext.Provider>
    )
}
