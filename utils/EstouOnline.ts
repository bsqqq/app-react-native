import netinfo from '@react-native-community/netinfo'
export function estouOnline(): boolean {
    var conectado: boolean = false
    netinfo.addEventListener(state => {
        conectado = Boolean(state.isConnected)
        console.log(`estou conectado? ${conectado}`)
    })
    return conectado
}