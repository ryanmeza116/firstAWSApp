// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDDpvPvnKjGdehnKpnehh_YG1l7ThtPP-M",
authDomain: "chat-app-ad44e.firebaseapp.com",
projectId: "chat-app-ad44e",
storageBucket: "chat-app-ad44e.appspot.com",
messagingSenderId: "1013975379476",
appId: "1:1013975379476:web:34044a492508baa07a0101"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default getFirestore(app); 