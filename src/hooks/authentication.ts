/*===============           DEPENDENCIES            ===============*/
import { signInWithPopup, UserCredential, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, googleProvider, githubProvider, usersRef } from "../store/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LANDINGPAGE } from "../store/routes";


export const useAuthentication = () => {
    const navigate = useNavigate();
    const loginWithGoogle = async (path: string) => {
        try {
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const user: User | null = result.user;
            /*CHECK TO SEE IF EMAIL EXISTS IN DATA BASE ALREADY*/
            const signInMethods = await fetchSignInMethodsForEmail(auth, user?.email!);
            /*EMAIL DOESNT EXIST YET */
            if (signInMethods.length <= 0) {
                const userDoc = doc(usersRef, auth.currentUser?.uid);
                await setDoc(userDoc, {
                    email: user?.email,
                    id: auth.currentUser?.uid,
                    accountType: 'user',
                });
            };
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {}; // Add nullish coalescing operator to provide default value
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid ?? '');
            navigate(path);
        } catch(error) {
            console.error(error);
        };
    };
    const loginWithGithub = async (path: string) => {
        try {
            const result: UserCredential = await signInWithPopup(auth, githubProvider);
            const user: User | null = result.user;
            const signInMethods = await fetchSignInMethodsForEmail(auth, user?.email!);
            if (signInMethods.length <= 0) {
                const userDoc = doc(usersRef, auth.currentUser?.uid);
                await setDoc(userDoc, {
                    email: user?.email,
                    id: auth.currentUser?.uid,
                    accountType: 'user',
                });
            };
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {}; // Add nullish coalescing operator to provide default value
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid ?? '');
            navigate(path);
        } catch(error) {
            console.error(error);
        };
    };
    const loginWithEmailAndPassword = async (email: string, password: string, path: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {}; // Add nullish coalescing operator to provide default value
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid ?? '');
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                console.error(error.message);
        };
    };
    const registerWithEmailAndPassword = async (email: string, password: string, path: string) => {
        try {
            console.log("test1")
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("test")
            await signInWithEmailAndPassword(auth, email, password);
            const userDoc = doc(usersRef, auth.currentUser?.uid);
            await setDoc(userDoc, {
                // ID: auth.currentUser.uid,
                email: email,
                id: auth.currentUser?.uid ?? '',
                accountType: 'user',
            });
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {}; // Add nullish coalescing operator to provide default value
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid ?? '');
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                console.error(error.message);
        };
    };
    const logout = async () => {
        try {
            localStorage.clear();
            await signOut(auth);
            navigate(LANDINGPAGE);
        } catch(error) {
            console.error(error);
        };
    };

    return {
        loginWithGoogle,
        loginWithGithub,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout
    };
};