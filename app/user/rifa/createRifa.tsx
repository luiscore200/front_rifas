import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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






const userCreate: React.FC = () => {

  const {auth,user,logout}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => console.log("hola"),status:0 },
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  
  const [cardForm, setCardForm] = useState(false);
  const [premios, setPremios] = useState<premio[]>([{ id: 0, descripcion: "", loteria: "",ganador:"", fecha: "" }]);
  const [rifa, setRifa] = useState<rifa>({ titulo: "", pais: user?.country||"Colombia",precio:0, numeros: '100', tipo: "premio_unico" });
 
  const [errorRifa, setErrorRifa] = useState({});
  const [touchedFieldRifa, setTouchedFieldRifa] = useState({ titulo: false, numeros: false, tipo: false, precio:false });
  const [touchedFieldPremios, setTouchedFieldPremios] = useState([{ descripcion: false, loteria: false, fecha: false }]);
  const [errorPremios, setErrorPremios] = useState([{}]);
  const [saved,setSaved]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasError,setHasError]=useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [config,setConfig]=useState<any>();
  
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
    setPremios([{ id: 0, descripcion: "", loteria: "", ganador:"",fecha: "" }]);
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

    if (!user) {
      setHasError(true);
      setResponseMessage("No existe ningún usuario autenticado para solicitar la actualización");
      setModalVisible(true);
      return;
    }
  
    // Verificar si el usuario no ha pagado y si el número de entradas es mayor al máximo permitido
    if (user.payed === 0 && config && Number(rifa.numeros) > Number(config.raffle_number)) {
      setHasError(true);
      setResponseMessage(`El número máximo de entradas para no suscritos es ${config.raffle_number}`);
      setModalVisible(true);
      return;
    }

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

      const request = {
      
        rifa: rifa,
        premios: premios
      };

   

      try {
        const response:any = await rifaCreate(request);
        console.log(response);
        setResponseMessage(response.mensaje || response.error);
       setHasError(!!response.error);
        setModalVisible(true);
      } catch (error:any) {
        setResponseMessage(error.message);
        setHasError(true);
        setModalVisible(true);
      } 
      //  console.log(request);
     
   
    } else {
   
    
     
      console.log("formulario invalido");
     // console.log(formErrors);
     // console.log(premioErrors);
    }
  };

  

    
  const handleCloseModal = () => {
    setModalVisible(false);
    if (!hasError) {
   //   setTimeout(() => {
        router.replace('user/rifa/dashboard');
     // }, 1000); // Espera de 5 segundos (5000 milisegundos)
    
    }
  }


  const handleUpdateRifa = (field:string,value:any) => {
    const updatedRifa= {...rifa,[field]:value};
    setRifa(updatedRifa);
    const updatedTouched= {...touchedFieldRifa,[field]:true};
    setTouchedFieldRifa(updatedTouched);
    setErrorRifa(validateForm(updatedRifa, updatedTouched, createRifaValidationRules));
  

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
        
        setResponseMessage("Rifa de premio único solo acepta una entrada");
        setModalVisible(true);
      } else {
        setPremios([...premios, { id: premios.length, descripcion: "", loteria: "",ganador:"", fecha: "" }]);
        setTouchedFieldPremios([...touchedFieldPremios, { descripcion: false, loteria: false, fecha: false }]);
        setErrorPremios([...errorPremios, {}]);
        if (rifa.tipo === "anticipados") {
          setResponseMessage("Recuerda rellenar los premios del último 'mayor' al primero en orden regresivo");
          setModalVisible(true);
        }
      }
    } else {
      setResponseMessage("El máximo de entradas para cualquier tipo de rifas es 4");
      setModalVisible(true);
    }
  };

 
 

  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} >
      <ScrollView style={styles.main}>
        <TouchableOpacity style={styles.formCard} onPress={() => setCardForm(!cardForm)}>
          <View style={{ marginRight: 20 }} >
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Rifa</Text>
          <Text style={{ fontSize: 16, color: '#666', }}>Añade las propiedades de tu evento.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" style={{ position: 'absolute', right: 25 }} size={24} color="#CCCCC" />
        </TouchableOpacity>
        {!cardForm && (  <View style={styles.formContainer}>
           <CardRifaComponent
           touched={touchedFieldRifa}
           error={errorRifa}
            rifa={rifa}
            onUpdate={(field,value)=>handleUpdateRifa(field,value)}
          />
        </View> 
        )}

        <TouchableOpacity style={styles.formCard} onPress={() => setCardForm(!cardForm)}>
          <View style={{ marginRight: 20 }} >
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Premios</Text>
          <Text style={{ fontSize: 16, color: '#666', }}> Añade premios para tu evento.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} style={{ position: 'absolute', right: 25 }} color="#CCCCC" />
        </TouchableOpacity>

        {cardForm && (
            <View style={styles.formContainer}>
            {premios.map((premio, index) => (
              <CardPrizeComponent
                obj={premio}
               
                touched={touchedFieldPremios[index]}
                error={errorPremios[index]}
                first={index === 0}
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
        )}

        <View style={styles.inputGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={() => { handleSave() }}>
            <Text style={styles.buttonText}>Guardar</Text>
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
