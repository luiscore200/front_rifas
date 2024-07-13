import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MenuIcon2, NotificationBellIcon } from '../assets/icons/userIcons';

import { router } from 'expo-router';


interface GradientLayoutProps {
  children:any;
  navigationItems:any;
  hasDrawer?:boolean;
  hasNotifications?:boolean;
  notificatioitems?:any
  Touched?:()=> void;
}

const GradientLayout:React.FC<GradientLayoutProps> = ({ children, navigationItems,hasNotifications=false,notificatioitems, hasDrawer = false,Touched }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [menu,setMenu]=useState(false);

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



  const Notificaciones = (props:any) => {
    const sistema = props.items.filter((obj:any) => obj.fuente === 'sistema');
    const suscripcion = props.items.filter((obj:any) => obj.fuente === 'suscripcion');
    const configuracion = props.items.filter((obj:any) => obj.fuente === 'configuracion');
  
    const renderNotificaciones = (title:string, notificaciones:any) => (
      <View>
        {notificaciones.length > 0 && (
          <>
            <View style={{ width: '100%', backgroundColor: '#f1f5f9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#1f2937' }}>{title}</Text>
            </View>
            {notificaciones.map((obj:any, index:number) => (
              <TouchableOpacity key={index}  
              activeOpacity={obj.fuente==="suscripcion"||"configuracion"?0:1}
              onPress={()=>obj.fuente==="suscripcion"?console.log("suscripcion"):obj.fuente==="configuracion"?router.navigate("user/userSettings"):undefined }   style={{
                padding: 10,
                borderBottomColor: '#e5e7eb',
                borderBottomWidth: index === notificaciones.length - 1 ? 0 : 1
              }}>
                <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>{obj.mensaje}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{obj.fuente}</Text>
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
      colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
     
      {hasDrawer && (
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButtonContainer}>
            <MenuIcon2 style={styles.menuIcon} />
          </TouchableOpacity>
        )}
    <View>   
       {hasNotifications && (
          <TouchableOpacity style={[styles.menuButtonContainer,{marginHorizontal:15}]} onPress={()=>toggleMenu()}>
          <NotificationBellIcon number={notificatioitems ? notificatioitems.filter((obj:any) => obj.seen === false).length : 0}style={{color:'white'}} />
       </TouchableOpacity>
        )}

       
      </View>
      
      </View>

      {hasDrawer && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerTranslateX }] }]} pointerEvents={'box-none'}>
          <View style={styles.drawer} pointerEvents='box-none'>
            <LinearGradient
              colors={['#6366F1', '#a78bfa']}
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
          <Notificaciones  items={notificatioitems? notificatioitems:[]}/>
        )}
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
    marginTop: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
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
