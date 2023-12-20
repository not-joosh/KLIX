/*===============           DEPENDENCIES            ================*/
import { AnimatePresence, motion } from "framer-motion";
import { Login } from "../components/authentication/Login";
import { useState } from "react";
import { LandingPageBG } from "../assets/backdrops/backdrops";
import { LoadingIcon } from "../components/motion/LoadingIcon";
import { useAuthentication} from "../hooks/authentication";
import { auth } from "../store/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HOME } from "../store/routes";

/*===============            COMPONENT             ================*/
export const LandingPage = () => {
    const [showModal, setShowModal] = useState(false);
    const { loginWithGoogle, loginWithGithub, loginWithEmailAndPassword, registerWithEmailAndPassword, isLoading } = useAuthentication();
    const navigate = useNavigate();
    const closeModal = () => { setShowModal(false)};
    
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            {isLoading && <LoadingIcon />}
            <main className="flex flex-col items-center justify-center h-screen mx-auto">
                <img
                    src={LandingPageBG}
                    alt="Landing Page Background"
                    className="absolute h-full w-full object-cover pointer-events-none select-none"
                    style={{ zIndex: 0 }}
                    // initial={{ opacity: 0 }}
                    // animate={{ opacity: 1 }}
                    // exit={{ opacity: 0 }}
                    // transition={{ duration: 1 }}
                />
                    <AnimatePresence>
                        {showModal && (
                            <motion.div
                                className="cursor-pointer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    transition: "all 0.3s ease-in-out",
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.80)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 2, // Ensure the overlay is on top of other elements
                                    overflow: "hidden", // Disable scrolling
                                }}
                                onClick={handleOverlayClick} // Close modal only when clicking on the overlay itself
                            >
                                <div className="cursor-default">
                                    <Login 
                                        loginWithGoogle = {loginWithGoogle}
                                        loginWithGithub = {loginWithGithub}
                                        loginWithEmailAndPassword = {loginWithEmailAndPassword}
                                        registerWithEmailAndPassword = {registerWithEmailAndPassword}
                                    />
                                </div>
                            </motion.div>
                        )}
                        <motion.h1
                            className="text-6xl text-black font-bold tracking-widest uppercase text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            style={{ zIndex: 1 }}
                        >
                            
                            <div>Klix</div>
                        </motion.h1>
                    </AnimatePresence>
                    <div className="bg-white flex flex-col items-center justify-center mt-8">
                        <AnimatePresence>
                            <motion.button
                                className="px-6 py-3 bg-gray-200 text-black rounded-full shadow-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.1 }}
                                onClick={() => {
                                    if(auth.currentUser?.email) navigate(HOME);
                                    setShowModal(true);
                                }}
                                style={{ zIndex: 1 }}
                            >
                                Get Started
                            </motion.button>
                        </AnimatePresence>
                    </div>
            </main>
        </>
    );
};
