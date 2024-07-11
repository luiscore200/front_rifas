import React, { useState } from 'react';
import { View, Button, Platform, Alert, StyleSheet,TouchableOpacity, Text,Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckMarkIcon, Delete2Icon } from '../../../assets/icons/userIcons';







interface LandingCardComponentProps{
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

const LandingCard : React.FC<LandingCardComponentProps> = ({ obj,touched,error, onToggle, onUpdate }) => {
  
   const HandleUpdate=(field:string,value:any)=>{
     onUpdate(field,value);
   }
  
    const pickImage = async (number: number) => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
   
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
  
      if (!result.canceled) {
        saveImage( result.assets[0].uri,number);
      }
    } catch (error:any) {
      console.log(error.message);
      alert("error al usar la galeria");
    }
    };
  
    const saveImage = async(uri:any,number:number)=>{
      if (number === 1) {
        HandleUpdate("logo",uri)
      } else if (number === 2) {
        HandleUpdate("icono",uri)
      }
    }

    
    const takePhoto = async (number: number) => {
     
  
        try {
          await ImagePicker.requestCameraPermissionsAsync();

          let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
    
          if (!result.canceled) {
        
            saveImage( result.assets[0].uri,number);
          }
        } catch (error: any) {
          console.log(error.message); 
          alert('Hubo un error al capturar la foto.');
        }
  
  
   
    };

    
return(
  <View>
  <View style={styles.inputGroup}>
  <TouchableOpacity onPress={onToggle} activeOpacity={1}>
  <Text style={{ fontWeight: 'bold', fontSize: 20,color:'#374151', marginBottom: 10 }}>Landing</Text>
<Text style={{ fontSize: 16, color: '#666',paddingBottom:15 }}>En esta parte podras configurar el estilo de tu landing.</Text>
</TouchableOpacity>
<View style={[styles.inputGroup,{marginTop:15}]}>
       
          <View style={[styles.inputGroup]}>
            <Text style={{ marginBottom: 8,color: '#666', fontWeight: 'bold' }}>Nombre del aplicativo</Text>
            <TextInput style={styles.input} value={obj.app_name} onChangeText={(value)=>HandleUpdate("nombre",value)} keyboardType="email-address" />
          </View>
         
                
          </View>


<View style={{marginTop:20}}>
  <Text style={{marginBottom:10,fontWeight:'600', color:'#666', fontSize:16}}>Logo:</Text>
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection:'row' }}>

<TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1' }]} onPress={()=>pickImage(1)} >
              <Text style={styles.buttonText}>Escoger </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1', marginLeft: 10 }]} onPress={()=>takePhoto(1)} >
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          

  </View>
  {obj.logo &&(
    <View style={{marginTop:20,flexDirection:'row',alignItems:'center'}}>
       <Image source={{ uri: obj.logo }} style={[styles.image]}></Image>
       <TouchableOpacity style={{marginLeft:40}}  onPress={()=>HandleUpdate("logo",null)}>
        <Delete2Icon style={{color:'red'}} />

       </TouchableOpacity>
    </View>
  )
  }

</View>
<View style={{marginTop:20}}>
  <Text style={{marginBottom:10,fontWeight:'600', color:'#666', fontSize:16}}>Icono:</Text>
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection:'row' }}>

<TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1' }]} onPress={()=>pickImage(2)} >
              <Text style={styles.buttonText}>Escoger </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1', marginLeft: 10 }]} onPress={()=>takePhoto(2)} >
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          

  </View>
  {obj.icono &&(
    <View style={{marginTop:20,flexDirection:'row',alignItems:'center'}}>
       <Image source={{ uri: obj.icono }} style={[styles.image]}></Image>
       <TouchableOpacity style={{marginLeft:40}}  onPress={()=>HandleUpdate("icono",null)}>
        <Delete2Icon style={{color:'red'}} />

       </TouchableOpacity>
    </View>
  )
  }
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
    image: {
        width: 200,
        height: 300,
        marginTop: 10,
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
    buttonText: { color: '#FFFFFF', fontWeight: '700', textAlign: 'center' },
    
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
      
    },  button: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  

export default LandingCard;