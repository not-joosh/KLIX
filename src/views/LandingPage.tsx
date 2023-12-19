
import { AnimatePresence, motion } from "framer-motion";
import { Login } from "../components/authentication/Login";
import { useState, useEffect } from "react";
import { LandingPageBG } from "../assets/backdrops/backdrops";

/*===============            COMPONENT             ================*/
export const LandingPage = () => {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
    };
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };
    return (
        <main className="flex flex-col items-center justify-center h-screen mx-auto">
            <motion.img
                src={LandingPageBG}
                alt="Landing Page Background"
                className="absolute h-full w-full object-cover pointer-events-none select-none"
                style={{ zIndex: -1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
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
                                <Login />
                            </div>
                        </motion.div>
                    )}
                    <motion.h1
                        className="text-6xl text-black font-bold tracking-widest uppercase text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Clickonomics
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
                            onClick={() => setShowModal(true)}
                        >
                            Get Started
                        </motion.button>
                    </AnimatePresence>
                </div>
        </main>
    );
};
