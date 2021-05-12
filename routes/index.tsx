import React, { useContext } from 'react'
import AuthContext from '../contexts/auth'
import { NavigationContainer } from "@react-navigation/native";
import StackRoutes from './stack.routes'
import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
// const routes: React.FC = () => (
//     <NavigationContainer>
//         <StackRoutes/>
//     </NavigationContainer>
// )
const routes: React.FC = () => {
    const { signed } = useContext(AuthContext)
        return signed ?  <AppRoutes/> : <AuthRoutes/>
}

export default routes