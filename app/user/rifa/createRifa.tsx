import React, { useState,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Platform, ToastAndroid, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';




import Updated from '../../../components/responseModal';
import { userCreate as create } from '../../../services/api';
import CardPrizeComponent from '../../../components/user/rifa/crear/cardPrizeComponent';
import CardRifaComponent from '../../../components/user/rifa/crear/cardRifaComponent';



interface premio{
    id:number;
    descripcion:string;
    loteria:string;
    fecha:string;

}

interface rifa{
  titulo:string,
  pais:string,
  tipo:string,
  numeros:number
}


const userCreate: React.FC = () => {
  
  

  const [cardForm,setCardForm]= useState(false);
  const [premios,setPremios]=useState<premio[]>([{id:0,descripcion:"",loteria:"",fecha:""}]);
  const [rifa,setRifa]=useState<rifa[]>([{titulo:"",pais:"Colombia",numeros:100,tipo:"premio_unico"}]);

  const handleSave = () => {
    const request = {
      rifa:rifa,
      premios:premios
    }
    console.log(request);
  };

  function showToast(mensaje:string,duracion:string) {
    if(Platform.OS==="android"){
      if(duracion==="short"){
        ToastAndroid.show(mensaje, ToastAndroid.SHORT);
      }
      if(duracion==="long"){
        ToastAndroid.show(mensaje, ToastAndroid.LONG);
      }
    }
  }

  function handleUpdateRifa(obj:rifa){
  changeTipo(obj.tipo);
  rifa.splice(0,1,obj);
  console.log(rifa);
}

function handleDeletePrize(id:number){
 
    const premios2 = premios.filter(premio =>(premio.id!=id))
  
    setPremios(premios2);
    console.log(premios);
    }

function handleUpdatePrize(premio:premio){
    const index = premios.findIndex((premio2) => premio2.id === premio.id);

    if (index !== -1) {
      premios.splice(index, 1, premio);
      console.log(premios);
    } 
}
async function changeTipo(valor:any){
  if(valor!=rifa[0].tipo){
    
    await setPremios([{id:0,descripcion:"",loteria:"",fecha:""}]);  
  }
}



function handleAddPrize() {
  if (premios.length < 4) {
    if (rifa[0].tipo === "premio_unico" && premios.length >= 1) {
      showToast("Rifa de premio único solo acepta una entrada","short");
    } else {
      setPremios([...premios, { id: premios.length, descripcion: "", loteria: "", fecha: "" }]);
      if (rifa[0].tipo === "anticipados") {
        showToast("Recuerda rellenar los premios del último 'mayor' al primero en orden regresivo","long");
      }
    }
  } else {
    showToast("El máximo de entradas para cualquier tipo de rifas es 4","short");
  }
}


  
function CardForm1(){
    return (
        <View style={styles.formContainer}>
        {
          rifa.map(rifa=> (
            <CardRifaComponent
        key={1}
        rifa={rifa}
        onUpdate={(obj)=>handleUpdateRifa(obj)}
        />
          ))
        }
      </View>
    );
}

function CardForm2 (){
    return(
        <View style={styles.formContainer}>
        {
            premios.map((premio, index)=>(
                <CardPrizeComponent obj={premio} 
                  first={index === 0}
                 key={premio.id}
                 onUpdate={(premio)=> handleUpdatePrize(premio)} 
                 onDelete={(id)=>handleDeletePrize(id)}/>
            ))
        }
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
    );
}

  return (
    <LinearGradient colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}></View>
      <ScrollView style={styles.main}>

        <TouchableOpacity style={styles.formCard} onPress={()=>setCardForm(!cardForm)}>
            <View style={{marginRight:20}} >
            <Text style={{fontWeight: 'bold',fontSize: 20,marginBottom: 5}}>Raffle Details</Text>
            <Text style={{   fontSize: 16,color: '#666',}}>Fill out the details for your raffle.</Text>
            </View>
            <Ionicons name="chevron-forward-outline" style={{position:'absolute',right:25}} size={24} color="#CCCCC" />
        </TouchableOpacity>
        {!cardForm && (  <CardForm1/>) }
      

        <TouchableOpacity style={styles.formCard} onPress={()=>setCardForm(!cardForm)}>
            <View style={{marginRight:20}} >
            <Text style={{fontWeight: 'bold',fontSize: 20,marginBottom: 5}}>Prizes</Text>
            <Text style={{   fontSize: 16,color: '#666',}}> Add the prizes for your raffle.</Text>
        
            </View>
            <Ionicons name="chevron-forward-outline" size={24} style={{position:'absolute',right:25}} color="#CCCCC" />
        </TouchableOpacity>

        {cardForm && (  <CardForm2/>) }

        <View style={styles.inputGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={()=>{handleSave()}}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
     
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
