import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as auth from '../services/auth' 

interface AuthContextData {
    signed:  boolean,
    user: object | null,
    loading: boolean,
    signIn(): Promise<void>,
    signOut(): void    
}

const AuthContext = createContext<AuthContextData> ( {} as AuthContextData )

export default AuthContext

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<object | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStorageData() {
           const storagedUser = await AsyncStorage.getItem('@mais-parceria:user')
           const storagedToken = await AsyncStorage.getItem('@mais-parceria:token')
           await new Promise(resolve => setTimeout(resolve, 2000))
           if(storagedUser && storagedToken) {
            setUser(JSON.parse(storagedUser))
            setLoading(false)
           }
        }
        loadStorageData()
    }, [])

    async function signIn() {
        const response = await auth.signIn()
        setUser(response.user)
        await AsyncStorage.setItem('@mais-parceria:user', JSON.stringify(response.user))
        await AsyncStorage.setItem('@mais-parceria:token', response.token)
    }
    async function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null)
        })
    }

    return (
        <AuthContext.Provider value={{signed: !!user, user, loading, signIn, signOut}}>
            { children }
        </AuthContext.Provider>
    )
}
