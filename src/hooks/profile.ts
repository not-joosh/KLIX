/**=================== DEPENDENCIES ===========================*/
import { doc } from "firebase/firestore";
import { auth, storage, usersRef } from "../store/firebase";
import { ref } from "yup";
import { deleteObject, uploadBytesResumable } from "firebase/storage";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { set } from "firebase/database";

/**=================== CUSTOM HOOK  ===========================*/
export const useProfile = () => {
    const toast = useToast();
    const [ isLoading, setIsloading ] = useState<boolean>(false);
    const uploadProfilePicture = async (fileIn: File, imgName: string, currentImgUrl: string) => {
        try {
            setIsloading(true);
            
        } catch(error) {
            if (error instanceof Error) 
                toast({
                    title: 'Could not Upload Image.',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
                setIsloading(false);
        } finally {
            setIsloading(false);
        };
    };
    return {
        uploadProfilePicture,
        isLoading,
    };
};