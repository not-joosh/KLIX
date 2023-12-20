/*===============           DEPENDENCIES            ================*/
import { motion, AnimatePresence } from "framer-motion";
import { DefaultProfileIcon, HamburgerIcon } from "../assets/icons/icons";
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

    /**HANDLE_CLOSE_PROFILE */
    const handleCloseProfile = () => {
        setShowProfileSideBar(false);
    };
    /** USEEFFECT FOR HANDLING REAL TIME DATA BASE */
    useEffect(() => {
        // from Local storage, we will grab the user id, then real time grab their profile picture. then we will update that into a ustate
        const userID = auth.currentUser?.uid || localStorage.getItem("userID");
        const fetchedAccountType = localStorage.getItem("accountType");
        if(!fetchedAccountType) return;
        setAccountType(fetchedAccountType);
        if(!userID) return;
        const unsubscribe = onSnapshot(query(usersRef, where('id', '==', userID)), (snapshot) => {
            const userData = snapshot.docs[0].data();
            //  setProfilePicture("google.com")
            if(userData.profilePictureUrl)
                setProfilePicture(userData.profilePictureUrl);
        });
        return () => unsubscribe();
    }, []);
    return (
        <AnimatePresence>
            <motion.div className="navbar-container bg-black flex items-center justify-between" style={{ padding: "1rem", boxShadow: "0 2px 4px rgba(0, 0, 0, 1)" }}>
                <div className="navbar-left">
                    <motion.div style={{ fill: "white", transition: "all 0.1s ease" }} whileHover={{ scale: 1.2, cursor: "pointer"}} whileTap={{ scale: 0.98 }}> {/*@ts-ignore */}
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
        </AnimatePresence>
    );
};

/*=========================== SIDEBAR ===========================*/

/**INTERFACE */
interface SideBarProps {
    handleCloseSideBar: () => void;
};
/**COMPONENT */
const SideBar = ({handleCloseSideBar}: SideBarProps) => {
    /** THIS COMPONENT IS WHEN THE HAMNBURGER ICON IS CLICKED
     * WHAT IT CONTAINS:
     * 1. SETTINGS ICON
     * 2. A FORM THAT CONTAINS:
     *     - A TEXT INPUT FOR THE USER TO ENTER THEIR NAME
     *     - A BUTTON TO SUBMIT THE FORM
     */
    return (
        <AnimatePresence>
            <div className = "grayish overlay covering the entire screen">

            </div>
            <motion.div className = "side-bar-wrapper">
                <motion.div>

                </motion.div>
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
                    whileHover={{ scale: 1.2, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
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
                    whileHover={{ scale: 1.2, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
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
                    whileHover={{ scale: 1.2, cursor: "pointer"}} whileTap={{ scale: 0.98 }}
                >
                    Logout
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};
