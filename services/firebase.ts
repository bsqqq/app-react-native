import Constants from 'expo-constants';

const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
require('firebase/storage')

const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.REACT_APP_FB_API_KEY,
    authDomain: Constants.manifest?.extra?.REACT_APP_FB_AUTH_DOMAIN,
    databaseURL: Constants.manifest?.extra?.REACT_APP_FB_DATABASE_URL,
    projectId: Constants.manifest?.extra?.REACT_APP_FB_PROJECT_ID,
    storageBucket: Constants.manifest?.extra?.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: Constants.manifest?.extra?.REACT_APP_FB_MESSAGING_SENDER_ID,
    appId: Constants.manifest?.extra?.REACT_APP_FB_APP_ID
}

const fb = !firebase.apps?.length ? firebase.default.initializeApp(firebaseConfig) : firebase.app()

export default fb