import axios, { AxiosInstance } from 'axios'
import Constants from 'expo-constants'

const api: AxiosInstance = axios.create({
    baseURL: Constants.manifest.extra?.REACT_APP_API_URL
})

export default api