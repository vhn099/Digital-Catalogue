import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBkGotbiMUWiNTHCCG-SuURLXwVGCmwUY0",
    authDomain: "digital-catalogue-15dcb.firebaseapp.com",
    projectId: "digital-catalogue-15dcb",
    storageBucket: "digital-catalogue-15dcb.appspot.com",
    messagingSenderId: "372333166634",
    appId: "1:372333166634:web:513e037c4bf8cff9508353",
    measurementId: "G-NP38F90W2X"
};

let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseApp };