import { useContext, useState } from 'react'
import netinfo from '@react-native-community/netinfo'
import NetworkContext from '../contexts/network'

export function estouConectado(): boolean {
    const [conectado, setConectado] = useState<boolean>(false)
    const { updateConnectionStatus } = useContext(NetworkContext)
    netinfo.addEventListener(state => {
        setConectado(Boolean(state.isConnected))
    })
    updateConnectionStatus(conectado)
    return conectado
}


