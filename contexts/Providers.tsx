import React from 'react'
import { AuthProvider } from './auth'
import { InspecaoProvider } from './inspecao'



export const Providers: React.FC = ({ children }) => {
    return (
        <AuthProvider>
            <InspecaoProvider>
                    {children}
            </InspecaoProvider>
        </AuthProvider>
    )
}