import React, { createContext, useState } from "react";
import { APRProps } from "../pages/preAPR";

interface APRContextProps {
    setNewAPRContext(obj: APRProps): void
}

const APRContext = createContext<APRContextProps>({} as APRContextProps)
export default APRContext

export const APRProvider: React.FC = ({ children }) => {
    const [apr, setApr] = useState<APRProps>()
    
    function setNewAPRContext(localApr: APRProps) {
        console.log(localApr)
        setApr(localApr)
    }
    return (
        <APRContext.Provider value={{setNewAPRContext}}>
            { children }
        </APRContext.Provider>
    )
}