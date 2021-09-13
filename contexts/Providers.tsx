import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'
import { ConexaoStatusProvider } from './conexao'
import { APRProvider } from './apr'
import { ChecklistProvider } from './checklist'


export const Providers: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <ConexaoStatusProvider>
                <InspecaoProvider>
                    <APRProvider>
                        <ChecklistProvider>
                            {children}
                        </ChecklistProvider>
                    </APRProvider>
                </InspecaoProvider>
            </ConexaoStatusProvider>
        </AuthProvider>
    )
}