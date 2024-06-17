import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { rifa } from '../../../config/Interfaces';

import { rifaCreate } from '../../../services/api';
import CardPrizeComponent from '../../../components/user/rifa/crear/cardPrizeComponent';
import CardRifaComponent from '../../../components/user/rifa/crear/cardRifaComponent';
import { createPremioValidationRules, createRifaValidationRules, validateForm } from '../../../config/Validators';
import { router } from 'expo-router';

import { useAuth } from '../../../services/authContext2';
import ToastModal from '../../../components/toastModal';





interface premio {
  id: number;
  descripcion: string;
  loteria: string;
  fecha: string;
}


const userCreate: React.FC = () => {

  const {user}=useAuth();
 
  const [cardForm, setCardForm] = useState(false);
  const [premios, setPremios] = useState<premio[]>([{ id: 0, descripcion: "", loteria: "", fecha: "" }]);
  const [rifa, setRifa] = useState<rifa>({ titulo: "", pais: user?.country||"Colombia",precio:0, numeros: '100', tipo: "premio_unico" });
 
  const [errorRifa, setErrorRifa] = useState({});
  const [touchedFieldRifa, setTouchedFieldRifa] = useState({ titulo: false, numeros: false, tipo: false, precio:false });
  const [touchedFieldPremios, setTouchedFieldPremios] = useState([{ descripcion: false, loteria: false, fecha: false }]);
  const [errorPremios, setErrorPremios] = useState([{}]);
  const [saved,setSaved]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasError,setHasError]=useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  
  useEffect(()=>{
     
     setRifa({...rifa,pais:user?.country});
  },[user]);

 


  // Reset premios, touched fields y error fields cuando cambia el tipo de rifa
  useEffect(() => {
    setPremios([{ id: 0, descripcion: "", loteria: "", fecha: "" }]);
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

  
  function showToast(mensaje: string, duracion: string) {
    if (Platform.OS === "android") {
      if (duracion === "short") {
        ToastAndroid.show(mensaje, ToastAndroid.SHORT);
      }
      if (duracion === "long") {
        ToastAndroid.show(mensaje, ToastAndroid.LONG);
      }
    }
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
        showToast("Rifa de premio único solo acepta una entrada", "short");
      } else {
        setPremios([...premios, { id: premios.length, descripcion: "", loteria: "", fecha: "" }]);
        setTouchedFieldPremios([...touchedFieldPremios, { descripcion: false, loteria: false, fecha: false }]);
        setErrorPremios([...errorPremios, {}]);
        if (rifa.tipo === "anticipados") {
          showToast("Recuerda rellenar los premios del último 'mayor' al primero en orden regresivo", "long");
        }
      }
    } else {
      showToast("El máximo de entradas para cualquier tipo de rifas es 4", "short");
    }
  };

 
 

  return (
    <LinearGradient colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}></View>
      <ScrollView style={styles.main}>
        <TouchableOpacity style={styles.formCard} onPress={() => setCardForm(!cardForm)}>
          <View style={{ marginRight: 20 }} >
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Raffle Details</Text>
            <Text style={{ fontSize: 16, color: '#666', }}>Fill out the details for your raffle.</Text>
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
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Prizes</Text>
            <Text style={{ fontSize: 16, color: '#666', }}> Add the prizes for your raffle.</Text>
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
            <Text style={styles.buttonText}>Save</Text>
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
    </LinearGradient>
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

export default userCreate;
