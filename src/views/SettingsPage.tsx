import { Card, CardBody, CardHeader, useToast } from "@chakra-ui/react";
import { VerticalBlob } from "../components/motion/VerticalBlob";
import { motion, AnimatePresence } from "framer-motion";
import { HOME } from "../store/routes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import { ArrowBackIcon } from '@chakra-ui/icons'
import { doc, onSnapshot, updateDoc, where } from "firebase/firestore";
import { query } from "express";
import { auth, usersRef } from "../store/firebase";
export const SettingsPage = () => {
    const [email, setEmail] = useState("");
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
    const [isEmailChanged, setIsEmailChanged] = useState(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [isAccountChanged, setIsAccountChanged] = useState(false);

    const toast = useToast();
    
    const handleToggleEmailNotifications = async () => {
        try {
             // Update the user doc
             const userID = auth.currentUser?.uid || localStorage.getItem('userID');
             if (!userID) return;
             const userDocRef = doc(usersRef, userID);
            updateDoc(userDocRef, {
                notificationsMethods: {
                    isEmail: !emailNotificationsEnabled,
                    /**we need to save the rest to stay the same */
                    isSMS: smsNotificationsEnabled,

                },
            }).then(() => {
                const isNotificationsEnabled = !emailNotificationsEnabled && !smsNotificationsEnabled;
                updateDoc(userDocRef, {
                    isNotificationsEnabled,
                });
            });
            toast({
                title: `Turned ${emailNotificationsEnabled ? 'off' : 'on'} Email Notifications`,
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
            });
        } catch(error: unknown) {
            if(error instanceof Error)
            toast({
                title: "Could not Toggle Email Notifications",
                description: error.message,
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "top",
            });
        }; 
    };

    const handleToggleSmsNotifications = async () => {
        try {
            // Update the user doc
            const userID = auth.currentUser?.uid || localStorage.getItem('userID');
            if (!userID) return;
            const userDocRef = doc(usersRef, userID);
            updateDoc(userDocRef, {
                notificationsMethods: {
                    isSMS: !smsNotificationsEnabled,
                    /**we need to save the rest to stay the same */
                    isEmail: emailNotificationsEnabled,
                },
            }).then(() => {
                const isNotificationsEnabled = !emailNotificationsEnabled && !smsNotificationsEnabled;
                updateDoc(userDocRef, {
                    isNotificationsEnabled,
                });
            });
            toast({
                title: `Turned ${smsNotificationsEnabled ? 'off' : 'on'} SMS Notifications`,
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
            });
        } catch (error: unknown) {
            if (error instanceof Error)
                toast({
                    title: "Could not Toggle SMS Notifications",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "top",
                });
        };
    };

    const navigate = useNavigate();
    const handleNav = () => {
        navigate(HOME);
    };
    useEffect(() => {
        const userID = auth.currentUser?.uid || localStorage.getItem('userID');
        if (!userID) return;
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            snapshot.docs.forEach((doc) => {
                if (doc.id === userID) {
                    const user = doc.data();
                    setEmailNotificationsEnabled(user.notificationsMethods.isEmail);
                    setSmsNotificationsEnabled(user.notificationsMethods.isSMS);
                };
            });
        });
        return () => unsubscribe();
    }, []);
    return (
        <AnimatePresence>
            <VerticalBlob />
            <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-8 md:px-12 md:py-16">
                <motion.button
                    className="px-4 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-900 text-black dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-800 transition duration-300 ease-in-out fixed top-4 left"
                    onClick={handleNav}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ArrowBackIcon scale={1.2}/>
                </motion.button>
                <section>
                    <h1 className="text-2xl font-bold mb-8 text-center tracking-wider">SETTINGS</h1>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                        <Card className="mb-10">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Configure Email</h2>
                            </CardHeader>
                            <CardBody>
                                {/* Email configuration form */}
                                {/* Save changes button */}
                                <div className="flex justify-end mt-4">
                                    <button className={`px-4 py-2 rounded-full ${isEmailChanged ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`} disabled={!isEmailChanged} style={{ pointerEvents: 'none' }}>
                                        Confirm Changes
                                    </button>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="mb-10">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Configure Password</h2>
                            </CardHeader>
                            <CardBody>
                                {/* Password configuration form */}
                                {/* Confirm password field */}
                                {/* Save changes button */}
                                <div className="flex justify-end mt-4">
                                    <button className={`px-4 py-2 rounded-full ${isPasswordChanged ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`} disabled={!isPasswordChanged} style={{ pointerEvents: 'none' }}>
                                        Confirm Changes
                                    </button>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="mb-10">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Manage Account</h2>
                            </CardHeader>
                            <CardBody>
                                {/* Suspend or terminate account options */}
                                {/* Save changes button */}
                                <div className="flex justify-end mt-4">
                                    <button className={`px-4 py-2 rounded-full ${isAccountChanged ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`} disabled={!isAccountChanged} style={{ pointerEvents: 'none' }}>
                                        Confirm Changes
                                    </button>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="mb-10">
                            <CardHeader>
                                <h2 className="text-xl font-bold">Configure Notifications</h2>
                            </CardHeader>
                            <CardBody>
                                <motion.div
                                    style={{ transition: "all 0.1s ease" }}
                                    className="p-1"
                                >
                                    <div className="flex items-center px-2">
                                        <motion.div onClick={handleToggleEmailNotifications} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.03, cursor: "pointer" }} className="relative">
                                            <input className="sr-only" id="toggle" type="checkbox" />
                                            <motion.div className={`block bg-gray-600 w-14 h-8 rounded-full ${emailNotificationsEnabled ? "bg-green-400" : "bg-red-800"}`}>
                                                <motion.div
                                                    className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${emailNotificationsEnabled ? "bg-green-600" : "bg-red-950"}`}
                                                    animate={{ right: emailNotificationsEnabled ? "1px" : "auto", left: emailNotificationsEnabled ? "auto" : "1px" }}
                                                />
                                            </motion.div>
                                        </motion.div>


                                        <label className="ml-6 text-base font-bold cursor-default">
                                            Email Notifications
                                        </label>
                                    </div>
                                </motion.div>

                                <motion.div
                                    style={{ transition: "all 0.1s ease" }}
                                    className="p-1"
                                >
                                    <div className="flex items-center px-2">
                                        <motion.div onClick={handleToggleSmsNotifications} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.03, cursor: "pointer" }} className="relative">
                                            <input className="sr-only" id="toggle" type="checkbox" />
                                            <motion.div className={`block bg-gray-600 w-14 h-8 rounded-full ${smsNotificationsEnabled ? "bg-green-400" : "bg-red-800"}`}>
                                                <motion.div
                                                    className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${smsNotificationsEnabled ? "bg-green-600" : "bg-red-950"}`}
                                                    animate={{ right: smsNotificationsEnabled ? "1px" : "auto", left: smsNotificationsEnabled ? "auto" : "1px" }}
                                                />
                                            </motion.div>
                                        </motion.div>
                                        <label className="ml-6 text-base font-bold cursor-default">
                                            SMS Notifications
                                        </label>
                                    </div>
                                </motion.div>
                            </CardBody>
                        </Card>
                        </motion.div>
                </section>
            </main>
        </AnimatePresence>
    );
};