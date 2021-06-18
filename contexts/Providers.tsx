import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'
import { NaoConformidadeProvider } from './NaoConformidades'
import { NetworkDataProvider } from './network'

export const Providers: React.FC = ({ children }) => {
    return (
        <NetworkDataProvider>
            <AuthProvider>
                <InspecaoProvider>
                    <NaoConformidadeProvider>
                        {children}
                    </NaoConformidadeProvider>
                </InspecaoProvider>
            </AuthProvider>
        </NetworkDataProvider>
    )
}