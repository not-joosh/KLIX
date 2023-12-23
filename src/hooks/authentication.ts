/*===============           DEPENDENCIES            ===============*/
import { signInWithPopup, UserCredential, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider, usersRef, storage } from "../store/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LANDINGPAGE } from "../store/routes";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


export const useAuthentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const toast = useToast();
    const loginWithGoogle = async (path: string) => {
        try {
            setIsLoading(true);
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const user: User | null = result.user;
            const googleDocRef = doc(usersRef, auth.currentUser?.uid);
            const userDocSnapshot = await getDoc(googleDocRef);
            const userDocExists = userDocSnapshot.exists();
            if (userDocExists) {
                console.log('User has signed in before');
            } else {
                console.log('User has not signed in with Google before');
                const userDoc = doc(usersRef, auth.currentUser?.uid);
                await setDoc(userDoc, {
                    threshHold: 0,
                    notificationsMethods: {
                        'isSMS': false,
                        'isEmail': false,
                    },
                    isNotificationsEnabled: false,
                    signedInWith: 'Google',
                    email: user?.email,
                    id: auth.currentUser?.uid,
                    accountType: 'user',
                    fetchTimeStamp: null,
                    hasFetchedToday: false,
                });
                // Saving their profile picture into storage
                const storageRef = ref(storage, `profileIcons/${userDoc.id}`);
                if (user?.photoURL) {
                    const response = await fetch(user.photoURL);
                    const blob = await response.blob();
                    const uploadedImage = await uploadBytesResumable(storageRef, blob);
                    const imageLink = await getDownloadURL(uploadedImage.ref);
                    await updateDoc(userDoc, {
                        profileImgUrl: imageLink,
                        profileImgName: `${userDoc.id}_googleProfilePicture`
                    });
                };
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
            const githubUserDocRef = doc(usersRef, auth.currentUser?.uid);
            const userDocSnapshot = await getDoc(githubUserDocRef);
            const userDocExists = userDocSnapshot.exists();
            if (userDocExists) {
                console.log('User has signed in before');
            } else {
                console.log('User has not signed in with GitHub before');
                const userDoc = doc(usersRef, auth.currentUser?.uid);
                await setDoc(userDoc, {
                    threshHold: 0,
                    notificationsMethods: {
                        'isSMS': false,
                        'isEmail': false,
                    },
                    isNotificationsEnabled: false,
                    signedInWith: 'Github',
                    email: user?.email,
                    id: auth.currentUser?.uid,
                    accountType: 'user',
                    fetchTimeStamp: null,
                    hasFetchedToday: false,
                });
                // Saving their profile picture into storage
                const storageRef = ref(storage, `profileIcons/${userDoc.id}`);
                if (user?.photoURL) {
                    const response = await fetch(user.photoURL);
                    const blob = await response.blob();
                    const uploadedImage = await uploadBytesResumable(storageRef, blob);
                    const imageLink = await getDownloadURL(uploadedImage.ref);
                    await updateDoc(userDoc, {
                        profileImgUrl: imageLink,
                        profileImgName: `${userDoc.id}_githubProfilePicture`
                    });
                };
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
                threshHold: 0,
                notificationsMethods: {
                    'isSMS': false,
                    'isEmail': false,
                    'isApp': false,
                    profileImgUrl: '',
                    profileImgName: '',
                    fetchTimeStamp: null,
                    hasFetchedToday: false,
                },
                isNotificationsEnabled: false,
                signedInWith: 'google',
                email: email,
                id: auth.currentUser?.uid,
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