import fb from '../services/firebase'
const db = fb.database()
const arrayDeTratamento: Array<any> = []
async function JsonToArray(caminho: string) {
    const snap = await db.ref(caminho).once('value')
    const shot = snap.exportVal()
    const shotKeys = Object.keys(shot)
    shotKeys.forEach(key => {
        arrayDeTratamento.push(shot[key])
    })
    return arrayDeTratamento
}