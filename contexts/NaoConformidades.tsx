import React, { createContext, useState, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { estouOnline } from '../utils/EstouOnline';
import fb from '../services/firebase'
import InspecaoContext from './inspecao';

interface NaoConformidadeProps {
    respostaId: number | undefined,
    finishInspecao(): Promise<void>
    setRespostaIdContext(id: number): void,
    setFotosInspecao(FotoURI: string[]): void
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    const { inspecaoId, Inspecao } = useContext(InspecaoContext)
    const [respostaId, setRespostaId] = useState<number>()

    function setRespostaIdContext(id: number) {
        setRespostaId(id)
    }

    async function setFotosInspecao(FotoURI: string[]) {
        await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(FotoURI))
    }

    async function finishInspecao() {
        // esta função vai escrever tudo no banco de dados.
        try {
            const db = fb.database()
            const storage = fb.storage()
            await db.ref(`/inspecoes/${inspecaoId}`).set(Inspecao)
            const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
            const arrayDeFts = JSON.parse(String(fts))
            console.log(arrayDeFts.length)
            const promises = arrayDeFts.map(async (item: string, index: number) => {
                const response = await fetch(item)
                var blob = await response.blob()
                await storage.ref().child(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).put(blob)
                var hiperlink = await storage.ref(`/fotos-de-inspecao/${inspecaoId}/${index}.jpg`).getDownloadURL()
                await db.ref(`/fotos-de-inspecao/${(inspecaoId || 0) + index}`).set({
                    hiperlink,
                    descricao: '',
                    inspecaoId,
                    id: (inspecaoId || 0) + index,
                    respostaId
                })
            })
            await Promise.all(promises)
            fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', (error) => console.log(`Fotos apagadas`)) : console.log('não existe fotos para apagar')
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext, setFotosInspecao, finishInspecao }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}