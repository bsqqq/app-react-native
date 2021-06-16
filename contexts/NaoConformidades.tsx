import React, { createContext, useState } from 'react'

interface NaoConformidadeProps {
    respostaId: number | undefined,
    setRespostaIdContext(id: number): void,
    naoConformidadesURI: string[] | undefined,
    setFotosInspecao(arrayPhotoURI: string[]): void
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    const [naoConformidadesURI, setNaoConformidadesURI] = useState<Array<string>>([])
    const [respostaId, setRespostaId] = useState<number>()

    function setRespostaIdContext(id: number) {
        setRespostaId(id)
    }

    function setFotosInspecao(arrayPhotoURI: string[]) {
        setNaoConformidadesURI(arrayPhotoURI)
    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext, naoConformidadesURI, setFotosInspecao }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}