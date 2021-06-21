import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'
import { NaoConformidadeProvider } from './NaoConformidades'


export const Providers: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <InspecaoProvider>
                <NaoConformidadeProvider>
                    {children}
                </NaoConformidadeProvider>
            </InspecaoProvider>
        </AuthProvider>
    )
}