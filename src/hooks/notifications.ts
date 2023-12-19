import { useState } from 'react';
export const useNotifications = () => {
    const [notifications, setNotifications] = useState<string[]>([]);

    const addNotification = (message: string) => {
        setNotifications([...notifications, message]);
    };
    
    const clearNotifications = () => {
        setNotifications([]);
    };

    return {
        notifications,
        addNotification,
        clearNotifications,
    };
};
