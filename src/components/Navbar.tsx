/*===============           DEPENDENCIES            ================*/
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, DefaultProfileIcon, HamburgerIcon } from "../assets/icons/icons";
import { MouseEventHandler, useEffect, useRef, useState } from "react";

import { auth, db, usersRef } from "../store/firebase";
import { query, where, onSnapshot, doc } from "firebase/firestore";
import { useAuthentication } from "../hooks/authentication";
/*===============            COMPONENT             ================*/
export const Navbar = () => { 
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [showSideBar, setShowSideBar] = useState(false);
    const [showProfileSideBar, setShowProfileSideBar] = useState(false);
    const [accountType, setAccountType] = useState("");

    /** USEEFFECT FOR HANDLING REAL TIME DATA BASE */
    useEffect(() => {        const userID = auth.currentUser?.uid || localStorage.getItem("userID");
        const fetchedAccountType = localStorage.getItem("accountType");
        if(!fetchedAccountType) return;
        setAccountType(fetchedAccountType);
        if(!userID) return;
        const unsubscribe = onSnapshot(query(usersRef, where('id', '==', userID)), (snapshot) => {
            const userData = snapshot.docs[0].data();
            if(userData.profileImgUrl) setProfilePicture(userData.profileImgUrl);
        });
        return () => unsubscribe();
    }, []);
    return (
        <AnimatePresence>
            <motion.div className="navbar-container bg-black flex items-center justify-between" style={{ padding: "1rem", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.8)" }}>
                <div className="navbar-left">
                    <motion.div onClick = {() => {setShowSideBar(true)}} style={{ fill: "white", transition: "all 0.1s ease" }} whileHover={{ scale: 1.2, cursor: "pointer"}} whileTap={{ scale: 0.98 }}> {/*@ts-ignore */}
                        <HamburgerIcon />
                    </motion.div>
                </div>
                <div className="navbar-center" style={{ padding: "0 1rem" }}>
                    <h1 className="text-6xl text-white font-bold tracking-widest uppercase text-centere" style={{ fontSize: "2rem" }}>KLIX</h1>
                </div>
                <div className="navbar-right">
                    <div className="profile-picture-container" onClick={()=>{setShowProfileSideBar(true)}}>
                        {profilePicture?  <motion.img whileTap ={{ scale: 0.98}} whileHover={{ scale: 1.2, cursor: "pointer" }} src={profilePicture} alt={"N/A"} className="bg-white w-12 h-12 rounded-full cursor-pointer mr-4" /> : 
                            <motion.div whileTap ={{ scale: 0.98}} whileHover={{ scale: 1.2, cursor: "pointer" }}>
                                {/*@ts-ignore*/}
                                <DefaultProfileIcon />
                            </motion.div>
                        }
                    </div>
                </div>
            </motion.div>
            {showProfileSideBar && (
                <motion.div>
                    <ProfileSideBar handleCloseProfile={() => setShowProfileSideBar(false)} />
                </motion.div>
            )}
            {showSideBar && (
                <motion.div>
                    <SideBar handleCloseSideBar={() => setShowSideBar(false)} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/*=========================== SIDEBAR ===========================*/

import { SettingsIcon, MailIcon, InfoIcon, PanelTopCloseIcon } from "../assets/icons/icons";
import { useNotifications } from "../hooks/notifications";
import { SETTINGS } from "../store/routes";
import { useThreshHold } from "../hooks/threshold";
/**INTERFACE */
interface SideBarProps {
    handleCloseSideBar: () => void;
};
/**COMPONENT */
const SideBar = ({handleCloseSideBar}: SideBarProps) => {
    const [threshHold, setThreshhold] = useState(0);
    const [accountType, setAccountType] = useState("");
    const [showToolTip, setShowToolTip] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const { toggleNotifcation } = useNotifications();
    const { changeThreshHold } = useThreshHold();

    const updateThreshHold = async (event: React.ChangeEvent<HTMLDivElement>) => {
        try {
            await changeThreshHold((auth.currentUser?.uid ?? "") || (localStorage.getItem("userID") ?? ""), Number(event.target.innerText));
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message)
        };
    };

    /** ATTEMPTING TO ENABLE NOTIFICATIONS IF CONGIRUED*/
    const handleToggleNotifications = async() => {
        try {
            await toggleNotifcation(SETTINGS, (auth.currentUser?.uid ?? "") || (localStorage.getItem("userID") ?? ""));
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message)
        };
    };

    /** USEEFFECT FOR HANDLING REAL TIME DATA BASE */
    useEffect(() => {        const userID = auth.currentUser?.uid || localStorage.getItem("userID");
        const fetchedAccountType = localStorage.getItem("accountType");
        if(!fetchedAccountType) return;
        setAccountType(fetchedAccountType);
        if(!userID) return;
        const unsubscribe = onSnapshot(query(usersRef, where('id', '==', userID)), (snapshot) => {
            const userData = snapshot.docs[0].data();
            // Firstly we will set the boolean to true if any of the notifcations are enabled.
            setIsNotificationsEnabled(userData.isNotificationsEnabled);
            // Secondly, we will go saver the thresHold of the user
            setThreshhold(userData.threshHold);
        });
        return () => unsubscribe();
    }, [threshHold, isNotificationsEnabled]);
    return (
        <AnimatePresence>
            <motion.div
                onClick={handleCloseSideBar}
                className="cursor-pointer fixed inset-0 bg-black bg-opacity-70"
                initial={{ opacity: 0 }} // Initial opacity set to 0
                animate={{ opacity: 1 }} // Animate opacity to 1
                transition={{ duration: 0.3 }} // Set the duration of the fade-in transition
                style={{ backdropFilter: "blur(0.1em)" }} // Apply a slight blur effect
            ></motion.div>
            <motion.section
                className="flex-col items-center side-panel-wrapper bg-black text-white p-2"
                style={{
                    transition: "all 0.1s ease",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    boxShadow: "0 0 10px 0 rgba(255, 255, 255, 0.5)",
                    background: "linear-gradient(to right, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0))",
                }}
                initial={{ x: -1000 }} // Initial position outside the viewport
                animate={{ x: 0 }} // Animate to the original position
            >
                <motion.div style = {{transition: "all 0.1s ease"}}className = "p-5 justify-center  flex" onClick = {handleCloseSideBar}whileTap = {{ scale: 0.98}} whileHover={{ scale: 1.2, cursor: "pointer" }}>
                    {/*@ts-ignore */}
                    <PanelTopCloseIcon />
                </motion.div>


                <motion.div style = {{transition: "all 0.1s ease"}}className = "p-3  flex"  whileTap = {{ scale: 0.98}} whileHover={{ scale: 1.03, cursor: "pointer" }}>
                    {/*@ts-ignore */}
                    <SettingsIcon />
                    <span className = "px-2 text-s font-sans">SETTINGS</span>
                </motion.div>
                
                <motion.div style = {{transition: "all 0.1s ease"}}className = "p-3   flex"  whileTap = {{ scale: 0.98}} whileHover={{ scale: 1.03, cursor: "pointer" }}>
                    <div className="flex items-center mb-6">
                        {/*@ts-ignore */}
                        <MailIcon className="h-6 w-6" />
                        <span className="ml-2 text-lg">INBOX</span>
                    </div>
                </motion.div>

                <motion.div style = {{transition: "all 0.1s ease"}}className = "p-3   flex" whileHover={{cursor: "pointer" }}>
                    <div className="flex items-center mb-6">
                        <div className="relative">
                            <motion.button
                                style={{ transition: 'all 0.1 ease' }}
                                whileHover={{ scale: 0.95 }}
                                className="mr-4 p-2 bg-blue-600 rounded-md focus:outline-none"
                                onMouseEnter={() => setShowToolTip(true)}
                                onMouseLeave={() => setShowToolTip(false)}
                            >
                                {/*@ts-ignore */}
                                <InfoIcon className="h-4 w-4 text-white" />
                            </motion.button>
                            {showToolTip && (
                                <div className="absolute top-0 left-0 mt-8 ml-2 bg-white text-black p-2 rounded-md">
                                    <ToolTip />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-orange-300">THRESHOLD</div>
                            <div
                                className="text-lg"
                                contentEditable
                                onBlur={updateThreshHold}
                                suppressContentEditableWarning={true}
                            >
                                {threshHold}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ transition: "all 0.1s ease" }}
                    className="p-3  items-center justify-center text-center flex"
                >
                    <div className="flex items-center px-2">
                        <motion.div onClick={handleToggleNotifications} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.03, cursor: "pointer" }} className="relative">
                            <input className="sr-only" id="toggle" type="checkbox" />
                            <motion.div className={`block bg-gray-600 w-14 h-8 rounded-full ${isNotificationsEnabled ? "bg-green-400" : "bg-red-400"}`}>
                                <motion.div
                                    className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition ${isNotificationsEnabled ? "bg-green-600" : "bg-red-600"}`}
                                    animate={{ right: isNotificationsEnabled ? "1px" : "auto", left: isNotificationsEnabled ? "auto" : "1px" }}
                                />
                            </motion.div>
                        </motion.div>


                        <label className="ml-4 text-lg font-semibold cursor-pointer">
                            NOTIFICATIONS
                        </label>
                        <span className={`ml-2 text-sm font-semibold ${isNotificationsEnabled ? "text-green-400" : "text-red-400"}`}>
                            {isNotificationsEnabled ? "ENABLED" : "DISABLED"}
                        </span>
                    </div>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    );
};

export const ToolTip = () => {
    return (
        <AnimatePresence>
            <motion.div className="absolute sm:w-24">
                <div className="flex-col items-center z-50 bg-white bg-opacity-75 rounded-md p-4 shadow-lg absolute sm:w-24" style={{ width: "400px" }}>
                    <div className="font-semibold text-black sm:text-sm">What is <span className="text-red-700">Threshold</span>?</div>
                    <hr className="thicker-hr" />
                    <span className="ml-2 text-sm text-gray-900">
                        A user-defined value that triggers notifications when a specific company
                        surpasses or meets the designated threshold of visits.
                    </span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
/*==================== PROFILE SIDEBAR ===========================*/
/**INTERFACE */
interface ProfileSideBarProps {
    handleCloseProfile: () => void;
};
/**COMPONENT */
const ProfileSideBar = ({ handleCloseProfile }: ProfileSideBarProps) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuthentication(); 

    const handleClickOutside: MouseEventHandler<HTMLDivElement> = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            handleCloseProfile();
        };
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    return (
        <AnimatePresence>
            <motion.div
                    className="invisible-overlay"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 5
                    }}
                    onClick={handleClickOutside}
            >
            </motion.div>
            <motion.div
                ref={sidebarRef}
                className="profile-sidebar"
                style={{
                    width: "10rem",
                    backgroundColor: "white",
                    padding: "1rem",
                    position: "absolute",
                    top: "calc(100% - 5rem)",
                    right: 0,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "0.4rem",
                    transition: "all 0.3s ease-in-out",
                    zIndex: 6
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}

            >
                <motion.button
                    className="profile-sidebar-button"
                    style={{
                        color: "black",
                        marginBottom: "0.5rem",
                        width: "100%",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        zIndex: 6
                    }}
                    onClick={handleButtonClick}
                    whileHover={{ scale: 1.04, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
                >
                    View Profile
                </motion.button>
                <motion.button
                    className="profile-sidebar-button"
                    style={{
                        color: "black",
                        marginBottom: "0.5rem",
                        width: "100%",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        zIndex: 6
                    }}
                    onClick={handleButtonClick}
                    whileHover={{ scale: 1.04, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
                >
                    Dashboard
                </motion.button>
                <motion.button
                    className="profile-sidebar-button"
                    style={{
                        color: "black",
                        marginBottom: "0.5rem",
                        width: "100%",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        zIndex: 6
                    }}
                    onClick={logout}
                    whileHover={{ scale: 1.04, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
                >
                    Logout
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};
