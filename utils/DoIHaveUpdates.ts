// import estouOnline from './AmIOnline'
import netinfo from '@react-native-community/netinfo'
export default function tenhoAtualizacoes() {

    const estouOnline = netinfo.addEventListener(state => {
        console.log('Connection type:', state.type)
        console.log('Is connected?', state.isConnected)
    })
}