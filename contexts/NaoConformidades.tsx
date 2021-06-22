import React, { createContext, useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from 'expo-media-library'

interface NaoConformidadeProps {
    respostaId: number | undefined,
    clearFotosInspecao(): Promise<void>
    setRespostaIdContext(id: number): void,
    setFotosInspecao(Fotos: MediaLibrary.Asset): void
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    const [fotosRegistradasInspecao, setFotosRegistradasInspecao] = useState<MediaLibrary.Asset[]>()
    const [respostaId, setRespostaId] = useState<number>()
    var FotosRegistradasInspecao: MediaLibrary.Asset[]

    function setRespostaIdContext(id: number) {
        setRespostaId(id)
    }

    async function setFotosInspecao(Fotos: MediaLibrary.Asset) {
        FotosRegistradasInspecao.push(Fotos)
        setFotosRegistradasInspecao(FotosRegistradasInspecao)
        await AsyncStorage.setItem('@mais-parceria-app-fotos', JSON.stringify(fotosRegistradasInspecao))
    }

    async function clearFotosInspecao() {
        const fts: string | null = await AsyncStorage.getItem('@mais-parceria-app-fotos')
        fts ? await AsyncStorage.removeItem('@mais-parceria-app-fotos', (error) => console.log(error)) : console.log('não existe fotos para apagar')
    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext, setFotosInspecao, clearFotosInspecao }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}