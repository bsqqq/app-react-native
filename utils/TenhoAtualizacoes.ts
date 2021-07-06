import fb from '../services/firebase'
import * as fs from 'expo-file-system'
import { getMunicipios } from '../services/apiIBGE'

export default async function atualizacoes() {
    try {
        const db = fb.database()
        const snapPerguntasDeSeguranca = await db.ref('/perguntas-de-seguranca').once('value')
        const snapColaboradores = await db.ref('/colaboradores').once('value')
        const snapContratos = await db.ref('/empresas').once('value')
        const snapProcessos = await db.ref('/processos').once('value')
        const shotPerguntasDeSeguranca = snapPerguntasDeSeguranca.exportVal()
        const shotColaboradores = snapColaboradores.exportVal()
        const shotContratos = snapContratos.exportVal()
        const shotProcessos = snapProcessos.exportVal()
        var path = fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        async function garantirDirExiste() {
            const dirInfo = await fs.getInfoAsync(path)
            if (!dirInfo.exists)
                await fs.makeDirectoryAsync(path, { intermediates: true })
            console.log('escrevendo com o conteúdo do banco de dados')
            await fs.writeAsStringAsync(fileUri('perguntas-de-seguranca'), JSON.stringify(shotPerguntasDeSeguranca)).then(() => console.log('perguntas de segurança: concluido'))
            await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(shotColaboradores)).then(() => console.log('colaboradores: concluido'))
            await fs.writeAsStringAsync(fileUri('processos'), JSON.stringify(shotProcessos)).then(() => console.log('processos: concluido'))
            await fs.writeAsStringAsync(fileUri('contratos'), JSON.stringify(shotContratos)).then(() => console.log('contratos: concluido'))
        }
        getMunicipios().then(() => console.log('terminou de pegar os municipios'))
        garantirDirExiste()
    } catch (error) {
        console.log(error)
    }

}
