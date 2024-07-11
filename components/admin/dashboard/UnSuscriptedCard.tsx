import React, { useState,useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Picker } from '@react-native-picker/picker';






interface unSuscriptedCardComponentProps{
    obj?:any
    error?:error;
    touched?:any;
   
    
    onUpdate: (field:string,value:any) => void;
    onToggle:()=>void;
}
interface error{
  tipo?:string;
  titulo?:string;
  numeros?:number;
  pais?:string;
  precio?:string;
}

const UnSuscriptedCard : React.FC<unSuscriptedCardComponentProps> = ({ obj,touched,error,onToggle,  onUpdate }) => {
  

   
   
  
   const number =['100','1000','10000'];
  
  
    const handleFieldChange = (field:any, value:any) => {
      
      onUpdate(field,value);
      
     
    };
    
  
    
return(
  <View>
    <TouchableOpacity onPress={onToggle} activeOpacity={1}>
    <Text style={{ fontWeight: 'bold', fontSize: 20,color:'#374151', marginBottom: 10 }}>Suscripciones</Text>
<Text style={{ fontSize: 16, color: '#666',paddingBottom:15 }}>En esta parte podras configurar tu sistema de suscripciones.</Text>
</TouchableOpacity>

  <View style={styles.inputGroup}>
            <Text style={styles.label}>Numero de rifas</Text>
            <TextInput
            style={styles.input}
            value={obj.countRifas.toString()}
            onChangeText={(value)=>handleFieldChange("rifas",value)}
            keyboardType='numeric'
            />
          
          </View>
        

   <View style={styles.inputGroup}>
    <Text style={styles.label}>Numeros</Text>
    <View style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, justifyContent: 'center' }}>
      <Picker
        selectedValue={obj.maximo}

        onValueChange={(itemValue) => handleFieldChange("numeros",Number(itemValue))}
       
        style={{
          height: 40,
          paddingHorizontal: 10,
          borderColor: '#fff',
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        {number.map(array => <Picker.Item key={array} label={array.toString()} value={array} />)}
      </Picker>
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
  

export default UnSuscriptedCard;