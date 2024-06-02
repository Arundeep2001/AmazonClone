//import firebase from 'firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtZoDG3r_wWh5BO4Aram51DYCjsO47sfE",
    authDomain: "challenge-b396c.firebaseapp.com",
    projectId: "challenge-b396c",
    storageBucket: "challenge-b396c.appspot.com",
    messagingSenderId: "67982555509",
    appId: "1:67982555509:web:33bddcd2792a6940f87b3c",
    measurementId: "G-S5M9N22XLC"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig); 

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db, auth };