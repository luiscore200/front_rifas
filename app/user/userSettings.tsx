import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { sendQr, verifySession, importConfig, verifyEmail, saveConfig, generalConfig} from '../../services/api';

import ToastModal from '../../components/toastModal';

import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';
import ConfirmationModal from '../../components/ConfirmModal';
import { CheckMarkIcon, InfoIcon, QuestionMarkIcon } from '../../assets/icons/userIcons';
import { Linking } from 'react-native';
import { getStorageItemAsync } from '../../services/storage';




export default function App() {

  const {user,auth,logout,subContext,mySubContext}=useAuth();

  const navigationItems = [
    { label: 'Inicio', action: () => router.push('/user/rifa/dashboard'),status:1 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
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
   const [responseMessage, setResponseMessage] = useState<string >("");
   const [modalVisible,setModalVisible]=useState(false);
  const [confirmation,setConfirmation]=useState(false);
  const [verifiedError,setVerifiedError]=useState(false);
  const [verifiedGmailError,setVerifiedGmailError]=useState(false);
  const [emailVerified,setEmailVerified]=useState(false);
  const [procesando,setProcesando]= useState(false);
  const [verificandoWp,setVerificandoWp]= useState(false);
  const [verificandoEmail,setVerificandoEmail]= useState(false);
  const [sub,setSub]=useState<any>({whatsapp:false,email:false,banners:true});
  
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);

 

  useEffect(()=>{handleSub(user?.id_subscription);
  },[user]);

   useEffect(()=>{handleConfig()},[]);
  

   const handleSub = async(aa:string)=>{
       // const aaa= await getStorageItemAsync("subscriptions");
    
      //  console.log("suscripciones",aaa);
      // const jaaa= aaa!==null? JSON.parse(aaa):[];
      if(mySubContext===null){
        if(Array.isArray(subContext)){
          const aaaa= subContext.find(item => item.sub_id===aa);
          console.log("suscripcion",aaaa);
          if(aaaa) setSub(aaaa);
         }else{
          try {
            const response = await generalConfig();
            if(response.subscriptions){
              const aaaa= response.subscriptions.find((item:any) => item.sub_id===aa);
              console.log("suscripcion",aaaa);
              if(aaaa) setSub(aaaa);
            }
          } catch (error) {
            
          }

         }
      }else{
        setSub(mySubContext);
      }
   }


 

 const handleConfig = async()=>{
  try {
    const response = await importConfig();
    if(!!response.mensaje){
       if(!!response.config){
        setEmail(response.config.email===null?'':response.config.email);
        setPassword(response.config.password_email===null?'':response.config.password_email);
        setIsWpVerified(response.config.phone_verified);
        setIsWpActive(response.config.phone_status);
        setEmailVerified(response.config.email_verified);
        setIsGmActive(response.config.email_status);


       
        console.log(response.config);
       }
    }
  } catch (error) {
    
  }

 }

 const handleWpStatus = ()=>{
  console.log(sub);
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
 setProcesando(true);

    try {
      const response = await saveConfig({phone_status:isWpActive,phone_verified:isWpVerified,email:email,password_email:password,email_verified:emailVerified,email_status:isGmActive});
      console.log(response);
      if(response.mensaje){
        setProcesando(false);
        setResponseMessage(response.mensaje);
        setModalVisible(true);
      }if(response.error){
        setProcesando(false);
        setResponseMessage(response.error);
        setModalVisible(true);
      }
    } catch (error) {
      setProcesando(false);
      setResponseMessage("Ha ocurrido un error");
      setModalVisible(true);
      
    }

    
  }


  const handleVerify = async () => {
    setVerificandoWp(true);
    // Lógica para verificar el teléfono aquí
    console.log("Verificar teléfono");
    try {
      const response = await verifySession();
      if(!!response.mensaje){
        setVerificandoWp(false);
        setIsWpVerified(true);
        setResponseMessage(response.mensaje);
        setModalVisible(true);
      }
      if(!!response.error){
        setVerificandoWp(false);
        setIsWpVerified(false);
        setResponseMessage(response.error);
        setModalVisible(true);
      }
      console.log(response);
    } catch (error:any) {
      setVerificandoWp(false);
      setIsWpVerified(false);
      setResponseMessage("error al verificar");
      setModalVisible(true);
    }
  };

const handleEmailVerify= async()=>{
  setVerificandoEmail(true);
  try {
    const response = await verifyEmail(email,password);
    console.log(response);
    if(!!response.mensaje){
      setVerificandoEmail(false);
      setEmailVerified(true);
      setResponseMessage(response.mensaje);
      setModalVisible(true);
    }
    if(!!response.error){
      setVerificandoEmail(false);
      setEmailVerified(false);
      setResponseMessage(response.error);
      setModalVisible(true);
    }
    console.log(response);
  } catch (error:any) {
    setVerificandoEmail(false);
    setEmailVerified(false);
    setResponseMessage("Error al verificar");
    setModalVisible(true);
  }
      
  
}


  const handleSendQR = async () => {
 try {
    setIsWpVerified(false);
    const response = await sendQr()
    if(response.mensaje){
      setResponseMessage(response.mensaje);
      setModalVisible(true);
    }
     console.log(response);
 } catch (error) {
  
 }
  };

  const openLink = () => {
    const url = 'https://docs.rocketbot.com/2020/01/15/como-habilitar-las-aplicaciones-poco-seguras-en-gmail/';
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
 
   <GradientLayout  navigationItems={navigationItems} hasDrawer={true}   size={(a,b,c,d)=>{setIsSmallScreen(a);setIsMediumScreen(b);setIsLargeScreen(c);setIsXLargeScreen(d)}}  >

<ScrollView  style={styles.main}  contentContainerStyle={{alignItems:'center'}}>
<View style={[styles.formContainer,
      isSmallScreen && { width:'95%' },
      isMediumScreen && { width:'95%' },
      isLargeScreen && { width:'30%' },
      isXLargeScreen && {width:'30%'},
]}>
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
                <Text style={styles.buttonText}>{verificandoWp?"Verificando...":"Verificar"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
    
            <View style={styles.statusContainer}>
              <Switch
                value={isWpActive}
                onValueChange={handleWpStatus}
                trackColor={{ false: sub.whatsapp ? "#fee2e2" : "#ccc", true: "#dcfce7" }}
                thumbColor={isWpActive ? "#34D399" : sub.whatsapp ? "#EF4444" : "#888"}
                disabled={!sub.whatsapp}
              />
                <Text style={[styles.statusText, { color: sub.whatsapp ? (isWpActive ? '#10B981' : '#EF4444') : '#888' }]}>
                {sub.whatsapp ? (isWpActive ? 'Activo' : 'Inactivo') : 'Disabled'}
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
                <Text style={styles.buttonText}>{verificandoEmail?"Verificando...":"Verificar"}</Text>
              </TouchableOpacity>
             
              
              </View>
          </View>
        

          <View style={styles.inputGroup}>
      
            <View style={styles.statusContainer}>
            <Switch
                value={isGmActive}
                onValueChange={handleEmailStatus}
                trackColor={{ false: sub.email ? "#fee2e2" : "#ccc", true: "#dcfce7" }}
                thumbColor={isGmActive ? "#34D399" : sub.email ? "#EF4444" : "#888"}
                disabled={!sub.email}
              />
              <Text style={[styles.statusText, { color: sub.email ? (isGmActive ? '#10B981' : '#EF4444') : '#888' }]}>
                {sub.email ? (isGmActive ? 'Activo' : 'Inactivo') : 'Disabled'}
              </Text>
            </View>
             {verifiedGmailError && !emailVerified && (<Text style={{color:'red',marginTop:10}}>Necesita tener la sesion verificada antes de activar el servicio</Text>)}
          </View>
          
     
          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>{procesando?"Procesando...":"Guardar"}</Text>
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
