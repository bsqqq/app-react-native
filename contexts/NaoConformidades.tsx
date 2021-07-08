import React, { createContext, useState } from 'react'

interface NaoConformidadeProps {
    respostaId: number | undefined,
    setRespostaIdContext(id: number): void,
}

const NaoConformidadeContext = createContext<NaoConformidadeProps>({} as NaoConformidadeProps)
export default NaoConformidadeContext

export const NaoConformidadeProvider: React.FC = ({ children }) => {
    const [respostaId, setRespostaId] = useState<number>()

    function setRespostaIdContext(id: number) {
        console.log(`NaoConformidades Context setRespostaIdContext: => ${id}`)
        setRespostaId(id)
        console.log(respostaId)
    }

    return (
        <NaoConformidadeContext.Provider value={{ respostaId, setRespostaIdContext }}>
            {children}
        </NaoConformidadeContext.Provider>
    )
}