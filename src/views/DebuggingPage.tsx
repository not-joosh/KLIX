import { useAuthentication } from "../hooks/authentication";
export const DebuggingPage = () => {
    const { logout } = useAuthentication();
    const handleButtonClick = async () => {
        // Clearing the localstorage
        try {
          await logout();
        } catch(error: unknown) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
    };
  
    return (
      <div>
        <button onClick={handleButtonClick}>LOGOUT - TEMPORARY</button>
      </div>
    );
};