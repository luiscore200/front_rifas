import { createContext, useContext, useEffect,useState } from "react";
import { saveLocalStorage,isAuthenticated,logout as logoutAuth,getUser, getToken } from "./auth";
import { setStorageItemAsync } from "./storage";



export const AuthContext = createContext();

export const AuthContextProvider =  ({children}) => {
    const [user, setUser]=useState(null);
    const [token,setToken]=useState(null);
    const [auth,setAuth]=useState(false);
    const [online,setOnline]=useState(true);
    const [configContext,setConfigContext]=useState(null);
    const [subContext,setSubContext]=useState(null);
    const [notificacionesContext,setNotificacionesContext]=useState([]);
    const [mySubContext,setMySubContext]=useState(null);
    

    useEffect(()=>{

        //aaaaaa
        setTimeout(()=>{
           // setAuth(false);
         check();
        })
    },[])

    const login = async (resp)=>{
        try {
         
         const r = await saveLocalStorage(resp);
         Auth();
         User();
         Token();
         return r;
             
        } catch (error) {
            
        }
    }

    const check = async()=>{
        try {
            Token();
            Auth();
            User();
        } catch (error) {
            
        }
    }


       
    

    const logout = async ()=>{
        try {
            await logoutAuth();
            Auth();
            User();
            Token();
        } catch (error) {
            console.error("Error during logout", error);
        }
    }

    const Auth = async () =>{
        try {
            const isAuth = await isAuthenticated();
            setAuth(isAuth);
        } catch (error) {
            console.error("Error checking authentication", error);
            setAuth(false);
        }
    }

    
    const User = async () =>{
        try {
            const user = await getUser();
            setUser(user);
        } catch (error) {
            console.error("Error checking authentication", error);
            setUser(undefined);
        }
    }

      
    const Token = async () =>{
        try {
            const token = await getToken();
            setToken(token)
        } catch (error) {
            console.error("Error checking authentication", error);
            setToken(undefined);
        }
    }


    return(
        <AuthContext.Provider value={{user,token,online,auth,configContext,subContext,notificacionesContext,mySubContext,check,setMySubContext, login,logout,setOnline,setConfigContext,setSubContext,setNotificacionesContext}} >
            {children}
        </AuthContext.Provider>
    )

    
    
}
export const useAuth =()=>{
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped inside authcontextprovider ');
      }
      return value;
}