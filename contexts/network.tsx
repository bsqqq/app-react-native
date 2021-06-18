import React, {createContext, useState} from 'react'

interface NetworkProps {
    conectado?: boolean | undefined,
    atualizacoes?: boolean | undefined,
    updateContentStatus(state: boolean): void
    updateConnectionStatus(state: boolean): void,
}

const NetworkContext = createContext<NetworkProps>({} as NetworkProps)
export default NetworkContext

export const NetworkDataProvider: React.FC = ({ children }) => {
    const [tenhoAtualizacao, setTenhoAtualizacao] = useState<boolean>()
    const [estouConectado, setEstouConectado] = useState<boolean>()

    function updateConnectionStatus(state: boolean) {
        setEstouConectado(state)
    }

    function updateContentStatus(state: boolean) {
        setTenhoAtualizacao(state)
    }
    return (
        <NetworkContext.Provider value={{conectado: estouConectado, atualizacoes: tenhoAtualizacao, updateConnectionStatus, updateContentStatus}}>
            { children }
        </NetworkContext.Provider>
    )
}