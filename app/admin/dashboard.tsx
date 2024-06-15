import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/admin/dashboard/userCard';
import {User} from '../../config/Interfaces';
import Options from '../../components/optionsModal';
import { router } from 'expo-router';
import { userIndex ,userDelete} from '../../services/api';
import Delete from '../../components/deleteModal';
import Deleted from '../../components/responseModal';





export default function App() {


  const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [users2, setUsers] = useState<User[]>([]);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 const [responseModalVisible, setResponseModalVisible] = useState(false);
 const [responseMessage, setResponseMessage] = useState<string|null>(null);
 const [hasError, setHasError] = useState(false);

 const [reload, setReload] = useState(false); 

 const isUser = (item: any): item is User => {
  return (
    item &&
    typeof item.name === 'string' &&
    typeof item.domain === 'string' &&
    typeof item.phone === 'string' &&
    typeof item.email === 'string' &&
    typeof item.country === 'string' &&
    typeof item.status === 'string' &&
    (item.id === undefined || typeof item.id === 'number') &&
    (item.role === undefined || typeof item.role === 'string') &&
    (item.password === undefined || typeof item.password === 'string')
    // add other property checks as needed
  );
};


const handleUsers = async()=>{
  const users2 = await userIndex();
  console.log(users2);
  if(Array.isArray(users2) && users2.every(isUser)){
    setUsers(users2);
  }else {
    console.error('Data is not of type User[]');
  }
  
}

const handleNew = () =>{
  router.navigate({
    pathname: "/admin/userCreate",
  
  });
}

useEffect(() => {
  handleUsers();
}, [reload]);


    const handleOptions = (user:User) => {
      //alert(user);
      console.log(user);
      setSelectedUser(user);
      setModalVisible(true);

    };

    const handleEdit = (user: User) => {
      setSelectedUser(user);
      setModalVisible(false);
      console.log("edit: "+user.email);
      const user2 = JSON.stringify(user);
      console.log("user2: "+user2);
      router.navigate({
        pathname: "/admin/editUser",
        params:{user:user2},
      });
    };

    const handleDelete = (user: User) => {
      setModalVisible(false);
      setShowDeleteConfirmation(true);
      setSelectedUser(user);
      console.log("eliminando: "+user.email);
    };

    const handleCancelDelete = () => {
      setSelectedUser(null);
      setShowDeleteConfirmation(false);
    };

    const handleConfirmDelete = async () => {
      if (selectedUser?.id) { // Aquí está la modificación
        try{
        const aa = await userDelete(selectedUser.id);
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
         
          { !!users2.length &&  users2.map(user => (
            <TouchableOpacity key={user.id} onPress={() => handleOptions(user)}>
             <Card
             key={user.id}
             user={user}
        
           /></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
     {selectedUser && (
        <Options
          obj={selectedUser}
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
