import React, { useState,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { rifa } from '../../../../config/Interfaces';



interface CardRifaComponentProps{
    rifa:rifa;
    onUpdate: (obj:rifa) => void;
}


const CardRifaComponent : React.FC<CardRifaComponentProps> = ({ rifa, onUpdate }) => {
    const [titulo,setTitulo]=useState(rifa.titulo);
    const [tipo,setTipo]=useState(rifa.tipo);
    const [pais,setPais]=useState(rifa.pais);
    const [numeros,setNumeros]=useState<number>(rifa.numeros);
    const arrayNumeros = [10,100,1000,10000];
    const arrayTipos = [{label:"Premio unico",value:"premio_unico"},{label:"Premios multiples",value:"oportunidades"},{label:"Premios anticipados",value:"anticipados"}];

    
    function handleUpdateTitulo(text:string){
      setTitulo(text);
      const rifa:rifa = { titulo:text,pais:pais,numeros:numeros,tipo:tipo };
      onUpdate(rifa);
    }
    function handleUpdatePais(text:string){
        setPais(text);
        const rifa:rifa = { titulo:titulo,pais:text,numeros:numeros,tipo:tipo };
        onUpdate(rifa);
    }
    function handleUpdateNumeros(text:number){
        setNumeros(text);
        const rifa:rifa = { titulo:titulo,pais:pais,numeros:text,tipo:tipo };
        onUpdate(rifa);
    }
    function handleUpdateTipo(text:string){
        setTipo(text);
        const rifa:rifa = { titulo:titulo,pais:pais,numeros:numeros,tipo:text };
         onUpdate(rifa);
        
    }


    
return(
 <View>
       <View style={styles.inputGroup}>
    <Text style={styles.label}>Titulo</Text>
    <TextInput
      style={styles.input}
      value={titulo}
      onChangeText={handleUpdateTitulo}
    />
  </View>

   
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Pais</Text>
    <TextInput
      editable={false}
      style={{color:'#a1a1a1', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8,}}
      value={pais}
      
    //  onChangeText={setName}
    />
  </View>
  <View style={styles.inputGroup}>
    <Text style={styles.label}>Numeros</Text>
    <View style={{borderColor:"#ccc",borderWidth:1,borderRadius:8,justifyContent:'center'}}>
    <Picker
      selectedValue={numeros}
      onValueChange={(itemValue) => handleUpdateNumeros(Number(itemValue))}
      style={{
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#fff', borderWidth: 1, borderRadius: 8,
      }}
    >
   

    {
        arrayNumeros.map( array =>  <Picker.Item  key={array} label={array.toString()} value={array} />)
      }  
     
  
    </Picker>
    </View>
  </View>

  <View style={styles.inputGroup}>
    <Text style={styles.label}>Tipo de rifa</Text>
    <View style={{borderColor:"#ccc",borderWidth:1,borderRadius:8,justifyContent:'center'}}>
    <Picker
      selectedValue={tipo}
      onValueChange={(itemValue) =>handleUpdateTipo(itemValue)}
      style={{
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#fff', borderWidth: 1, borderRadius: 8,
      }}
    >
 
      {
        arrayTipos.map( array =>  <Picker.Item  key={array.value} label={array.label} value={array.value} />)
      }
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
  

export default CardRifaComponent;