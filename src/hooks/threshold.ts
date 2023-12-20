import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { usersRef } from "../store/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const useThreshHold = () => {
    const [isLoading, setIsloading] = useState(false);
    const toast = useToast();

    const changeThreshHold = async (userID: string, newValue: Number) => {
        try {
            setIsloading(true);
            // Need to udpate the user document with the new threshold
            // Lets firstly trim the newValue
            newValue = Number(newValue.toString().trim());
            if(userID === '') throw new Error('No User Identified');
            // Firstly, check if the newValue is an actual number
            if (isNaN(Number(newValue))) throw new Error('Threshold must be a number');
            // Secondly, check if the newValue is a positive number
            if (Number(newValue) < 0) throw new Error('Threshold must be a positive number');
            // Thirdly, check if the newValue is a whole number
            if (!Number.isInteger(Number(newValue))) throw new Error('Threshold must be a whole number');
            
            const userDocRef = doc(usersRef, userID);
            await updateDoc(userDocRef, {
                threshHold: newValue
            });
            toast({
                title: `Successfully Updated Threshold!`,
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
        } catch (error: unknown) {
            if (error instanceof Error)
                toast({
                    title: 'Could not Update Threshold',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
        } finally {
            setIsloading(false);
        };
    };
    return {
        changeThreshHold,
        isLoading
    };
};