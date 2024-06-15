import React, { useState,useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import { rifa } from '../../../../config/Interfaces';





interface CardRifaComponentProps{
    rifa:rifa;
    error:error;
    touched:any;
   
    
    onUpdate: (field:string,value:any) => void;
}
interface error{
  tipo?:string;
  titulo?:string;
  numeros?:number;
  pais?:string;
  precio?:string;
}

const CardRifaComponent : React.FC<CardRifaComponentProps> = ({ rifa,touched,error,  onUpdate }) => {
  
    const arrayNumeros = ['10','100','1000','10000'];
    const arrayTipos = [{label:"Premio unico",value:"premio_unico"},{label:"Premios multiples",value:"oportunidades"},{label:"Premios anticipados",value:"anticipados"}];
   

  
  
    const handleFieldChange = (field:any, value:any) => {
      
      onUpdate(field,value);
      
     
    };
    
  
    
return(
  <View>
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Titulo</Text>
    <TextInput
      style={styles.input}
      value={rifa.titulo}
      onChangeText={(text) => handleFieldChange("titulo", text)}
      onBlur={() => handleFieldChange("titulo", rifa.titulo)}
    />
    {touched.titulo && error.titulo && <Text style={{ color: 'red' }}>{error.titulo}</Text>} 

  </View>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>Precio</Text>
    <TextInput
       style={styles.input}  
     // style={{ color: '#a1a1a1', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8 }}
        keyboardType="numeric"
      value={rifa.precio.toString()}
      onChangeText={(text) => handleFieldChange("precio", Number(text))}
      onBlur={() => handleFieldChange("precio", rifa.precio)}
    />
    {touched.precio && error.precio && <Text style={{ color: 'red' }}>{error.precio}</Text>}
</View>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>Numeros</Text>
    <View style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, justifyContent: 'center' }}>
      <Picker
        selectedValue={rifa.numeros}
        onBlur={() => handleFieldChange("numeros", rifa.numeros)}
        onValueChange={(itemValue) => handleFieldChange("numeros", itemValue)}
       
        style={{
          height: 40,
          paddingHorizontal: 10,
          borderColor: '#fff',
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        {arrayNumeros.map(array => <Picker.Item key={array} label={array.toString()} value={array} />)}
      </Picker>
    </View>
    {touched.numeros && error.numeros && <Text style={{ color: 'red' }}>{error.numeros}</Text>}
</View>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>Tipo de rifa</Text>
    <View style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, justifyContent: 'center' }}>
      <Picker
        selectedValue={rifa.tipo}
        onBlur={() => handleFieldChange("tipo", rifa.tipo)}
        onValueChange={(itemValue) => handleFieldChange("tipo", itemValue)}
        style={{
          height: 40,
          paddingHorizontal: 10,
          borderColor: '#fff',
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        {arrayTipos.map(array => <Picker.Item key={array.value} label={array.label} value={array.value} />)}
      </Picker>
    </View>
   {touched.tipo && error.tipo && <Text style={{ color: 'red' }}>{error.tipo}</Text>}
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
  

export default CardRifaComponent;