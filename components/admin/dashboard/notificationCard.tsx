import React, { useState,useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch, Linking, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import { CheckMarkIcon, InfoIcon } from '../../../assets/icons/userIcons';






interface NotificationCardComponentProps{
    obj?:any
    error?:error;
    touched?:any;
   
    
    onUpdate: (field:string,value:any) => void;
    onTouchVerify:()=>void;
    onToggle:()=>void;
}
interface error{
  tipo?:string;
  titulo?:string;
  numeros?:number;
  pais?:string;
  precio?:string;
}

const NotificationCard : React.FC<NotificationCardComponentProps> = ({ obj,touched,error,onToggle,  onUpdate ,onTouchVerify }) => {
 
  
  

    const handleFieldChange = (field:any, value:any) => {
      
      onUpdate(field,value);
      
     
    };
    
    const openLink = () => {
        const url = 'https://docs.rocketbot.com/2020/01/15/como-habilitar-las-aplicaciones-poco-seguras-en-gmail/';
        Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
      };
    
    
return(
  <View >
  <View style={styles.inputGroup}>
 <TouchableOpacity onPress={onToggle} activeOpacity={1}>
 <Text style={{ fontWeight: 'bold', fontSize: 20,color:'#374151', marginBottom: 10 }}>Notificaciones</Text>
 <Text style={{ fontSize: 16, color: '#666',paddingBottom:15 }}>En esta parte podras configurar tu sistema de notificaciones.</Text>
 </TouchableOpacity>



  
         

          <View style={[styles.inputGroup,{marginTop:15}]}>
          <View style={{flexDirection:'row'}}>
           <Text style={styles.label}>Gmail</Text>
            {obj.emailVerified && (<View style={{marginLeft:10}}><CheckMarkIcon  style={{color:'green'}}/></View>)}
           </View>
          <View style={[styles.inputGroup,{paddingLeft:20}]}>
            <Text style={{ marginBottom: 8,color: '#666', fontWeight: 'bold' }}>Correo</Text>
            <TextInput style={styles.input} value={obj.email} onChangeText={(value)=>handleFieldChange("email",value)} keyboardType="email-address" />
          </View>
          <View style={[styles.inputGroup,{paddingLeft:20}]}>
            <Text style={{ marginBottom: 8,color: '#666', fontWeight: 'bold' }}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={obj.password}
              onChangeText={(value)=>handleFieldChange("password",value)}
         
              
            />
                
          </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:10}}>

        <Pressable  onPress={openLink} style={{marginLeft:25}}><InfoIcon style={{color:'#6b7280'}}/></Pressable>
            <TouchableOpacity style={[ { backgroundColor: '#6366F1', borderRadius:10,alignItems:'center',justifyContent:'center', marginLeft: 10,width:150,height:45 }]} onPress={onTouchVerify}>
                <Text style={styles.buttonText}>Verificar</Text>
              </TouchableOpacity>
             
              
              </View>
          </View>
        

           
</View>
</View>

);
};



const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 64,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    main: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFFFFF',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      marginLeft: 8,
      fontWeight: 'bold',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#CCCCCC',
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'flex-start',
      marginLeft: 16,
    },
    backButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    container: {
      flex: 1,
    },
    formContainer: {
      padding: 16,
      marginHorizontal: 10,
      marginVertical: 20,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: "#CCCCCC",
      borderRadius: 10,
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: 'black', textAlign: 'center' },
    inputGroup: { marginBottom: 16 },
    label: { marginBottom: 8, color: 'black', fontWeight: 'bold' },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: '#FFFFFF',
    },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
    saveButton: {
      backgroundColor: '#6366F1',
      paddingHorizontal: 20,
      paddingVertical: 15,
      marginHorizontal:10,
      borderRadius: 10,
      marginTop: 20,
    },
    cancelButton: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
    },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
    
    formCard: {
      borderWidth: 1,
      borderColor: "#CCCCCC",
      padding: 16,
      marginHorizontal: 10,
      marginVertical: 20,
      paddingVertical: 20,
      borderRadius:10,
      flexDirection:'row',
      alignItems:'center',
      
    }
  });
  

export default NotificationCard;