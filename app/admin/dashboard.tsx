import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/admin/dashboard/userCard';
import {User} from '../../config/Interfaces';
import Options from '../../components/optionsModal';
import { router } from 'expo-router';
import { userIndex ,userDelete} from '../../services/api';
import Delete from '../../components/ConfirmModal';
import Deleted from '../../components/responseModal';
import ToastModal from '../../components/toastModal';
import GradientLayout from '../layout';
import { useAuth } from '../../services/authContext2';







export default function App() {

  
  const {user,auth,logout}=useAuth();



  const navigationItems = [
    { label: 'Inicio', action: () => console.log("hola"),status:0 },
    { label: 'Configuracion', action: () =>router.push('/admin/adminConfig'),status:1 },
    { label: 'Logout', action: async() => logout(),status:auth===true?1:0},
  ];

  const notificaiones = [
    {mensaje:"sistema de correos desactivado",fuente:"configuracion",seen:false},
    {mensaje:"Tu cuenta no esta suscrita, conoce las mejoras que te ofrece un plan",fuente:"suscripcion",seen:false},
  ];
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [users2, setUsers] = useState<User[]>([]);
 const [users3, setUsers3] = useState<User[]>([]);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 const [responseModalVisible, setResponseModalVisible] = useState(false);
 const [responseMessage, setResponseMessage] = useState<string|null>(null);
 const [hasError, setHasError] = useState(false);
 const [responseIndexMessage, setResponseIndexMessage] = useState<string|null>(null);
 const [toast,setToast]=useState(false);
 const [buscar,setBuscar]=useState<string>("");
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
    typeof item.payed === 'boolean' &&
    (item.id === undefined || typeof item.id === 'number') &&
    (item.role === undefined || typeof item.role === 'string') &&
    (item.password === undefined || typeof item.password === 'string')
    // add other property checks as needed
  );
};


const handleUsers = async()=>{

  try{
  const users2 = await userIndex();
  if(users2.error){ 
    setResponseIndexMessage(users2.error);
    setToast(true);
  }
  console.log(users2);
  if(Array.isArray(users2) && users2.every(isUser)){
    setUsers(users2);
    setUsers3(users2);
  }else {
    console.log('Data is not of type User[]');
  }
}catch(e:any){
  setResponseIndexMessage(e.message);
  setToast(true);
  console.error(e);

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
        if (!aa.error) {
          setReload(!reload);   
        }
        }catch(error:any){
          setResponseMessage(error.message);
          setHasError(true);
          setResponseModalVisible(true);
        }

       // setReload(!reload); 
      }
    };

    const handleCloseModal = () => {
      setResponseModalVisible(false);
   
    };
    function find(value:string) {
      setBuscar(value);
   
    const filtroLowerCase = value.toLowerCase();
  
    const filteredArray = users3.filter(obj => {
        const emailLowerCase = obj.email.toLowerCase();
        const nameLowerCase = obj.name.toLowerCase();
        const statusLowerCase = obj.status?.toString();

        return emailLowerCase.includes(filtroLowerCase)|| nameLowerCase.includes(filtroLowerCase) || statusLowerCase?.includes(filtroLowerCase);
    });

    // Actualiza el array separated2 con los resultados filtrados
   
    setUsers(filteredArray);
  
  }

  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} notificatioitems={notificaiones} hasNotifications={true}>
    

    
      
      <ScrollView style={styles.main}>
        
        <View style={styles.searchContainer}>
     
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={buscar}
            onChangeText={find}
          />
          <TouchableOpacity style={styles.addButton}  onPress={handleNew}>
            <Text style={styles.addButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
         
          { users2.length>0 &&  users2.map(user => (
            <TouchableOpacity key={user.id} onPress={() => handleOptions(user)}>
             <Card
             key={user.id}
             user={user}
        
           /></TouchableOpacity>
          ))}
           {users2.length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado usuarios . . .</Text></View>
          )}
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
          mode='delete'
         message={"¿Estas seguro de querer eliminar este usuario?"}
        visible={showDeleteConfirmation}
        onClose={()=> setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />


{/*responseModalVisible && (
        <Deleted
          message={responseMessage==null? '': responseMessage }
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )*/}
         {(
        <ToastModal
        message={responseMessage == null ? '' : responseMessage}
        time={3000}
        blockTime={1000}
        visible={responseModalVisible}
        onClose={handleCloseModal}  
        />
  )}
              {(
        <ToastModal
        message={responseIndexMessage == null ? '' : responseIndexMessage}
        blockTime={2000}
        time={3000}
        visible={toast}
        onClose={()=>setToast(false)}  
        />
  )

  }



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
