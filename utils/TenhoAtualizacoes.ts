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
        const snapInspecoes = await db.ref('/inspecoes').once('value')
        const shotPerguntasDeSeguranca = snapPerguntasDeSeguranca.exportVal()
        const shotColaboradores = snapColaboradores.exportVal()
        const shotContratos = snapContratos.exportVal()
        const shotProcessos = snapProcessos.exportVal()
        const shotInspecoes = snapInspecoes.exportVal()
        var path = fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        async function garantirDirExiste() {
            const dirInfo = await fs.getInfoAsync(path)
            if (!dirInfo.exists)
                await fs.makeDirectoryAsync(path, { intermediates: true })
            await fs.writeAsStringAsync(fileUri('perguntas-de-seguranca'), JSON.stringify(shotPerguntasDeSeguranca))
            await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(shotColaboradores))
            await fs.writeAsStringAsync(fileUri('processos'), JSON.stringify(shotProcessos))
            await fs.writeAsStringAsync(fileUri('contratos'), JSON.stringify(shotContratos))
            await fs.writeAsStringAsync(fileUri('inspecoes'), JSON.stringify(shotInspecoes))
        }
        getMunicipios()
        garantirDirExiste()
    } catch (error) {
        console.error(error)
    }

}
