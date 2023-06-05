import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
	// Your credentials
    apiKey: "AIzaSyAhRq2qyPhuJ5BkAt5CRL4DU6M-NfLlM84",
    authDomain: "testapp-7e8a2.firebaseapp.com",
    projectId: "testapp-7e8a2",
    storageBucket: "testapp-7e8a2.appspot.com",
    messagingSenderId: "302513348525",
    appId: "1:302513348525:web:3a8e2b716e4bb920a44b24"
};

firebase.initializeApp(firebaseConfig);
var auth1 = firebase.auth();
export {auth1 , firebase};
