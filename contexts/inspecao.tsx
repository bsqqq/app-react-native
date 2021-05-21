import React, { createContext } from 'react'

export interface InspecaoContext {
    id?: number
    NumeroDeInspecao: number | undefined,
    DataEHoraDaInspecao: string | undefined,
    OT_OS_SI: number | undefined,
    MunicipioId: string | number | undefined,
    Localidade: string | undefined
}

const InspecaoContext = createContext<InspecaoContext>({} as InspecaoContext)
export default InspecaoContext

// export const InspecaoProvider: React.FC = ({ children }) => {
//     return (
//         <InspecaoContext.Provider value={{id, NumeroDeInspecao, DataEHoraDaInspecao, OT_OS_SI, Municipio, Localidade}}>
//             { children }
//         </InspecaoContext.Provider>
//     )
// }