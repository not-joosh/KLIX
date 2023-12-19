/*===============           DEPENDENCIES            ===============*/
import { GoogleIcon, GithubIcon } from "../../assets/icons/icons"
import { motion } from "framer-motion";
import { useAuthentication } from '../../hooks/authentication'
/*===============            COMPONENT             ================*/
export const Login = () => {
    const { loginWithGoogle, loginWithGithub } = useAuthentication();
    const slideFadeInVariants = {
        hidden: {
            opacity: 0,
            y: 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.div
            className="bg-black rounded-lg p-6 w-[450px] text-white"
            variants={ slideFadeInVariants }
            initial="hidden"
            animate="visible"
        >
            <h2 className="text-3xl font-bold text-center mb-6">TAP IN</h2>
            <div className="flex flex-col gap-4 mx-8 my-4"> {/* Added mx-4 for horizontal margin */}
                <motion.button onClick = {loginWithGoogle} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-md">
                    {/**@ts-ignore */}
                    <GoogleIcon csName="h-1 w-1" />
                    Continue with Google
                </motion.button>
                <motion.button onClick = {loginWithGithub} whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 bg-gray-700 p-2 rounded-md">
                    {/**@ts-ignore */}
                    <GithubIcon csName="h-1 w-1" />
                    Continue with Github
                </motion.button>
                <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-400 h-px flex-1" />
                    <span className="px-4 text-gray-400">OR</span>
                    <div className="bg-gray-400 h-px flex-1" />
                </div>
                <motion.input
                    className="bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                    placeholder="Email"
                    type="email"
                    whileTap={{ scale: 1.04 }}
                    whileHover={{ scale: 1.02 }}
                />
                <motion.input
                    className="bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                    placeholder="Password"
                    type="password"
                    whileTap={{ scale: 1.04 }}
                    whileHover={{ scale: 1.02 }}
                />
                <div className="flex gap-4">
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex-1 bg-blue-600 p-3 rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 hover:text-white hover:border-transparent">
                        SIGNUP
                    </motion.button>
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="flex-1 bg-red-600 p-3 rounded-md shadow-md hover:shadow-lg hover:bg-red-700 hover:text-white hover:border-transparent">
                        LOGIN
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};