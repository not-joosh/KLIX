/**=============== DEPENDENCIES ==================== */
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersRef } from '../store/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


/**=============== CUSTOM HOOK  ==================== */
export const useNotifications = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const toast = useToast();


    const toggleNotifcation = async (path: string, userID: string) => {
        try {
            setIsLoading(true);
            if (userID === '') throw new Error('No User Identified');
            const userDocRef = doc(usersRef, userID);
            const snapshot = await getDoc(userDocRef);
            const data = snapshot.data() ?? {};
            const notifications = data.notificationsMethods;
            let isProperlyConfigured = false;

            for (const notification in notifications) {
                if (notifications[notification]) {
                    isProperlyConfigured = true;
                    break;
                };
            };
            if (!isProperlyConfigured) throw new Error('No Configurable Notifications');
            // Then we will set the the isNotificationsEnabled to true if it is not already
            await updateDoc(userDocRef, {
                isNotificationsEnabled: !data.isNotificationsEnabled,
                // need to save the rest of the data
            });
            toast({
                title: `Successfully ${data.isNotificationsEnabled ? 'Disabled' : 'Enabled'} Notifications!`,
                status: 'success',
                isClosable: true,
                position: 'top',
                duration: 3000,
            });
        } catch (error: unknown) {
            if (error instanceof Error)
                toast({
                    title: 'Issue Notifications',
                    status: 'error',
                    isClosable: true,
                    position: 'top',
                    description: error.message,
                    duration: 3000,
                });
            navigate(path);
        };
    };

    return {
        toggleNotifcation,
        isLoading
    };
};
