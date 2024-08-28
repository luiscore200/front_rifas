import { Slot, Stack, router, useSegments } from 'expo-router';
import {useAuth,AuthContextProvider} from '../services/authContext2'
import { useEffect } from 'react';
import routes from '../config/routesConfig';
import { Appearance } from 'react-native';



const MainLayout = () => {
  const { auth, user,check } = useAuth();
  const segments = useSegments();
 
 
   
  

  useEffect(() => {
    if ( typeof auth === 'undefined') return;

    const currentRoute = segments.length > 0 ? segments.join('/') : 'index';
    console.log('Ruta actual:', currentRoute);

    const isInPublicRoutes = routes.public.some(route => route.path === currentRoute);
    const isInAdminRoutes = routes.admin.some(route => route.path === currentRoute);
    const isInUserRoutes = routes.user.some(route => route.path === currentRoute);

    if (auth) {
      if (currentRoute === 'index') {
        // Permitir que se quede en la pantalla de carga
        return;
      }


      if ((user?.role === 'admin' && isInAdminRoutes) || (user?.role === 'user' && isInUserRoutes)) {
        // Usuario autenticado intenta acceder a una ruta permitida para su rol
        return;
      } else {
        // Usuario autenticado intenta acceder a una ruta no autorizada
        if (user?.role === 'admin') {
          console.log("Eres administrador pero intentas acceder a rutas no autorizadas.");
        } else if (user?.role === 'user') { 
          console.log("Eres usuario pero intentas acceder a rutas no autorizadas.");
       }
     
        router.replace(user?.role === 'admin' ? 'admin/dashboard' : 'user/rifa/dashboard');
      
        
      }
    } else {
   
    
      if (!isInPublicRoutes) {
        // Usuario no autenticado intenta acceder a una ruta protegida
        console.log("No estás autenticado y estás intentando acceder a una ruta protegida.");
       // router.replace('user/rifa/dashboard');
       // router.replace('admin/adminConfig');
     
      // router.replace('/');
      router.replace('auth/login');
      
      }
    
        
    }
  }, [auth, segments, user]);



  return <Slot />;
};


const RootLayout = () => {
  return (
    <AuthContextProvider>
      <MainLayout />
    
    </AuthContextProvider>
  );
};


export default RootLayout;
