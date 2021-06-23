import { estouOnline } from './EstouOnline'
import colaboradores from '../json/colaboradores.json'
import fb from '../services/firebase'
import * as fs from 'expo-file-system'

export async function atualizacoes() {
    try {
        const db = fb.database()
        // const colabs: Colaboradores = colaboradores
        const snap = await db.ref('/colaboradores').once('value')
        const shot = String(snap.exportVal())
        if (estouOnline()) {
            // await RNFS.writeFile('../json/colaboradores.json', shot)
            fs.writeAsStringAsync(, shot)
        }
    } catch (error) {
        console.log(error)
    }

}