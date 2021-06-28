import { estouOnline } from './EstouOnline'
import fb from '../services/firebase'
import colaboradores from '../json/colaboradores.json'
import * as fs from 'expo-file-system'

export default async function atualizacoes() {
    try {
        const colabs = colaboradores
        const db = fb.database()
        const snapColaboradores = await db.ref('/colaboradores').once('value')
        const shotColaboradores = snapColaboradores.exportVal()
        var path = await fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        async function garantirDirExiste() {
            const dirInfo = await fs.getInfoAsync(path)
            if (!dirInfo.exists) {
                console.log('criando diretorio...')
                await fs.makeDirectoryAsync(path, { intermediates: true })
            } else {
                if (estouOnline()) {
                    console.log('escrevendo colaboradores.json com o conteudo do banco de dados')
                    await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(shotColaboradores)).then(() => console.log('concluido'))
                } else {
                    console.log('escrevendo colaboradores.json com o conteudo do banco local (json)') // na duvida se isso realmente printaria...
                    await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(colabs)).then(() => console.log('concluido'))
                }
            }
        }
        garantirDirExiste()
    } catch (error) {
        console.log(error)
    }

}
