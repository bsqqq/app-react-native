import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'
import { ConexaoStatusProvider } from './conexao'


export const Providers: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <ConexaoStatusProvider>
                <InspecaoProvider>
                    {children}
                </InspecaoProvider>
            </ConexaoStatusProvider>
        </AuthProvider>
    )
}