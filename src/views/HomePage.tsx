/*===============           DEPENDENCIES            ================*/
import { DebuggingPage } from "./DebuggingPage";
import { useState, useEffect } from "react";
import { TransitionBlob } from "../components/motion/TransitionBlob";
import { LANDINGPAGE } from "../store/routes";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from "../assets/icons/icons";

/*===============            COMPONENT             ================*/
export const HomePage = () => {
    
    const navigate = useNavigate();
    useEffect(() => {
        // Checking if user is already Logged in
        // If not, then redirect them to LANDINGPAGE route
        if (!localStorage.getItem("userID")) {
            navigate(LANDINGPAGE);
        }
    }, []);
    return (
        <>
            <TransitionBlob />
            <div>Home Page</div>
        </>
    );
};