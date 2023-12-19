/*===============           DEPENDENCIES            ===============*/
import { signInWithPopup, UserCredential, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, googleProvider, githubProvider, usersRef } from "../store/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LANDINGPAGE } from "../store/routes";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { set } from "firebase/database";

export const useAuthentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const toast = useToast();
    const loginWithGoogle = async (path: string) => {
        try {
            setIsLoading(true);
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
            toast({
                title: 'Successfully Logged in!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Login Failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };
    const loginWithGithub = async (path: string) => {
        try {
            setIsLoading(true);
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
            toast({
                title: 'Successfully Logged in!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Login Failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };
    const loginWithEmailAndPassword = async (email: string, password: string, path: string) => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(usersRef, auth.currentUser?.uid);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {}; // Add nullish coalescing operator to provide default value
            localStorage.setItem('accountType', `${data.accountType}`);
            localStorage.setItem('userID', auth.currentUser?.uid ?? '');
            toast({
                title: 'Successfully Logged in!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Login Failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };
    const registerWithEmailAndPassword = async (email: string, password: string, path: string) => {
        try {
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
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
            toast({
                title: 'Successfully Registered!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(path);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Registration Failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };
    const logout = async () => {
        try {
            localStorage.clear();
            await signOut(auth);
            toast({
                title: 'Successfully Signed Out!',
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
            navigate(LANDINGPAGE);
        } catch(error: unknown) {
            if(error instanceof Error)
                toast({
                    title: 'Sign Out Failed!',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };

    return {
        loginWithGoogle,
        loginWithGithub,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout, 
        isLoading
    };
};