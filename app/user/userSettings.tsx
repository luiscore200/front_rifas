import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { sendQr, verifySession, importConfig, verifyEmail, saveConfig} from '../../services/api';

import ToastModal from '../../components/toastModal';

import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';
import ConfirmationModal from '../../components/ConfirmModal';
import { CheckMarkIcon, InfoIcon, QuestionMarkIcon } from '../../assets/icons/userIcons';
import { Linking } from 'react-native';




export default function App() {

  const {user,auth,logout}=useAuth();

  const navigationItems = [
    { label: 'Inicio', action: () => router.push('/user/rifa/dashboard'),status:1 },
    { label: 'Configuracion', action: () => console.log("holaa"),status:0 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isWpActive, setIsWpActive] = useState(false);
  const [isWpVerified, setIsWpVerified] = useState(false);
   const [isGmActive, setIsGmActive] = useState(false);
   const [isSuscripted,setIsSuscripted]=useState(false);
   const [responseMessage, setResponseMessage] = useState<string >("");
   const [modalVisible,setModalVisible]=useState(false);
  const [confirmation,setConfirmation]=useState(false);
  const [verifiedError,setVerifiedError]=useState(false);
  const [verifiedGmailError,setVerifiedGmailError]=useState(false);
  const [emailVerified,setEmailVerified]=useState(false);

 

  useEffect(()=>{ setIsSuscripted(user?.payed? true:false)
  },[user]);

   useEffect(()=>{handleConfig()},[]);
  



 

 const handleConfig = async()=>{
  try {
    const response = await importConfig();
    if(!!response.mensaje){
       if(!!response.config){
        setEmail(response.config.email===null?'':response.config.email);
        setPassword(response.config.password_email===null?'':response.config.password_email);
        setIsWpVerified(response.config.phone_verified===1?true:false);
        setIsWpActive(response.config.phone_status===1?true:false);
        setEmailVerified(response.config.email_verified===1?true:false);


       
        console.log(response.config);
       }
    }
  } catch (error) {
    
  }

 }

 const handleWpStatus = ()=>{
  setIsWpActive(!isWpActive);
  if(!isWpVerified){
    setVerifiedError(true);
    
   setTimeout(()=>setIsWpActive(false),100) ;
 
  }

 }
 const handleEmailStatus = ()=>{
  setIsGmActive(!isGmActive);
  if(!emailVerified){
   setVerifiedGmailError(true);
    
   setTimeout(()=>setIsGmActive(false),100) ;
 
  }

 }



  const handleSave = async () =>{
  //  if(!isSuscripted){setResponseMessage("Las opciones de notificacion solo estan disponibles para usuarios suscritos");setModalVisible(true);}

    try {
      const response = await saveConfig({phone_status:isWpActive?1:0,phone_verified:isWpVerified?1:0,email:email,password_email:password,email_verified:emailVerified?1:0,email_status:isGmActive?1:0});
      console.log(response);
    } catch (error) {
      
    }

    
  }
  const handleConfirm = ()=>{
    if(!isSuscripted){
      setResponseMessage("Las opciones de notificacion solo estan disponibles para usuarios suscritos");
      setModalVisible(true);
    }

  }

  const handleVerify = async () => {
    // Lógica para verificar el teléfono aquí
    console.log("Verificar teléfono");
    try {
      const response = await verifySession();
      if(!!response.mensaje){
        setIsWpVerified(true);
        setResponseMessage(response.mensaje);
        setModalVisible(true);
      }
      if(!!response.error){
        setIsWpVerified(false);
        setResponseMessage(response.error);
        setModalVisible(true);
      }
      console.log(response);
    } catch (error:any) {
      setIsWpVerified(false);
      setResponseMessage(error.message);
      setModalVisible(true);
    }
  };

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


  const handleSendQR = async () => {
 try {
    setIsWpVerified(false);
    const response = await sendQr()
     console.log(response);
 } catch (error) {
  
 }
  };

  const openLink = () => {
    const url = 'https://docs.rocketbot.com/2020/01/15/como-habilitar-las-aplicaciones-poco-seguras-en-gmail/';
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
 
   <GradientLayout  navigationItems={navigationItems} hasDrawer={true}>

<ScrollView  style={styles.main}>
<View style={styles.formContainer}>
<Text style={{ fontWeight: 'bold', fontSize: 20,color:'#374151', marginBottom: 10 }}>Notificaciones</Text>
<Text style={{ fontSize: 16, color: '#666',paddingBottom:15 }}>En esta parte podras configurar tu sistema de notificaciones.</Text>



  {/* Input para Whatsapp */}
  <View style={[styles.inputGroup,{marginTop:15}]}>
  <View style={{flexDirection:'row',marginBottom:10}}>
           <Text style={styles.label}>Whatsapp</Text>
            {isWpVerified && (<View style={{marginLeft:10}}><CheckMarkIcon  style={{color:'green'}}/></View>)}
          
           </View>
            <View style={{ flexDirection: 'row' }}>
            
              <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1' }]} onPress={()=>setConfirmation(true)}>
                <Text style={styles.buttonText}>Enviar QR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#6366F1', marginLeft: 10 }]} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verificar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
    
            <View style={styles.statusContainer}>
              <Switch
                value={isWpActive}
                onValueChange={handleWpStatus}
                trackColor={{ false: isSuscripted ? "#fee2e2" : "#ccc", true: "#dcfce7" }}
                thumbColor={isWpActive ? "#34D399" : isSuscripted ? "#EF4444" : "#888"}
                disabled={!isSuscripted}
              />
                <Text style={[styles.statusText, { color: isSuscripted ? (isWpActive ? '#10B981' : '#EF4444') : '#888' }]}>
                {isSuscripted ? (isWpActive ? 'Activo' : 'Inactivo') : 'Disabled'}
              </Text>
            </View>
            {verifiedError && !isWpVerified && (<Text style={{color:'red',marginTop:10}}>Necesita tener la sesion verificada antes de activar el servicio</Text>)}
          </View>

          <View style={[styles.inputGroup,{marginTop:15}]}>
          <View style={{flexDirection:'row'}}>
           <Text style={styles.label}>Gmail</Text>
            {emailVerified && (<View style={{marginLeft:10}}><CheckMarkIcon  style={{color:'green'}}/></View>)}
           </View>
          <View style={[styles.inputGroup,{paddingLeft:20}]}>
            <Text style={{ marginBottom: 8,color: '#666', fontWeight: 'bold' }}>Correo</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
          <View style={[styles.inputGroup,{paddingLeft:20}]}>
            <Text style={{ marginBottom: 8,color: '#666', fontWeight: 'bold' }}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
         
              
            />
                
          </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:10}}>

        <TouchableOpacity  onPress={openLink} style={{marginLeft:25}}><InfoIcon style={{color:'#6b7280'}}/></TouchableOpacity>
            <TouchableOpacity style={[ { backgroundColor: '#6366F1', borderRadius:10,alignItems:'center',justifyContent:'center', marginLeft: 10,width:150,height:45 }]} onPress={handleEmailVerify}>
                <Text style={styles.buttonText}>Verificar</Text>
              </TouchableOpacity>
             
              
              </View>
          </View>
        

          <View style={styles.inputGroup}>
      
            <View style={styles.statusContainer}>
            <Switch
                value={isGmActive}
                onValueChange={handleEmailStatus}
                trackColor={{ false: isSuscripted ? "#fee2e2" : "#ccc", true: "#dcfce7" }}
                thumbColor={isGmActive ? "#34D399" : isSuscripted ? "#EF4444" : "#888"}
                disabled={!isSuscripted}
              />
              <Text style={[styles.statusText, { color: isSuscripted ? (isGmActive ? '#10B981' : '#EF4444') : '#888' }]}>
                {isSuscripted ? (isGmActive ? 'Activo' : 'Inactivo') : 'Disabled'}
              </Text>
            </View>
             {verifiedGmailError && !emailVerified && (<Text style={{color:'red',marginTop:10}}>Necesita tener la sesion verificada antes de activar el servicio</Text>)}
          </View>
          
     
          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
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
{(
  <ConfirmationModal
  mode='confirm'
  message='Se eliminará y se creará un nuevo intento de sesion, el Qr le sera enviado a su email de registro'
  visible={confirmation}
  onCancel={()=>setConfirmation(false)}
  onConfirm={handleSendQR}
  onClose={()=>setConfirmation(false)}
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
    borderColor: '#ddd',
    borderRadius: 12,
    
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 20,
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,

    
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
