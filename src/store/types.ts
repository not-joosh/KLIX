/*---------------------       AUTHENTICATION      ---------------------*/
export interface AuthenticationData {
    email: string;
    password: string;
};
/*-------------------              TOAST           ---------------------*/
export interface Toast {
    message: string;
    isSuccessful: boolean;
    isClosable: boolean;
    position: 'bottom' | 'top' | 'right-top-corner' | 'right-bottom-corner' | 'left-bottom-corner' | 'left-top-corner';
    duration: number;
};