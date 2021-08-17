import netinfo from '@react-native-community/netinfo'
import atualizacoes from './TenhoAtualizacoes'

export async function estouOnline(): Promise<boolean> {
    var conectado: boolean = false
    netinfo.addEventListener(async state => {
        conectado = Boolean(state.isConnected)
        if(conectado == true) {
            await atualizacoes()
        }
    })
    return conectado
}