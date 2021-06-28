import React, { createContext, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from 'expo-media-library'
import { estouOnline } from '../utils/EstouOnline';

interface NaoConformidadeProps {
    respostaId: number | undefined,
    finishFotosInspecao(): Promise<void>
    setRespostaIdContext(id: number): void,
    setFotosInspecao(FotoURI: string): void
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    const [respostaId, setRespostaId] = useState<number>()
    var FotosRegistradasInspecao: MediaLibrary.Asset[] = []

    function setRespostaIdContext(id: number) {
        setRespostaId(id)
    }

    async function setFotosInspecao(FotoURI: string) {
        FotosRegistradasInspecao.push(await MediaLibrary.createAssetAsync(FotoURI))
        console.log(FotosRegistradasInspecao)
        if (estouOnline()) {
            await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(FotosRegistradasInspecao))
            console.log(`escrever no banco de dados...`)
        } else {
            await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(FotosRegistradasInspecao))
        }
    }

    async function finishFotosInspecao() {
        const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
        fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', (error) => console.log(`Fotos apagadas`)) : console.log('não existe fotos para apagar')
    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext, setFotosInspecao, finishFotosInspecao }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}