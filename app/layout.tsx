import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { MenuIcon2, NotificationBellIcon } from '../assets/icons/userIcons';
import Database from '../services/sqlite';


import { router } from 'expo-router';
import { getNotification } from '../services/api';
import { getStorageItemAsync, setStorageItemAsync } from '../services/storage';
import { useAuth } from '../services/authContext2';
import { process } from '../services/reconect';


interface GradientLayoutProps {
  children:any;
  navigationItems:any;
  hasDrawer?:boolean;
  hasNotifications?:boolean;
  Touched?:()=> void;
  touchOut?:boolean;
  touchedOut?:()=>void;
  size?:(a:boolean,b:boolean,c:boolean,d:boolean)=>void;
}

const GradientLayout:React.FC<GradientLayoutProps> = ({ children, navigationItems,hasNotifications=true,touchOut, hasDrawer = false,Touched,touchedOut,size }) => {

  const {online,setOnline,notificacionesContext,setNotificacionesContext}=useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [menu,setMenu]=useState(false);
  const [notificaciones,setNotificaciones]=useState<any>([]);
  const db = new Database();
  const { width, height } = useWindowDimensions();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(width < 360);
    setIsMediumScreen(width >= 360 && width < 768);
    setIsLargeScreen(width >= 768 && width < 1024);
    setIsXLargeScreen(width >= 1024);
  }, [width]);

  useEffect(()=>{
    if(size){
      size(isSmallScreen,isMediumScreen,isLargeScreen,isXLargeScreen);
    }
  },[isSmallScreen,isMediumScreen,isLargeScreen,isXLargeScreen])

  useEffect(()=>{if(touchOut===true){closeAll2()}},[touchOut]);

  useEffect(()=>{handleNotificaciones()},[])

  useEffect(()=>{ if(online)aa();},[online]);

  const aa= async  () => { try { await process() ; } catch (error) {} }

  const handleNotificaciones = async()=>{
   
    try {
      const response = await getNotification();
      
     
      if(!!response.notificaciones){ 
        if(!online)setOnline(true);
        setNotificaciones(response.notificaciones);
        setNotificacionesContext(response.notificaciones);
        if(Platform.OS!=='web'){
          await db.deleteDataTable('notificaciones');
          response.notificaciones.length>0? await db.insert('notificaciones',response.notificaciones):undefined;
        }
     
      }else{
        if(Platform.OS!=='web'){
        //  const noti= await db.index('notificaciones');
         // setNotificaciones(noti);
       
        }
       
      }
  
      
    } catch (error) {
      if(online){

        if(Platform.OS!=='web'){
          const noti= await db.index('notificaciones');
           setNotificaciones(noti); 
           setNotificacionesContext(noti);
          }
          setOnline(false);
      }else{
        setNotificaciones(notificacionesContext);
      }

      }
      //  const not= await getStorageItemAsync("notificaciones");
 
   }

   useEffect(()=>{console.log("notificaiones", notificaciones)},[notificaciones]);
  const touched = ()=> {
    if(Touched){Touched();}
  }

  const closeAll=()=>{
    if(isDrawerOpen){
      toggleDrawer();
    }
    if(menu){
      toggleMenu();
    }
    touched();
  }

  const closeAll2=()=>{
    if(isDrawerOpen){
      const toValue = isDrawerOpen ? 0 : 1;
      Animated.timing(drawerAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsDrawerOpen(!isDrawerOpen);
    }
    if(menu){
      setMenu(!menu);
    }
   if(touchedOut){  touchedOut();}
  }

  const toggleMenu=()=>{
  setMenu(!menu);
  if(Touched){touched()}
  if(isDrawerOpen){toggleDrawer()}
  }

  const toggleDrawer = () => {
    if(menu){toggleMenu()}
    if (Touched) {
      Touched();
    }
    const toValue = isDrawerOpen ? 0 : 1;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSelect = (item:any) => {
    setIsDrawerOpen(false);
    item.action();
  };

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 0], // Width of the drawer
  });



  const DropDown = (props:any) => {
   
  
    
  
    return (
      <View style={{
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'absolute',
        top: '7%',
        right: '1%',
        zIndex: 2,
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }}>
    
        <View style={{ marginVertical: 0 }}>
          
        {navigationItems.map((obj:any,index:number)=>{
    
    return(
            <TouchableOpacity key={index} style={{marginRight:5,marginVertical:2}} onPress={obj.status ===1?obj.action:undefined}>
              <Text style={{color:obj.status===1?'black':'#cbd5e1',fontSize:15}}>{obj.label}</Text>
            </TouchableOpacity>
          )
        })

        }
        </View>
      </View>
    );
  }




  const Notificaciones = (props:any) => {
    const sistema = props.items.filter((obj:any) => obj.type === 'sistema');
    const suscripcion = props.items.filter((obj:any) => obj.type === 'suscripcion');
    const configuracion = props.items.filter((obj:any) => obj.type === 'configuracion');
  
    const renderNotificaciones = (title:string, notificaciones:any) => (
      <View>
        {notificaciones.length > 0 && (
          <>
            <View style={{ width: '100%', backgroundColor: '#f1f5f9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#1f2937' }}>{title}</Text>
            </View>
            {notificaciones.map((obj:any, index:number) => (
              <TouchableOpacity key={index}  
              activeOpacity={obj.type==="suscripcion"||"configuracion"?0:1}
              onPress={()=>obj.type==="suscripcion"?router.navigate("user/suscripcion"):obj.type==="configuracion"?router.navigate("user/userSettings"):undefined }   style={{
                padding: 10,
                borderBottomColor: '#e5e7eb',
                borderBottomWidth: index === notificaciones.length - 1 ? 0 : 1
              }}>
                <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>{obj.description}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{obj.type}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    );
  
    return (
      <View style={{
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'absolute',
        width: 300,
        minHeight: 350,
        maxHeight: 450,
        top: 80,
        right: 10,
        zIndex: 2,
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 16,
          color: '#374151',
          padding: 10,
          borderBottomColor: '#e5e7eb',
          borderBottomWidth: 1
        }}>Notificaciones</Text>
        <ScrollView style={{ marginVertical: 10 }}>
          {renderNotificaciones('Suscripción', suscripcion)}
          {renderNotificaciones('Configuración', configuracion)}
          {renderNotificaciones('Sistema', sistema)}
        </ScrollView>
      </View>
    );
  }


  return (

  <TouchableWithoutFeedback onPress={closeAll}>
    <LinearGradient
      colors={online?['#6366F1', '#BA5CDE']:['#94a3b8','#cbd5e1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={[styles.header, 
      isSmallScreen && { marginTop: '8%',   height: 64,},
      isMediumScreen && { marginTop: '8%',  height: 64,},
      isLargeScreen && {  height: 80, },
      isXLargeScreen && {   height: 80,},

      ]}>
     
      {hasDrawer && (isSmallScreen || isMediumScreen) && (
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButtonContainer}>
            <MenuIcon2 style={styles.menuIcon} />
          </TouchableOpacity>
        )}
    <View>   
       {hasNotifications &&  (isSmallScreen || isMediumScreen)  && (
          <TouchableOpacity style={[styles.menuButtonContainer,{marginHorizontal:15}]} onPress={()=>toggleMenu()}>
          <NotificationBellIcon number={notificaciones?notificaciones.length:0} style={{color:'white'}}   />
       </TouchableOpacity>
        )}

      </View>

      { (isLargeScreen||isXLargeScreen) && (

<View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
<TouchableOpacity  onPress={()=>router.navigate('loading')} activeOpacity={1} >
  <Text style={{color:'white',fontSize:25}}>MegaWIN</Text>
  <Text  style={{color:'white',fontSize:10}}>app de rifas digitales</Text>
</TouchableOpacity>

{//isLargeScreen && (
 // <TouchableOpacity onPress={toggleDrawer} style={[styles.menuButtonContainer,{height:40,width:40}]}>
 // <MenuIcon2 style={styles.menuIcon} />
 //</TouchableOpacity>
//)

}

{ (
    <View style={{alignItems:'center',flexDirection:'row'}}>
      {navigationItems.map((obj:any,index:number)=>{
        return(
        <TouchableOpacity style={{marginRight:20}} key={index}  onPress={obj.status===1?obj.action:undefined}>
            <Text style={{color:obj.status===1?'white':'#d1d5db',fontSize:15}}>{obj.label}</Text>
        </TouchableOpacity>
        )
      })

      }

    </View>
    
)

}



</View>

)}

      
      </View>

      {hasDrawer&& (isSmallScreen||isMediumScreen) && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]} pointerEvents={'box-none'}>
          <View style={styles.drawer} pointerEvents='box-none'>
            <LinearGradient
              colors={online?['#6366F1', '#a78bfa']:['#94a3b8','#cbd5e1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.drawerGradient}
            >
              {navigationItems.map((item: any, index: any) => (
                  item.status === 1 ? (
                    <TouchableOpacity
                      key={index}
                      style={styles.drawerItem}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.drawerItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={index} style={[styles.drawerItem, { opacity: 0.5 }]}>
                      <Text style={styles.drawerItemText}>{item.label}</Text>
                    </View>
                  )
                ))}
            </LinearGradient>
          </View>
        </Animated.View>
      )}
 {menu && (
          <Notificaciones  items={notificaciones? notificaciones:[]}/>
        )}

  { //isDrawerOpen && (isLargeScreen) && (
    //<DropDown></DropDown>
 // )
  }
      {children}
    </LinearGradient>
    </TouchableWithoutFeedback>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
   
    flexDirection: 'row',
    alignItems: 'center',
  
    justifyContent:'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuButtonContainer: {
    zIndex: 2,
  },
  menuIcon: {
    color: 'white',
    fontSize: 24,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 1,
    paddingTop: 94,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  drawerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  drawerItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: 100, // Adjust this value based on your menu button position
    paddingHorizontal: 16,
  },
});

export default GradientLayout;
