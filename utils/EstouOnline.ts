import netinfo from '@react-native-community/netinfo'
import atualizacoes from './TenhoAtualizacoes'

export async function estouOnline(): Promise<boolean> {
    var conectado: boolean = false
    netinfo.addEventListener(async state => {
        conectado = Boolean(state.isConnected)
        if(conectado == true) {
            await atualizacoes()
            .then(() => alert('Todos os dados foram baixados com sucesso.'))
            .catch(() => alert('Erro: os dados não foram baixados corretamente, tente novamente saindo e entrando novamente no app.'))
        }
    })
    return conectado
}