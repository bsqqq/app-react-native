import React, { createContext, useState } from 'react';

type checklist = {
    id: number,
    equipeId: number[] | undefined,
    processoId: number,
    contratoId: number,
    dataHora: string
}
interface checklistProps {
    checklistData: checklist | undefined
    setChecklistDataContext(checklist: checklist): void
}

const ChecklistContext = createContext<checklistProps>({} as checklistProps)
export default ChecklistContext

export const ChecklistProvider: React.FC = ({ children }) => {
    const [checklistData, setChecklistData] = useState<checklist>()

    function setChecklistDataContext(checklistData: checklist) {
        setChecklistData(checklistData)
    }

    return (
        <ChecklistContext.Provider value={{ setChecklistDataContext, checklistData }}>
            {children}
        </ChecklistContext.Provider>
    )
}
