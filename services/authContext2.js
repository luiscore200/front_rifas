import { createContext, useContext, useEffect,useState } from "react";
import { saveLocalStorage,isAuthenticated,logout as logoutAuth,getUser } from "./auth";


export const AuthContext = createContext();

export const AuthContextProvider =  ({children}) => {
    const [user, setUser]=useState(null);
    const [auth,setAuth]=useState(undefined);
    

    useEffect(()=>{

        //aaaaaa
        setTimeout(()=>{
           // setAuth(false);
          Auth(); 
          User();
        })
    },[])

    const login = async (resp)=>{
        try {
         
         const r = await saveLocalStorage(resp);
         Auth();
         User();
         return r;
             
        } catch (error) {
            
        }
    }

    const logout = async ()=>{
        try {
            await logoutAuth();
            Auth();
            User();
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


    return(
        <AuthContext.Provider value={{user,auth,login,logout}} >
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