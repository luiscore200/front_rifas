import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { rifa } from '../../../config/Interfaces';

import { rifaCreate } from '../../../services/api';
import CardPrizeComponent from '../../../components/user/rifa/crear/cardPrizeComponent';
import CardRifaComponent from '../../../components/user/rifa/crear/cardRifaComponent';
import { createPremioValidationRules, createRifaValidationRules, validateForm } from '../../../config/Validators';
import { router } from 'expo-router';

import { useAuth } from '../../../services/authContext2';
import ToastModal from '../../../components/toastModal';
import { premio } from '../../../config/Interfaces';
import GradientLayout from '../../layout';
import { getStorageItemAsync } from '../../../services/storage';
import { CheckMarkIcon, InfoIcon, NextIcon, QuestionMarkIcon, UpIcon } from '../../../assets/icons/userIcons';
import Database from '../../../services/sqlite';






const userCreate: React.FC = () => {

  const {auth,user,logout,mySubContext}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push('/user/rifa/dashboard'),status:1 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  const [cardForm, setCardForm] = useState(false); 
  const [cardForm2, setCardForm2] = useState(false);
 
  const [premios, setPremios] = useState<premio[]>([{ id: 1, descripcion: "", loteria: "",ganador:"", fecha: "" }]);
  const [rifa, setRifa] = useState<rifa>({ titulo: "", pais: user?.country||"Colombia",precio:0, numeros: '100', tipo: "oportunidades" });
 
  const [errorRifa, setErrorRifa] = useState({});
  const [touchedFieldRifa, setTouchedFieldRifa] = useState({ titulo: false, numeros: false, tipo: false, precio:false });
  const [touchedFieldPremios, setTouchedFieldPremios] = useState([{ descripcion: false, loteria: false, fecha: false }]);
  const [errorPremios, setErrorPremios] = useState([{}]);
  const [saved,setSaved]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasError,setHasError]=useState(true);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [config,setConfig]=useState<any>();
  const [image1, setImage1] = useState<string>("");
  const [image1Changed, setImage1Changed] = useState<boolean>(false);
  const [procesando, setProcesando]=useState<boolean>(false);
  const db = new Database();
  
  useEffect(()=>{
     
     setRifa({...rifa,pais:user?.country});
  },[user]);


  useEffect(()=>{handleConfig()},[]);

  const handleConfig = async ()=>{
    const conf = await getStorageItemAsync("general_config");
    console.log(conf);
    setConfig(conf?JSON.parse(conf):null);
  
  }


  // Reset premios, touched fields y error fields cuando cambia el tipo de rifa
  useEffect(() => {
    setPremios([{ id: 1, descripcion: "", loteria: "", ganador:"",fecha: "" }]);
    setTouchedFieldPremios([{ descripcion: false, loteria: false, fecha: false }]);
    setErrorPremios([{}]);
  }, [rifa.tipo]);

  useEffect(() => {
   setRifa(rifa);
   setPremios(premios);
   setTouchedFieldPremios(touchedFieldPremios);
   setTouchedFieldRifa(touchedFieldRifa);
   setErrorPremios(errorPremios);
   setErrorRifa(errorRifa);
   setSaved(saved);
 //  console.log(rifa);
 //  console.log(touchedFieldRifa);
 //  console.log(errorRifa);
 //  console.log(premios);
 //  console.log(touchedFieldPremios);
 //  console.log(errorPremios);
  

  }, [rifa,premios,saved,touchedFieldPremios,touchedFieldRifa, errorPremios, errorRifa]);
  

  const handleSave = async() => {
    setProcesando(true);

    const updatedTouchedRifa = {titulo:true,precio:true,numeros:true,tipo:true};
    setTouchedFieldRifa(updatedTouchedRifa);
    const formErrors = validateForm(rifa, updatedTouchedRifa, createRifaValidationRules);

    const touchedPremioFields = premios.map(() => ({
      descripcion: true,
      loteria: true,
      fecha: true
    }));
    setTouchedFieldPremios(touchedPremioFields);
    const premioErrors = premios.map((premio, index) => validateForm(premio, touchedPremioFields[index], createPremioValidationRules));
    setErrorRifa(formErrors);
    setErrorPremios(premioErrors);

    if (Object.keys(formErrors).length === 0 && premioErrors.every(error => Object.keys(error).length === 0)) {

    //  const request = {rifa: rifa,premios: premios};

    const request = new FormData();
    request.append("titulo",rifa.titulo);
    request.append("pais",rifa.pais);
    request.append("precio",rifa.precio.toString());
    request.append("tipo",rifa.tipo);
    request.append("numeros",rifa.numeros);
    request.append("premios",JSON.stringify(premios));
    if (image1Changed ) {const body = image1!==""? await imageBody(image1):"";request.append('imagen',body);}

      try {
        const response:any = await rifaCreate(request);
        console.log(response);
        if(response.mensaje){
          setProcesando(false);
          setResponseMessage(response.mensaje);
          setHasError(false);
           setModalVisible(true);
        }
        if(response.error){
          setProcesando(false);
          setResponseMessage(response.error);
          setHasError(true);
           setModalVisible(true);
        }
      } catch (error:any) {


      if(Platform.OS==='web'){
      
        setResponseMessage('ha ocurrido un error, verifica tu conexion');
        setHasError(true);
   
      }else{

        if(rifa.numeros>mySubContext.max_num){
          setResponseMessage('tu suscripcion actual no maneja esta cantidad de numeros');
          setProcesando(false);
          setModalVisible(true);
          return;

        }

        const aa = await db.index('rifas');
        if(aa.length>=mySubContext.max_raffle){
          setResponseMessage('ya has alcanzado el maximo de rifas soportado por tu plan');
          setProcesando(false);
          setModalVisible(true);
          return;

        }
        
        await db.insert('rifas',[{id:-Date.now(),titulo:rifa.titulo,pais:rifa.pais,precio:rifa.precio,tipo:rifa.tipo,numeros:rifa.numeros,imagen:image1,local:1,premios:JSON.stringify(premios)}]);
        setHasError(false);
        setResponseMessage('datos guardados localmente, verifica tu conexion');

      }
        setProcesando(false);
        setModalVisible(true);
      

      } 
      //  console.log(request);
     
   
    } else{
      setResponseMessage('formulario invalido');
      setProcesando(false);
      setModalVisible(true);
    }
  };

  const imageBody= async(image:any)=>{
    const filename = image.split('/').pop();
    const match =  filename? /\.(\w+)$/.exec(filename):undefined;
    const type = match ? `image/${match[1]}` : `image`;
    return {uri:image,name:filename,type};
   }

    
  const handleCloseModal = () => {
    setModalVisible(false);
    if (!hasError) {
   //   setTimeout(() => {
        router.replace('user/rifa/dashboard');
     // }, 1000); // Espera de 5 segundos (5000 milisegundos)
    
    }
  }


  const handleUpdateRifa = (field:string,value:any) => {
    if(field==="image1"){
        setImage1(value);
        setImage1Changed(true);
    }else{
          
      const updatedRifa= {...rifa,[field]:value};
      setRifa(updatedRifa);
      const updatedTouched= {...touchedFieldRifa,[field]:true};
      setTouchedFieldRifa(updatedTouched);
      setErrorRifa(validateForm(updatedRifa, updatedTouched, createRifaValidationRules));
    }
      

  };

  



  const handleDeletePrize = (index: number) => {
    const newPremios = premios.filter((_, i) => i !== index);
    const newTouchedFields = touchedFieldPremios.filter((_, i) => i !== index);
    const newErrorFields = errorPremios.filter((_, i) => i !== index);

    setPremios(newPremios);
    setTouchedFieldPremios(newTouchedFields);
    setErrorPremios(newErrorFields);
  };
  const handleUpdatePrize = (index:number, field:string, value:any) => {

  //  console.log("aaa");
    // Crear una copia del array de premios
    const newPremios = [...premios];
  
    // Actualizar solo el campo específico del premio en el índice dado
    newPremios[index] = {
      ...newPremios[index],
      [field]: value
    };
    setPremios(newPremios);
  
    // Crear una copia del array de campos tocados
    const newTouchedFields = [...touchedFieldPremios];
  
    // Marcar el campo específico como tocado
    newTouchedFields[index] = {
      ...newTouchedFields[index],
      [field]: true
    };
    setTouchedFieldPremios(newTouchedFields);
  
    // Crear una copia del array de errores
    const newErrorFields = [...errorPremios];
  

    // Validar el premio actualizado
    newErrorFields[index] = validateForm(newPremios[index], newTouchedFields[index], createPremioValidationRules);
    setErrorPremios(newErrorFields);
  };
  



  const handleAddPrize = () => {
    if (premios.length < 4) {
      if (rifa.tipo === "premio_unico" && premios.length >= 1) {
        
        setResponseMessage("El numero maximo de premios es uno");
        setModalVisible(true);
      } else {
        setPremios([...premios, { id: premios.length, descripcion: "", loteria: "",ganador:"", fecha: "" }]);
        setTouchedFieldPremios([...touchedFieldPremios, { descripcion: false, loteria: false, fecha: false }]);
        setErrorPremios([...errorPremios, {}]);
   
      }
    } else {
      setResponseMessage("El numero maximo de premios es cuatro");
      setModalVisible(true);
    }
  };

 
 

  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} >
      <ScrollView style={styles.main}>
     {!cardForm && (
         <TouchableOpacity style={styles.formCard} onPress={() => setCardForm(!cardForm)}>
         <View style={{ marginRight: 20 }} >
         <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Rifa</Text>
         <Text style={{ fontSize: 16, color: '#666', }}>Añade las propiedades de tu evento.</Text>
         </View>
         <View style={{position: 'absolute', right: 25}}>
   <NextIcon style={{color:"#CCCCC", width:28,height:28 }} />
       
         </View>
       </TouchableOpacity>
     )}


        {cardForm && ( 
      <TouchableOpacity onPress={()=>undefined} activeOpacity={1}>
            <View style={styles.formContainer}>
          <TouchableOpacity onPress={undefined} activeOpacity={1}>
           <CardRifaComponent
           touched={touchedFieldRifa}
           error={errorRifa}
            rifa={rifa}
            imagen={image1}
            onUpdate={(field:any,value:any)=>handleUpdateRifa(field,value)}
            onToggle={()=>setCardForm(!cardForm)}
          />
          </TouchableOpacity>
        </View> 
       </TouchableOpacity>
        )}

     {!cardForm2 && (
         <TouchableOpacity style={styles.formCard} onPress={() => setCardForm2(!cardForm2)}>
          <View style={{ marginRight: 20 }} >
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Premios</Text>
          <Text style={{ fontSize: 16, color: '#666', }}> Añade premios para tu evento.</Text>
          </View>
          <View style={{position: 'absolute', right: 25}}>
    <NextIcon style={{color:"#CCCCC", width:28,height:28 }} />
        
          </View>
        </TouchableOpacity>
     )}

        {cardForm2 && (
          <TouchableOpacity onPress={()=>undefined} activeOpacity={1}>
              <View style={styles.formContainer}>
                <TouchableOpacity onPress={()=>setCardForm2(!cardForm2)} activeOpacity={1}>
              <Text style={{ fontWeight: 'bold', fontSize: 20,color:'#374151', marginBottom: 10 }}>Rifa</Text>
              <Text style={{ fontSize: 16, color: '#666',paddingBottom:15 }}>En esta parte podras configurar tu formato de juego.</Text>
              </TouchableOpacity>

            
            {premios.map((premio, index) => (
              <CardPrizeComponent
                obj={premio}
               
                touched={touchedFieldPremios[index]}
                error={errorPremios[index]}
                first={false}
                key={index}
                onUpdate={(field,value) => handleUpdatePrize(index,field,value)}
                onDelete={() => handleDeletePrize(index)}
              />
            ))}
            <TouchableOpacity style={{
              backgroundColor: '#f1f1f1f1',
              padding: 15,
              borderRadius: 5,
            }}
              onPress={handleAddPrize}
            >
              <Text style={{
                textAlign: 'center',
                color: '#CCCC1',
                fontWeight: 'bold',
              }}>Agregar Premio</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        )}

        <View style={styles.inputGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={() => { handleSave() }}>
            <Text style={styles.buttonText}>{procesando?"Procesando...":"Guardar"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
   
          {(
        <ToastModal
        message={responseMessage == null ? '' : responseMessage}
        time={hasError? 3000:1500 }
        blockTime={1000}
        visible={modalVisible}
        onClose={handleCloseModal}  
        />
  )}
    </GradientLayout>
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
    borderColor: '#ddd',
    borderRadius: 12,
    borderWidth:3,
  
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
   elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
  
  formCard: {
    borderWidth: 3,
    
  
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 20,
    borderRadius:10,
    flexDirection:'row',
    alignItems:'center',
    borderColor: '#ddd',
   
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,

    
  }
});

export default userCreate;
