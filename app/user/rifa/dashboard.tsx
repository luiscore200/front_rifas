import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, TouchableWithoutFeedback, Dimensions,Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../../components/user/rifa/rifaCard';
import {rifa} from '../../../config/Interfaces';
import { router } from 'expo-router';
import {rifaDelete, indexRifa, indexComprador, sendTokens, getNotification, indexAssign} from '../../../services/api';
import Delete from '../../../components/ConfirmModal';
import Options from '../../../components/optionsModal';
import ToastModal from '../../../components/toastModal';
import MenuCard from '../../../components/user/rifa/optionsRifaModal';
import GradientLayout from '../../layout';
import { useAuth } from '../../../services/authContext2';
import CompartirModal from '../../../components/user/rifa/compartirRifaModal';
import Database from '../../../services/sqlite';
import DisconectedCard from '../../../components/disconectedCard';


export default function App() {

  
  const {auth,logout,user,subContext,setSubContext, mySubContext,online,setMySubContext,setOnline}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => console.log("hola"),status:0 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
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
 const [compartir,setCompartir]=useState(false);
 const [index,setIndex]=useState<number>();
 const [buscar,setBuscar]=useState<string>("");
 const [compradores,setCompradores]=useState<any[]>();
 const [touchedOut,setTouchedOut]=useState<boolean>(false);
 const [connectionError,setConnectionError]=useState<boolean>(false);

 const [reload, setReload] = useState(false);
 const [loading,setLoading]= useState(true);
 const array = [1];
 const db = new Database();
 

 function handleMenu(obj:any,rifa:any,indexx:number){
  const { height: windowHeight } = Dimensions.get('window');
  const { pageX, pageY } = obj.nativeEvent;

  selectedRifa(rifa);
  //console.log(obj);
  if(index!==indexx){
    setIndex(indexx);
  setCardPosition({x:pageX,y:pageY});
  
  setCard(true)
  }else{
    setCard(!card);
  }

 }

 const sub= async()=>{
     
 

    if(Array.isArray(subContext)){
      
      const aa=  subContext.find((obj:any) => obj.sub_id === user.id_subscription);
      setMySubContext(aa);
      console.log('mi subcripcion especifica',aa);
    }
    
  
 }

 
useEffect(() => {
  sub();
  handleRifas();
  handleData();
  
}, [reload]);
 

 const handleData = async()=>{
  try {
    const response = await indexComprador();
    const response2= await indexAssign();
   // console.log(response.compradores);
  //  console.log(response2);
    if(response.compradores && Array.isArray(response2)){ 
      
      if(Platform.OS !=='web'){

        const ee  = await db.find('compradores',{deleted:0,local:1});
        const  all = ee.concat(response.compradores);
        setCompradores(all);

        await db.deleteDataTable('asignaciones',{local:0});
         await db.deleteDataTable('compradores',{local:0});
         await db.insert('compradores',response.compradores);
        await db.insert('asignaciones',response2);
         console.log("estos son las asignaciones ingresadas",await db.index('asignaciones'));
         console.log("estos son los compradores ingresados",await db.index('compradores'));
      }else{
        setCompradores(response.compradores);
      }
    };
  } catch (error) {
    
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
  
 // setConnectionError(false);
  setLoading(true);
  try{
    
    const rifas2 = await indexRifa();
    console.log(rifas);
    if(rifas2.error){
      setResponseIndexMessage(rifas2.error);
      setToast(true);
      return;
    }
   
    if(Array.isArray(rifas2) && rifas2.every(isRifa)){
      
      if (Platform.OS !== 'web') {
        const rifas3 = rifas2.map(obj =>{
          return {
            ...obj,local:0,deleted:0
          };
        })

        const ee = await db.find('rifas',{deleted:0,local:1});
        const ii = ee.length>0? ee.map(obj=>{
          return {...obj,premios:JSON.parse(obj.premios),asignaciones:0};
        }):[];
        const all = rifas3.concat(ii);
  
        setRifas(all);
        setRifas2(all);
        setLoading(false);
        
        await db.deleteDataTable("rifas",{local:0,deleted:0});
        const objs = rifas2.map(obj => {
          return {
            ...obj,
            premios: JSON.stringify(obj.premios)
          };
        });

      console.log('rifas totals del telefono',objs);
      await db.insert('rifas',objs);
    }else{

      setRifas(rifas2);
      setRifas2(rifas2);
      setLoading(false);

    }

    
    }
  }catch(e:any){
    
   
   
   // if(online){
    //  setConnectionError(true);
   // }else{

      if (Platform.OS !== 'web') {
       // console.log('index asignaciones',await db.index('asignaciones'))
       // console.log('index compradores',await db.index('compradores'))
        const ee = await db.find('rifas',{deleted:0});
        const rifasRecuperadas =ee.length>0? ee.map((obj:any) => {
          return {
            ...obj,
            premios: JSON.parse(obj.premios),
            asignaciones:0
          };
        }):[];
  
      if(Array.isArray(rifasRecuperadas) && rifasRecuperadas.every(isRifa)){
        setRifas(rifasRecuperadas);
        setResponseIndexMessage('verifica tu conexion, datos guardados localmente');
  
        console.log('rifas totals del telefono',rifasRecuperadas);
      }else{
        console.log("no es rifa");
        console.log(rifasRecuperadas);
      }
    }else{
      setResponseIndexMessage('ha ocurrido un error, verifica tu conexion')
    }
  //  }
  setToast(true);
  setLoading(false);
 

    
    


  }

}



const handleNew = () =>{
  router.navigate({
    pathname: "/user/rifa/createRifa",
  
  });
}



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
          setCompartir(true);
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
          if(rifa.local && rifa.local===1 && Platform.OS!=='web'){
            await db.deleteDataTable('asignaciones',{id_raffle:rifa.id});
            await db.deleteDataTable('rifas',{id:rifa.id});
          }else{

            const aa = await rifaDelete(rifa.id);
            console.log(aa);
            // Lógica para eliminar el usuario
            setResponseMessage(aa.mensaje || aa.error);
            setHasError(!!aa.error);
            setResponseModalVisible(true);
            if (!aa.error) {
              setReload(!reload);   
            }
    
          }
     


        }catch(error:any){
          if(Platform.OS==='web'){
            setResponseMessage('ha ocurrido un error, verifica tu conexion');
            setHasError(true);
          }else{
            if(rifa.local && rifa.local===1){
              await db.deleteDataTable('asignaciones',{id_raffle:rifa.id});
              await db.deleteDataTable('rifas',{id:rifa.id});
            }else{
              await db.update('rifas',{local:1,deleted:1},[{id:rifa.id},""])


            }

            setResponseMessage('datos eliminados localmente, verifica tu conexion');
          }

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

  const sendToken = async(value:number[])=>{
      setCompartir(false);
      if(!!rifa && rifa.id){
        const response =await sendTokens(rifa.id,value);
        if(response.error){
          setResponseIndexMessage(response.error);
          setToast(true);
        }
      }
  }
   

  return (
 
   <GradientLayout  navigationItems={navigationItems}  hasDrawer={true}  hasNotifications={true} Touched={()=>{setCard(false);setCompartir(false)}} touchOut={touchedOut} touchedOut={()=>setTouchedOut(false)}>


      
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
         
          {!loading && rifas.length>0 && !connectionError && rifas.map((rifa,index) => (
            <View key={index}>
             <Card
             key={index}
             prueba={false}
             rifa={rifa}
             onTouch={(obj,rifa)=>{setTouchedOut(true);  handleMenu(obj,rifa,index)}}
            
           onToggle={()=>{setCard(false);setTouchedOut(true)}}
            
        
           /></View>
          ))}
          {!loading && connectionError && (
             <DisconectedCard
             onOffline={()=>{setOnline(false);setReload(!reload)}}
             onReload={()=>{handleRifas()}}
             offline={true}
             />
          )

          }
           
           {loading && !connectionError && array.map((rifa,index) => (
            <View key={index}>
             <Card
             prueba={true}
             key={index}
             rifa={null}
             onTouch={(obj,rifa)=>{setTouchedOut(true);  handleMenu(obj,rifa,index)}}
            
           onToggle={()=>{setCard(false);setTouchedOut(true)}}
            
        
           /></View>
          ))}
           
          {!loading && !connectionError && rifas.length===0 && (
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
        blockTime={500}
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

  {compartir &&(
    <CompartirModal 
      visible={compartir}
      compradores={compradores?compradores:[]}
      onShared={(numbers)=>{setCard(false);sendToken(numbers)}}
      onClose={()=>{setCompartir(false);setCard(false)}}
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
