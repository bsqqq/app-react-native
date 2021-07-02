import React, { createContext, useState, useContext } from 'react'

import InspecaoContext from './inspecao';

interface NaoConformidadeProps {
    respostaId: number | undefined,
    setRespostaIdContext(id: number): void,
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    // const { inspecaoId, Inspecao } = useContext(InspecaoContext)
    const [respostaId, setRespostaId] = useState<number>()

    function setRespostaIdContext(id: number) {
        setRespostaId(id)
    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}