import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { MenuIcon2 } from '../assets/icons/userIcons';


interface GradientLayoutProps {
  children:any;
  navigationItems:any;
  hasDrawer?:boolean;
  Touched?:()=> void;
}

const GradientLayout:React.FC<GradientLayoutProps> = ({ children, navigationItems, hasDrawer = false,Touched }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnimation] = useState(new Animated.Value(0));

  const touched = ()=> {
    if(Touched){Touched();}
  }  

  const toggleDrawer = () => {
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

  return (

  <TouchableWithoutFeedback onPress={isDrawerOpen?toggleDrawer:touched}>
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
