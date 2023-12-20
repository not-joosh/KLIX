/*===============           DEPENDENCIES            ===============*/
import { GoogleIcon, GithubIcon } from "../../assets/icons/icons"
import { motion } from "framer-motion";
import { HOME } from "../../store/routes";

import * as yup from "yup"; 
import { yupResolver } from "@hookform/resolvers/yup"; 
import { useForm } from "react-hook-form"; 
import { useState } from "react";
import { AuthenticationData } from "../../store/types";

/*===============           AUTH SCHEMA            ================*/

const AuthenticationSchema = yup.object().shape({
    email: yup.string().email("*Must be a valid email").required("*Email is required"),
    password: yup.string().min(6, "*Passwords are at least 6 Characters.").required("*Password is required"),
});

interface LoginProps {
    loginWithGoogle: (redirectPath: string) => void;
    loginWithGithub: (redirectPath: string) => void;
    loginWithEmailAndPassword: (email: string, password: string, redirectPath: string) => Promise<void>;
    registerWithEmailAndPassword: (email: string, password: string, redirectPath: string) => Promise<void>;
};

/*===============            COMPONENT             ================*/
export const Login: React.FC<LoginProps> = ({
    loginWithGoogle,
    loginWithGithub,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
}) => {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(AuthenticationSchema),
    });
    
    const onSubmit = async (formData: AuthenticationData) => {
        try {
            if(isSigningUp)
                await registerWithEmailAndPassword(formData.email, formData.password, HOME)
            else
                await loginWithEmailAndPassword(formData.email, formData.password, HOME)
        } catch(error: unknown) {
            if (error instanceof Error)
                console.log(error.message)
        };
    };
    
    const slideFadeInVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <>
            <motion.div
                className="bg-black rounded-lg p-6 w-[450px] text-white"
                variants={ slideFadeInVariants }
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-3xl font-bold text-center mb-6">TAP IN</h2>
                <div className="flex flex-col gap-4 mx-8 my-4">
                    <motion.button onClick = {async () => loginWithGoogle(HOME)} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-md">
                        {/**@ts-ignore */}
                        <GoogleIcon csName="h-1 w-1" />
                        Continue with Google
                    </motion.button>
                    <motion.button onClick = {async () => loginWithGithub(HOME)} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 bg-gray-700 p-2 rounded-md">
                        {/**@ts-ignore */}
                        <GithubIcon csName="h-1 w-1" />
                        Continue with Github
                    </motion.button>
                    <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-400 h-px flex-1" />
                        <span className="px-4 text-gray-400">OR</span>
                        <div className="bg-gray-400 h-px flex-1" />
                    </div>
                    <form className="flex flex-col gap-4 mx-8 my-4" onSubmit={handleSubmit(onSubmit)}>
                        <motion.input
                            {...register("email")}
                            className="bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                            placeholder="Email"
                            type="email"
                            whileTap={{ scale: 1.04 }}
                            whileHover={{ scale: 1.02 }}
                        />
                        {isSigningUp && errors.email && 
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                style={{ color: "red" }}
                            >
                                {errors.email.message}
                        </motion.p>}
       
                        <motion.input
                            {...register("password")}
                            className="bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                            placeholder="Password"
                            type="password"
                            whileTap={{ scale: 1.04 }}
                            whileHover={{ scale: 1.02 }}
                        />
                        
                        {/* {isSigningUp && errors.password && <p style = {{color: "red"}}>{errors.password.message}</p>} */}
                        {isSigningUp && errors.password && 
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            style={{ color: "red" }}
                        >
                            {errors.password.message}
                        </motion.p>}
                        
                        <div className="flex gap-4">
                            <motion.button onClick = {() => {setIsSigningUp(true)}} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex-1 bg-blue-600 p-3 rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 hover:text-white hover:border-transparent">
                                SIGNUP
                            </motion.button>
                            <motion.button onClick = {() => {setIsSigningUp(false)}} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex-1 bg-red-600 p-3 rounded-md shadow-md hover:shadow-lg hover:bg-red-700 hover:text-white hover:border-transparent">
                                LOGIN
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
};