import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'
import { ConexaoStatusProvider } from './conexao'
import { APRProvider } from './apr'


export const Providers: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <ConexaoStatusProvider>
                <InspecaoProvider>
                    <APRProvider>
                        {children}
                    </APRProvider>
                </InspecaoProvider>
            </ConexaoStatusProvider>
        </AuthProvider>
    )
}