import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";



const AuthContext = createContext({});

export default function AuthProvider({ children }){
    const { getToken } = useAuth();

    useEffect(() => {
        const intereptor = axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await getToken();
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (error) {
                if(error.message?.includes("auth") || error.message?.includes("token")){
                    toast.error("Authentication error. Please refresh the page")
                }  
                }
                return config;
            },
            (error) => {
                console.error("Axios request error");
                return Promise.reject(error); 
            }
            
        )
            return () => axiosInstance.interceptors.request.eject(intereptor);
    },[getToken])

    return <AuthContext.Provider value={{} }>{children}</AuthContext.Provider>
}
