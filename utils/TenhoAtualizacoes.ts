import fb from '../services/firebase'
import * as fs from 'expo-file-system'

export default async function atualizacoes() {
    try {
        const db = fb.database()
        const snapColaboradores = await db.ref('/colaboradores').once('value')
        const shotColaboradores = snapColaboradores.exportVal()
        var path = fs.documentDirectory + 'json/'
        const fileUri = (jsonId: string) => path + `${jsonId}.json`
        async function garantirDirExiste() {
            const dirInfo = await fs.getInfoAsync(path)
            if (!dirInfo.exists)
                await fs.makeDirectoryAsync(path, { intermediates: true })
            console.log('escrevendo colaboradores.json com o conteudo do banco de dados')
            await fs.writeAsStringAsync(fileUri('colaboradores'), JSON.stringify(shotColaboradores)).then(() => console.log('concluido'))
        }
        garantirDirExiste()
    } catch (error) {
        console.log(error)
    }

}
