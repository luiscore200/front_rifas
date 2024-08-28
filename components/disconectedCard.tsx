import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Svg, Path, Line,Polygon, Circle, Polyline } from 'react-native-svg';



interface DisconectedProps {
    
    offline:boolean;
    onReload: () => void;
   onOffline: () => void;
  }

const DisconectedCard: FC<DisconectedProps>  = ({onReload,onOffline,offline}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
          <Path d="M12 20h.01" />
          <Path d="M8.5 16.429a5 5 0 0 1 7 0" />
          <Path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <Path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
          <Path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
          <Path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
          <Path d="m2 2 20 20" />
        </Svg>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Problema de conexion</Text>
        <Text style={styles.description}>
        Vaya, parece que hubo un problema al conectarse al servidor. Verifique su conexión a Internet y vuelva a intentarlo.
        </Text>
        <TouchableOpacity onPress={()=>onReload()} style={{padding:10, width:120,alignItems:'center',borderRadius:5,backgroundColor:'#9ca3af',marginTop:20}}>
                <Text style={{color:'#f3f4f6'}}>Recagar</Text>            
        </TouchableOpacity>
        {offline && Platform.OS!=="web" && (
            <TouchableOpacity onPress={()=>{onOffline()}} style={{padding:10, width:120,alignItems:'center',borderRadius:5,backgroundColor:'#9ca3af',marginTop:20}}>
                <Text style={{color:'#f3f4f6'}}>Prueba Offline</Text>            
        </TouchableOpacity>)}
        
      </View>
      <View style={styles.buttonContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal:'5%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Substitute with your color
    backgroundColor: '#f5f5f5', // Substitute with your color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    padding: 16,
  },
  icon: {
    width: 32,
    height: 32,
    color: '#333', // Substitute with your color
  },
  textContainer: {
    padding: 16,
    textAlign: 'center',
    alignContent:'center',
    alignItems:'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333', // Substitute with your color
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666', // Substitute with your color
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default DisconectedCard;
