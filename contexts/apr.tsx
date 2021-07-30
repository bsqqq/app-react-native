import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import netinfo from '@react-native-community/netinfo'
import fb from '../services/firebase'
import * as fs from 'expo-file-system'

interface APRContextProps {

}

const APRContext = createContext<APRContextProps>({} as APRContextProps)
export default APRContext