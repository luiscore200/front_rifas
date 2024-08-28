import React, { useState,useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Picker } from '@react-native-picker/picker';
import { Delete2Icon, NextIcon, UpIcon } from '../../../assets/icons/userIcons';
import * as ImagePicker from 'expo-image-picker';





interface SuscriptedCardComponentProps{
    obj?:any;
    open:boolean;
    error?:error;
    touched?:any;
   
    
    onUpdate: (field:string,value:any) => void;
    onToggle:()=>void;
    onDelete:()=>void;
}
interface error{
  tipo?:string;
  titulo?:string;
  numeros?:number;
  pais?:string;
  precio?:string;
}

const SuscriptedCard : React.FC<SuscriptedCardComponentProps> = ({ obj,open, error,onToggle,onDelete,  onUpdate }) => {
  
 // console.log(open);
   
   
  
   const number =['100','1000','10000'];

  
    const handleFieldChange = (field:any, value:any) => {
      
      onUpdate(field,value);
      
     
    };


    
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
          handleFieldChange("image",uri)
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
            alert('Hubo un error al    capturar la foto.');
          }
    
    
     
      };
  



      return(
        
        <View style={{borderColor:"#CCCCCC",borderLeftWidth:0,borderRightWidth:0,borderTopWidth:1,borderBottomWidth:1, padding:10, paddingTop:20}}>

      {!open && (<View>
        <TouchableOpacity onPress={onToggle}  style={{justifyContent:'space-between',flexDirection:'row',marginRight:10, marginTop:5,marginBottom:15}}  activeOpacity={1}>     
      <Text style={{ fontSize: 16, color: '#666', }}>{obj.name?obj.name:"Suscripcion sin nombre"}</Text>
      <NextIcon style={{color:"#CCCCCC",width:28,height:28 }} />
       
       </TouchableOpacity>
      </View>
        )}    
     
      {open && (<View>
      <TouchableOpacity onPress={onToggle}  style={{justifyContent:'space-between',flexDirection:'row',marginRight:10, marginTop:5,marginBottom:15}}  activeOpacity={1}>     
      <Text style={{ fontSize: 16, color: '#666', }}>{obj.name?obj.name:"Suscripcion sin nombre"}</Text>
      <UpIcon style={{color:"#CCCCCC",width:28,height:28 }} />
       
       </TouchableOpacity>

      <View style={styles.inputGroup}>
            <Text style={styles.label}>suscripcion ID</Text>
            <TextInput
            style={styles.input}
            value={obj.sub_id.toString()}
            onChangeText={(value)=>handleFieldChange("sub_id",value)}
       
            />
          
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre plan</Text>
            <TextInput
            style={styles.input}
            value={obj.name.toString()}
            onChangeText={(value)=>handleFieldChange("name",value)}
       
            />
          
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Url</Text>
            <TextInput
            style={styles.input}
            value={obj.url.toString()}
            onChangeText={(value)=>handleFieldChange("url",value)}
           
            />
          
          </View>

      
          <View style={styles.inputGroup}>
          <Text style={styles.label}>imagen</Text>   
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection:'row' }}>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1' }]} onPress={()=>pickImage(1)} >
              <Text style={styles.buttonText}>Escoger </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1', marginLeft: 10 }]} onPress={()=>takePhoto(1)} >
              <Text style={styles.buttonText}>Capturar</Text>
            </TouchableOpacity>
          

       </View>
        {obj.image!=="" &&(
    <View style={{marginTop:20,flexDirection:'row',alignItems:'center'}}>
       <Image source={{ uri: obj.image }} style={[styles.image]}></Image>
       <TouchableOpacity style={{marginLeft:40}}  onPress={()=>handleFieldChange("image","")}>
        <Delete2Icon style={{color:'red'}} />

       </TouchableOpacity>
    </View>
  )
  }

</View>







          
  <View style={styles.inputGroup}>
            <Text style={styles.label}>Maximo de rifas</Text>
            <TextInput
            style={styles.input}
            value={obj.max_raffle.toString()}
            onChangeText={(value)=>handleFieldChange("max_raffle",value)}
            keyboardType='numeric'
            />
          
          </View>
        

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Maximo de numeros</Text>
        <View style={{ borderColor: "#ccc", borderWidth: 1, borderRadius: 8, justifyContent: 'center' }}>
          <Picker
            selectedValue={obj.max_num}
            onValueChange={(itemValue) => handleFieldChange("max_num",itemValue)}
            style={{
              borderWidth: 1,
            height: 40,
              paddingHorizontal: 10,
              borderColor: '#fff',
              borderRadius: 8,
            }}
          >
            {number.map(array => <Picker.Item key={array} label={array.toString()} value={array} />)}
          </Picker>
        </View>
         </View>

        
         <View style={styles.inputGroup}>
            <Text style={styles.label}>Whatasapp</Text>
            <View style={styles.statusContainer}>
              <Switch
                value={obj.whatsapp}
                onValueChange={(itemValue) => handleFieldChange("whatsapp",itemValue)}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={obj.whatsapp ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: obj.whatsapp ? '#10B981' : '#EF4444' }]}>
                {obj.whatsapp ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
          
         <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.statusContainer}>
              <Switch
                value={obj.email}
                onValueChange={(itemValue) => handleFieldChange("email",itemValue)}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={obj.email ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: obj.email ? '#10B981' : '#EF4444' }]}>
                {obj.email ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Compartir</Text>
            <View style={styles.statusContainer}>
              <Switch
                value={obj.share}
                onValueChange={(itemValue) => handleFieldChange("share",itemValue)}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={obj.share ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: obj.share ? '#10B981' : '#EF4444' }]}>
                {obj.share ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>



            
         <View style={styles.inputGroup}>
            <Text style={styles.label}>Banners</Text>
            <View style={styles.statusContainer}>
              <Switch
                value={obj.banners}
                onValueChange={(itemValue) => handleFieldChange("banners",itemValue)}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={obj.banners ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: obj.banners ? '#10B981' : '#EF4444' }]}>
                {obj.banners ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={onDelete} style={{position:'absolute',right:20,bottom:20}}>
            <Delete2Icon style={{color:'red'}}/>
          </TouchableOpacity>
          </View>

          
        
      )}
        </View>
      )
    }
    
  





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
      marginTop:10,
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
    image: {
      width: 200,
      height: 300,
      marginTop: 10,
    },
    button: {
      flex: 1,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
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
  

export default SuscriptedCard;