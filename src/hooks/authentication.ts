/*===============           DEPENDENCIES            ===============*/
import { signInWithPopup, UserCredential, User } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../store/firebase";

export const useAuthentication = () => {
    const loginWithGoogle = async (): Promise<User | null> => {
        try {
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const user: User | null = result.user;
            console.log(user?.email);
            return user;
        } catch(error) {
            console.error(error);
            return null;
        }
    };
    const loginWithGithub = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log(result)
        } catch(error) {
            console.error(error);
        }
    };
    const registerWithEmailAndPassword = async (email: String, password: String) => {
        
    };
    const loginWithEmailAndPassword = async (email: String, password: String) => {

    };
    const logout = async () => {
        // ...
    };

    return {
        loginWithGoogle,
        loginWithGithub,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout
    };
};