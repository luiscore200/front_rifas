import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../components/user/rifa/rifaCard';
import {rifa} from '../../../config/Interfaces';
import { router } from 'expo-router';
import {rifaDelete, indexRifa} from '../../../services/api';
import Delete from '../../../components/ConfirmModal';
import Options from '../../../components/optionsModal';
import ToastModal from '../../../components/toastModal';
import MenuCard from '../../../components/user/rifa/optionsRifaModal';
import GradientLayout from '../../layout';
import { useAuth } from '../../../services/authContext2';

export default function App() {

  
  const {auth,logout}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => console.log("hola"),status:0 },
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];


  const [rifa, selectedRifa] = useState<rifa | null>(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [rifas, setRifas] = useState<rifa[]>([]);
 const [rifas2, setRifas2] = useState<rifa[]>([]);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 const [responseModalVisible, setResponseModalVisible] = useState(false);
 const [responseMessage, setResponseMessage] = useState<string|null>(null);
 const [responseIndexMessage, setResponseIndexMessage] = useState<string|null>(null);
 const [cardPosition, setCardPosition] = useState({x:0,y:0});
 const [card, setCard] = useState(false);
 const [hasError, setHasError] = useState(false);
 const [toast,setToast]=useState(false);
 const [index,setIndex]=useState<number>();
 const [buscar,setBuscar]=useState<string>("");

 const [reload, setReload] = useState(false);
 

 function handleMenu(obj:any,rifa:any,indexx:number){
  const { height: windowHeight } = Dimensions.get('window');
  const { pageX, pageY } = obj.nativeEvent;


  //console.log(obj);
  if(index!==indexx){
    setIndex(indexx);
  setCardPosition({x:pageX,y:pageY});
  selectedRifa(rifa);
  setCard(true)
  }else{
    setCard(!card);
  }

 }

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
        typeof premio.ganador === 'string' &&
        typeof premio.fecha === 'string'
      ))
    ))
  );
};


const handleRifas = async()=>{
  try{
    const rifas2 = await indexRifa();
    console.log(rifas);
    if(!!rifas2.error){
      setResponseIndexMessage(rifas2.error);
      setToast(true);
    }
   
    if(Array.isArray(rifas2) && rifas2.every(isRifa)){
      setRifas(rifas2);
      setRifas2(rifas2);
    }else {
      console.log(rifas2);
      console.log('Data is not of type Rifa[]');
    }
  }catch(e:any){
    setResponseIndexMessage(e.message);
  
    setToast(true);
  }

}



const handleNew = () =>{
  router.navigate({
    pathname: "/user/rifa/createRifa",
  
  });
}

useEffect(() => {
  handleRifas();
}, [reload]);


    const handleOptions = (rifa:rifa,opcion:string) => {
      //alert(user);
      console.log(rifa);
      selectedRifa(rifa);
   //   setModalVisible(true);
      console.log(opcion);

      if(opcion==="asignar"){
        handleTouch(rifa);
        
      }
      if(opcion==="compartir"){
       
      }
      if(opcion==="editar"){
          handleEdit(rifa);

      }
      if(opcion==="ganador"){

          handleWinner(rifa);
      }
      if(opcion==="confirmar"){
        handleConfirm(rifa);
      }
      if(opcion==="eliminar"){
        handleDelete(rifa);
      }

    };

    const handleEdit = (rifa: rifa) => {
      selectedRifa(rifa);
      setModalVisible(false);
      console.log("edit: "+rifa.id);
      const rifa2 = JSON.stringify(rifa);
      console.log("rifa2: "+ rifa2);
  router.navigate({pathname: "/user/rifa/updateRifa",params:{rifa1:rifa2},});
    };

    const handleWinner = (rifa: rifa) => {
      selectedRifa(rifa);
      setModalVisible(false);
      console.log("edit: "+rifa.id);
      const rifa2 = JSON.stringify(rifa);
      console.log("rifa2: "+ rifa2);
  router.navigate({pathname: "/user/rifa/numbers/assignWinner",params:{id:rifa.id,rifa:rifa2},});
    };

    const handleConfirm = (rifa: rifa) => {
      selectedRifa(rifa);
      setModalVisible(false);
      console.log("confirm: "+rifa.id);
      const rifa2 = JSON.stringify(rifa);
      console.log("rifa2: "+ rifa2);
  router.navigate({pathname: "/user/rifa/numbers/dashboard",params:{id:rifa.id,rifa:rifa2},});
    };

    

    const handleDelete = (rifa: rifa) => {
      console.log(rifa);
      selectedRifa(rifa);
      setModalVisible(false);
      setShowDeleteConfirmation(true);
     
      console.log("eliminando: "+rifa.id);
    };

    const handleCancelDelete = () => {
   
      setShowDeleteConfirmation(false);
    };

    const handleConfirmDelete = async () => {
      setCard(false);
      if (rifa?.id) { // Aquí está la modificación
        try{
        const aa = await rifaDelete(rifa.id);
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

    const handleTouch = (rifa:rifa)=> {
      //console.log("dsadad",rifa); 
      router.navigate({
        pathname:'/user/rifa/numbers/assignNumber',
       
        params:{id:rifa.id,rifa:JSON.stringify(rifa)},
      })

    }

    function find(value:string) {
      setBuscar(value);
   
    const filtroLowerCase = value.toLowerCase();
  
    const filteredArray = rifas2.filter(obj => {
        const emailLowerCase = obj.titulo.toLowerCase();
        const nameLowerCase = obj.pais.toLowerCase();
        const numberString = obj.tipo.toString();

        return emailLowerCase.includes(filtroLowerCase)|| nameLowerCase.includes(filtroLowerCase) || numberString.includes(filtroLowerCase);
    });

    // Actualiza el array separated2 con los resultados filtrados
   
    setRifas(filteredArray);
  
  }
   

  return (
 
   <GradientLayout  navigationItems={navigationItems} hasDrawer={true} Touched={()=>setCard(false)}>


      
      <ScrollView style={styles.main} onScrollBeginDrag={()=>setCard(false)}>
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
         
          { rifas.length>0 &&  rifas.map((rifa,index) => (
            <View key={index}>
             <Card
             key={index}
             rifa={rifa}
             onTouch={(obj,rifa)=>handleMenu(obj,rifa,index)}
            
             onToggle={()=>setCard(false)}
        
           /></View>
          ))}
          {rifas.length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado rifas . . .</Text></View>
          )}
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
        mode="delete"
        message={"¿Estas seguro de querer eliminar esta rifa?"}   
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
        blockTime={500}
        time={2000}
        visible={responseModalVisible}
        onClose={handleCloseModal}  
        />
  )}


        {(
        <ToastModal
        message={responseIndexMessage == null ? '' : responseIndexMessage}
        blockTime={2000}
        time={2000}
        visible={toast}
        onClose={()=>setToast(false)}  
        />
  )}

  {!!rifa &&(
    
    <MenuCard
    isvisible={card}
    event={cardPosition}
    rifa={rifa}
    onOptions={(rifa,opcion)=>handleOptions(rifa,opcion)}
    onClose={()=>{setCard(false)}}
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
