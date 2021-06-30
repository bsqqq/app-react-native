import netinfo from '@react-native-community/netinfo'
import atualizacoes from './TenhoAtualizacoes'

export function estouOnline(): boolean {
    var conectado: boolean = false
    netinfo.addEventListener(state => {
        conectado = Boolean(state.isConnected)
        if(conectado == true) {
            atualizacoes()
        }
    })
    return conectado
}