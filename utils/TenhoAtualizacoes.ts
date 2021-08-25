import fb from '../services/firebase'
import * as fs from 'expo-file-system'
import { getMunicipios } from '../services/apiIBGE'

export default async function atualizacoes() {
    try {
        const path = fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        if (await (await fs.readAsStringAsync(fileUri('perguntas-de-seguranca'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('numero-de-inspecao'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('colaboradores'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('processos'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('contratos'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('inspecoes'))).length == 0
            || await (await fs.readAsStringAsync(fileUri('APRs'))).length == 0
        ) {
            const db = fb.database()
            const snapPerguntasDeSeguranca = await db.ref('/perguntas-de-seguranca').once('value')
            const snapControle = await db.ref('/controle/numero-de-inspecao').once('value')
            const snapColaboradores = await db.ref('/colaboradores').once('value')
            const snapProcessos = await db.ref('/processos').once('value')
            const snapInspecoes = await db.ref('/inspecoes').once('value')
            const snapContratos = await db.ref('/empresas').once('value')
            const snapAPRs = await db.ref('/APR').once('value')
            const shotPerguntasDeSeguranca = snapPerguntasDeSeguranca.exportVal()
            const shotColaboradores = snapColaboradores.exportVal()
            const shotContratos = snapContratos.exportVal()
            const shotProcessos = snapProcessos.exportVal()
            const shotInspecoes = snapInspecoes.exportVal()
            const shotControle = snapControle.exportVal()
            const shotAPRs = snapAPRs.exportVal()
            async function garantirDirExiste() {
                const dirInfo = await fs.getInfoAsync(path)
                if (!dirInfo.exists)
                    await fs.makeDirectoryAsync(path, { intermediates: true })
                await fs.writeAsStringAsync(fileUri('perguntas-de-seguranca'), JSON.stringify(shotPerguntasDeSeguranca)).then(() => console.log('perguntas de segurança obtidos com sucesso.'))
                await fs.writeAsStringAsync(fileUri('numero-de-inspecao'), JSON.stringify(shotControle)).then(() => console.log('numero de inspeção obtido com sucesso.'))
                await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(shotColaboradores)).then(() => console.log('colaboradores obtidos com sucesso.'))
                await fs.writeAsStringAsync(fileUri('processos'), JSON.stringify(shotProcessos)).then(() => console.log('processos obtidos com sucesso.'))
                await fs.writeAsStringAsync(fileUri('contratos'), JSON.stringify(shotContratos)).then(() => console.log('contratos obtidos com sucesso.'))
                await fs.writeAsStringAsync(fileUri('APRs'), JSON.stringify(shotAPRs)).then(() => console.log('APRs obtidos com sucesso.')).catch(() => console.log('não foi possivel buscar as APR´s'))
                await fs.writeAsStringAsync(fileUri('inspecoes'), JSON.stringify(shotInspecoes)).then(() => { console.log('inspeções obtidos com sucesso.'); alert('Todos os dados foram baixados com sucesso.') })
            }
            getMunicipios()
            garantirDirExiste()
        }
    } catch (error) {
        console.error(error)
    }
}
