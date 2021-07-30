import React, { createContext, useState, useEffect } from "react";
import netinfo from '@react-native-community/netinfo'

interface ConexaoContextProps {
    conectado: boolean | undefined | null
}

const ConexaoContext = createContext<ConexaoContextProps>({} as ConexaoContextProps)
export default ConexaoContext

export const ConexaoStatusProvider: React.FC = ({ children }) => {
    const [conectado, setConectado] = useState<boolean | null>()
    useEffect(() => {
        netinfo.addEventListener(state => setConectado(state.isConnected))
    }, [])
    return (
        <ConexaoContext.Provider value={{ conectado }}>
            { children }
        </ConexaoContext.Provider>
    )
}