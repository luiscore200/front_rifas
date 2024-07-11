import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';

import { router } from 'expo-router';
import {  importConfig, verifyEmail, saveConfig, saveAdminConfig, importAdminConfig} from '../../services/api';

import ToastModal from '../../components/toastModal';

import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';

import { CheckMarkIcon, InfoIcon, NextIcon, QuestionMarkIcon, UpIcon } from '../../assets/icons/userIcons';
import { Linking } from 'react-native';
import NotificationCard from '../../components/admin/dashboard/notificationCard';
import BannerCard from '../../components/admin/dashboard/bannerCard';
import UnSuscriptedCard from '../../components/admin/dashboard/UnSuscriptedCard';
import { Ionicons } from '@expo/vector-icons';
import LandingCard from '../../components/admin/dashboard/LandingStyleCard';





export default function App() {

  const {user,auth,logout}=useAuth();


  const navigationItems = [
    { label: 'Inicio', action: () => router.push('/admin/dashboard'),status:1 },
    { label: 'Configuracion', action: () => console.log("holaa"),status:0 },
    { label: 'Logout', action: async() => logout(),status:auth===true?1:0},
  ];



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [isGmActive, setIsGmActive] = useState(false);
   
   const [responseMessage, setResponseMessage] = useState<string >("");
   const [modalVisible,setModalVisible]=useState(false);
  const [verifiedGmailError,setVerifiedGmailError]=useState(false);
  const [emailVerified,setEmailVerified]=useState(false);
  const [bannerCard,setBannerCard]=useState(false);
  const [unSuscriptedCard,setunSuscriptedCard]=useState(false);
  const [notificationCard,setNotificationCard]=useState(false);
  const [landingCard,setLandingCard]=useState(false);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [image1Changed, setImage1Changed] = useState<boolean>(false);
  const [image2Changed, setImage2Changed] = useState<boolean>(false);
  const [image3Changed, setImage3Changed] = useState<boolean>(false);

  const [countRifas,setCountRifas]=useState<string>("");
  const [maximo,setMaximo]=useState<number>(0);
  const [logo,setLogo]=useState<string | null>(null);
  const [icono,setIcono]=useState<string | null>(null);
  const [app_name,setApp_name]=useState<string>("");
  const [logoChanged,setLogoChanged]=useState<boolean>(false);
  const [iconoChanged,setIconoChanged]=useState<boolean>(false);
 


   useEffect(()=>{handleConfig()},[]);
  
 const handleConfig = async()=>{
  try {
    const response = await importAdminConfig();
    if(!!response.mensaje){
      setResponseMessage(response.mensaje);
      setModalVisible(true);
        if(!!response.config){
          setEmail(response.config.email);
          setPassword(response.config.email_password);
          setImage1(response.config.banner_1===""?null:response.config.banner_1); 
          setImage2(response.config.banner_2===""?null:response.config.banner_2); 
          setImage3(response.config.banner_3===""?null:response.config.banner_3); 
          setMaximo(response.config.raffle_number);
          setCountRifas(response.config.raffle_count);
          setApp_name(response.config.app_name);
          setLogo(response.config.app_logo===""?null:response.config.app_logo);
          setIcono(response.config.app_icon===""?null:response.config.app_icon);

          


       
        console.log(response.config);
       }
    }else if(!!response.error){
      setResponseMessage(response.error);
      setModalVisible(true);
    }
  } catch (error:any) {
    setResponseMessage(error.message);
    setModalVisible(true);
  }

 }

 const handleEmailStatus = ()=>{
  setIsGmActive(!isGmActive);
  if(!emailVerified){
   setVerifiedGmailError(true);
    
   setTimeout(()=>setIsGmActive(false),100) ;
 
  }

 }

 const imageBody= async(image:any)=>{
  const filename = image.split('/').pop();
  const match =  filename? /\.(\w+)$/.exec(filename):undefined;
  const type = match ? `image/${match[1]}` : `image`;
  return {uri:image,name:filename,type};
 }

  const handleSave = async () =>{


    try {
      const data = new FormData();
      data.append("email",email);
      data.append("email_password",password);
      data.append("app_name",app_name);
      data.append("raffle_count",countRifas);
      data.append("raffle_number",maximo);
      



      if (image1Changed && image1) {
        const body =  await imageBody(image1)
        data.append('banner_1',body);
      }
      if (image2Changed && image2) {
        const body =  await imageBody(image2)
        data.append('banner_2',body);
      }
      if (image3Changed && image3) {
        const body =  await imageBody(image3)
        data.append('banner_3',body);
      }
      if (logoChanged && logo) {
        const body =  await imageBody(logo)
        data.append('app_logo',body);
      }
      if (iconoChanged && icono) {
        const body =  await imageBody(icono)
        data.append('app_icon',body);
      }
    //console.log(data);
     const response = await saveAdminConfig(data);
      console.log(response);

    } catch (error) { 
      
    }

    
  }

const handleEmailVerify= async()=>{
  try {
    const response = await verifyEmail(email,password);
    console.log(response);
    if(!!response.mensaje){
      setEmailVerified(true);
      setResponseMessage(response.mensaje);
      setModalVisible(true);
    }
    if(!!response.error){
      setEmailVerified(false);
      setResponseMessage(response.error);
      setModalVisible(true);
    }
    console.log(response);
  } catch (error:any) {
    setEmailVerified(false);
    setResponseMessage(error.message);
    setModalVisible(true);
  }
      
  
}

const toggle=(number:number)=>{
 if(number===1){
    setNotificationCard(!notificationCard);
    setBannerCard(false);
    setunSuscriptedCard(false);
    setLandingCard(false);
 }
 if(number===2){
    setNotificationCard(false);
    setBannerCard(!bannerCard);
    setunSuscriptedCard(false);
    setLandingCard(false);
 }

 if(number===3){
    setNotificationCard(false);
    setBannerCard(false);
    setunSuscriptedCard(!unSuscriptedCard);
    setLandingCard(false);
 }
 if(number===4){
  setLandingCard(!landingCard)
  setNotificationCard(false);
  setBannerCard(false);
  setunSuscriptedCard(false);
}

}

const handleNotificationUpdate = (input:string,value:any)=>{
    if(input==="email"){
      setEmail(value);
    }
    if(input==="password"){
      setPassword(value);
    }
    
}

const handleBannerUpdate = (input:string,value:any)=>{
  if(input==="image1"){
    setImage1(value);
    setImage1Changed(true);
  }
  if(input==="image2"){
    setImage2(value);
    setImage2Changed(true);
  }
  if(input==="image3"){
    setImage3(value);
    setImage3Changed(true);
  }
  
}
const handleUnsuscriptedUpdate = (input:string,value:any)=>{
  if(input==="rifas"){
    setCountRifas(value);
  }
  if(input==="numeros"){
    setMaximo(value);
  }
 
  
}

const handleLandingdUpdate = (input:string,value:any)=>{
  if(input==="nombre"){
    setApp_name(value);
  }
  if(input==="logo"){
   setLogo(value);
   setLogoChanged(true);
  }
  if(input==="icono"){
    setIcono(value);
    setIconoChanged(true);
   }
  
}




  return (
 
   <GradientLayout  navigationItems={navigationItems} hasDrawer={true}>


<ScrollView   style={styles.main}  nestedScrollEnabled={true}>

{!notificationCard && (
  <TouchableOpacity style={styles.formCard} onPress={() => toggle(1)}>
  <View style={{ marginRight: 20 }} >
    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Notificaciones</Text>
    <Text style={{ fontSize: 16, color: '#666', }}>Configura tus notificaciones</Text>
  </View>
  <View style={{position: 'absolute', right: 25}}>
 {!notificationCard && (<NextIcon style={{color:"#CCCCC", width:28,height:28 }} />)}
 {notificationCard && (<UpIcon style={{color:"#CCCCC",width:28,height:28 }} />)}
 </View>
</TouchableOpacity>
)}

{ notificationCard &&(
    <View style={styles.formContainer}>
  <TouchableOpacity onPress={undefined} activeOpacity={1}>
    <NotificationCard  obj={{email,password,emailVerified}} onToggle={()=>toggle(1)} onUpdate={(value1,value2)=>handleNotificationUpdate(value1,value2)} onTouchVerify={()=>handleEmailVerify()}/>
    </TouchableOpacity>
    </View>
)}

{!bannerCard && (
  <TouchableOpacity style={styles.formCard} onPress={() => toggle(2)}>
  <View style={{ marginRight: 20 }} >
    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Publicidad</Text>
    <Text style={{ fontSize: 16, color: '#666', }}>Configura tu publicidad</Text>
  </View>
  <View style={{position: 'absolute', right: 25}}>
 {!bannerCard && (<NextIcon style={{color:"#CCCCC", width:28,height:28 }} />)}
 {bannerCard && (<UpIcon style={{color:"#CCCCC",width:28,height:28 }} />)}
 </View>
</TouchableOpacity>
)}

{bannerCard && (

<View style={styles.formContainer}>
<TouchableOpacity onPress={undefined} activeOpacity={1}>
<BannerCard  obj={{image1,image2,image3}} onToggle={()=>toggle(2)} onUpdate={(field,value)=>handleBannerUpdate(field,value)}/>
</TouchableOpacity>
</View>
)}

{!unSuscriptedCard && (
  <TouchableOpacity style={styles.formCard} onPress={() => toggle(3)}>
  <View style={{ marginRight: 20 }} >
    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Suscripciones</Text>
    <Text style={{ fontSize: 16, color: '#666', }}>Configura las limitaciones</Text>
  </View>
 <View style={{position: 'absolute', right: 25}}>
 {!unSuscriptedCard && (<NextIcon style={{color:"#CCCCC", width:28,height:28 }} />)}
 {unSuscriptedCard && (<UpIcon style={{color:"#CCCCC",width:28,height:28 }} />)}
 </View>
</TouchableOpacity>
)}

{unSuscriptedCard && (
    <View style={styles.formContainer}>
      <TouchableOpacity onPress={undefined} activeOpacity={1}>
    <UnSuscriptedCard obj={{maximo,countRifas}} onToggle={()=>toggle(3)} onUpdate={(value1,value2)=>handleUnsuscriptedUpdate(value1,value2)}/>
      </TouchableOpacity>
    </View>
    
)}

{!landingCard && (
  <TouchableOpacity style={styles.formCard} onPress={() => toggle(4)}>
  <View style={{ marginRight: 20 }} >
    <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Landing</Text>
    <Text style={{ fontSize: 16, color: '#666', }}>Configura el estilo</Text>
  </View>
 <View style={{position: 'absolute', right: 25}}>
 {!landingCard && (<NextIcon style={{color:"#CCCCC", width:28,height:28 }} />)}
 {landingCard && (<UpIcon style={{color:"#CCCCC",width:28,height:28 }} />)}
 </View>
</TouchableOpacity>
)}

{landingCard && (
    <View style={styles.formContainer}>
      <TouchableOpacity onPress={undefined} activeOpacity={1}>
    <LandingCard obj={{app_name,logo,icono}} onToggle={()=>toggle(4)} onUpdate={(value1,value2)=>handleLandingdUpdate(value1,value2)}/>
      </TouchableOpacity>
    </View>
    
)}


<View style={styles.inputGroup}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>



</ScrollView>
{ (
  <ToastModal
  message={responseMessage}
  visible={modalVisible}
  onClose={()=>setModalVisible(false)}
  time={3000}
  blockTime={500}
  
  />
)}


</GradientLayout>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

 
  formContainer: {
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 20,
    borderWidth: 1,
   
    borderColor: '#ddd',
    borderRadius: 12,
    
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,


  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: 'black', textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8,color:'#374151', fontWeight: 'bold' },
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 25,
    marginHorizontal:10,
    borderWidth: 1,
    borderColor: '#ddd',
   
    padding: 16,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    borderColor: "#ccc",
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  picker: {
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
  },
  placeholderText: {
    color: '#ccc',
  },
  selectedCodeText: {
    height: 40,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInput: {
    height: 40,
    width: '100%',
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
    formCard: {
  
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 20,
    
    
    flexDirection:'row',
    alignItems:'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    

    
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
   
 
  },
});
