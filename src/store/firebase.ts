/*-------   DEPENDENCIES    -------*/
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/*-------   FIREBASE CONFIG    -------*/
const firebaseConfig = {
    apiKey: "AIzaSyAVTzqpYYQGkgOoH8XsF_RCEaYRevsZq7c",
    authDomain: "clickonomics.firebaseapp.com",
    projectId: "clickonomics",
    storageBucket: "clickonomics.appspot.com",
    messagingSenderId: "1018766348671",
    appId: "1:1018766348671:web:719e7ab1ddbadccc834a4a"
};

/*-------   FIREBASE INIT    -------*/
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const githubProvider = new GithubAuthProvider();
export const googleProvider = new GoogleAuthProvider();

/*---   FIREBASE COLLECTIONS    ---*/
export const usersRef = collection(db, 'users');
export const dataRef = collection(db, 'data');