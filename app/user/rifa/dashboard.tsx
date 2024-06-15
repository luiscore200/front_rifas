import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../components/user/rifa/rifaCard';
import {rifa,premio} from '../../../config/Interfaces';


import { router } from 'expo-router';
import {rifaDelete, indexRifa} from '../../../services/api';

import Deleted from '../../../components/responseModal';

import Delete from '../../../components/deleteModal';
import Options from '../../../components/optionsModal';






export default function App() {


  const [rifa, selectedRifa] = useState<rifa | null>(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [rifas, setRifas] = useState<rifa[]>([]);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 const [responseModalVisible, setResponseModalVisible] = useState(false);
 const [responseMessage, setResponseMessage] = useState<string|null>(null);
 const [hasError, setHasError] = useState(false);

 const [reload, setReload] = useState(false); 

 const isRifa = (item: any): item is rifa => {
  return (
    item &&
    typeof item.id === 'number' &&
    typeof item.titulo === 'string' &&
    typeof item.pais === 'string' &&
    (item.imagen === undefined || typeof item.imagen === 'string') &&
    typeof item.precio === 'number' &&
    typeof item.tipo === 'string' &&
    typeof item.numeros === 'string' &&
    (item.premios === undefined || (
      Array.isArray(item.premios) &&
      item.premios.every((premio: any) => (
        typeof premio.id === 'number' &&
        typeof premio.descripcion === 'string' &&
        typeof premio.loteria === 'string' &&
        typeof premio.fecha === 'string'
      ))
    ))
  );
};


const handleUsers = async()=>{
  const rifas2 = await indexRifa();
  console.log(rifas2);
  if(Array.isArray(rifas2) && rifas2.every(isRifa)){
    setRifas(rifas2);
  }else {
 
    console.error('Data is not of type Rifa[]');
  }
  
}

const handleNew = () =>{
  router.navigate({
    pathname: "/user/rifa/createRifa",
  
  });
}

useEffect(() => {
  handleUsers();
}, [reload]);


    const handleOptions = (rifa:rifa) => {
      //alert(user);
      console.log(rifa);
      selectedRifa(rifa);
      setModalVisible(true);

    };

    const handleEdit = (rifa: rifa) => {
      selectedRifa(rifa);
      setModalVisible(false);
      console.log("edit: "+rifa.id);
      const rifa2 = JSON.stringify(rifa);
      console.log("rifa2: "+ rifa2);
  router.navigate({pathname: "/user/rifa/updateRifa",params:{rifa1:rifa2},});
    };

    const handleDelete = (rifa: rifa) => {
      console.log(rifa);
      selectedRifa(rifa);
      setModalVisible(false);
      setShowDeleteConfirmation(true);
     
      console.log("eliminando: "+rifa.id);
    };

    const handleCancelDelete = () => {
      selectedRifa(null);
      setShowDeleteConfirmation(false);
    };

    const handleConfirmDelete = async () => {
      if (rifa?.id) { // Aquí está la modificación
        try{
        const aa = await rifaDelete(rifa.id);
        console.log(aa);
        // Lógica para eliminar el usuario
        setResponseMessage(aa.mensaje || aa.error);
        setHasError(!!aa.error);
        setResponseModalVisible(true);
        }catch(error:any){
          setResponseMessage('An error occurred');
          setHasError(true);
          setResponseModalVisible(true);
        }

       // setReload(!reload); 
      }
    };

    const handleCloseModal = () => {
      setResponseModalVisible(false);
      if (!hasError) {
        setReload(!reload);   
      }
    };

  return (
    <LinearGradient  colors={['#6366F1', '#BA5CDE']} // Gradiente de lado a lado con el color más oscuro al inicio
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}>
      <View style={styles.header}>
       
      </View>


      
      <ScrollView style={styles.main}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
          />
          <TouchableOpacity style={styles.addButton}  onPress={handleNew}>
            <Text style={styles.addButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
         
          { !!rifas.length &&  rifas.map((rifa,index) => (
            <TouchableOpacity key={index} onPress={() => console.log("aaa")}>
             <Card
             key={index}
             rifa={rifa}
             onOptions={(rifa)=>handleOptions(rifa)}
        
           /></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {rifa && (
        <Options
          obj={rifa}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
  
           <Delete
        visible={showDeleteConfirmation}
        onClose={()=> setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

{responseModalVisible && (
        <Deleted
          message={responseMessage==null? '': responseMessage }
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}


    </LinearGradient>
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
  userMenu: {
    marginLeft: 'auto',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  main: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardContainer: {
    marginBottom: 16,
  },
});
