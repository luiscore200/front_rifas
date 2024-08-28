import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { indexSeparated,deleteSeparated,confirmSeparated } from "../../../../services/api";
import RifaGrid from "../../../../components/user/rifa/rifaGrid";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput,ScrollView, Platform } from 'react-native';
import { rifa } from "../../../../config/Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import ToastModal from "../../../../components/toastModal";
import SeparatedCard from "../../../../components/user/rifa/separated/separatedCard";
import Delete from "../../../../components/ConfirmModal";
import { useAuth } from "../../../../services/authContext2";
import GradientLayout from "../../../layout";
import Database from "../../../../services/sqlite";





export default function Assign() {

  const {auth,logout}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"),status:1 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

 
  const { id }: any = useLocalSearchParams<{ id: string }>();
  const { rifa }: any = useLocalSearchParams<{ rifa: string }>();
  const [separated,setSeparated] = useState<any[]>([]);
  const [separated2,setSeparated2] = useState<any[]>([]);
  const [rifa2, setRifa2] = useState<rifa>();
  const [modal,setModal]=useState(false);
  const [responseMessage,setResponseMessage]=useState<string|null>();
  const [hasError,setHasError]=useState(false);
  const [buscar,setBuscar]=useState<string>("");
  const [selected,setSelected]=useState<any>();
  const [confirm,setConfirm]=useState(false);
  const [loading,setLoading]=useState<boolean>(true);
  const array = [1,1,1];
  const db = new Database();
 

  const [confirmModal,setConfirmModal]=useState(false);

  useEffect(() => { handleAsignaciones() }, [id]);
  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
  useEffect(() => { console.log(rifa2) }, [rifa2]);
 
  async function handleAsignaciones() {
    setLoading(true);
   
    try{
      const response = await indexSeparated(id);
      if(!!response.error){
        setResponseMessage(response.error);
        setHasError(true);
        setModal(true);

      }else{
        if(!Array.isArray(response)){
          setSeparated([]);
          setSeparated2([]);
          setResponseMessage("Ha ocurrido un error");
          setModal(true);
        }else{
          
          if(Platform.OS!=='web'){
                 
          const aa =  await db.indexWithRelations(
            {tableName:'asignaciones' },
            [{tableName:'compradores',alias:'purchaser',foreignKey:'id_purchaser'},{tableName:'rifas',alias:'rifa',foreignKey:'id_raffle'}],
            ['id','number','status','local'],
            [{alias:'purchaser',fields:['id','phone','name','email','deleted']},{alias:'rifa',fields:['deleted']}],
            `id_raffle = ${id} AND asignaciones.deleted = 0 AND status = 'separado' AND rifa.deleted = 0 AND purchaser.deleted = 0 AND asignaciones.local = 1`
          );

          const total = aa.concat(response);
          setSeparated(response);
          setSeparated2(response);


          }else{
            setSeparated(response);
            setSeparated2(response);

          }

          setLoading(false);
      
        }
     
      }
      
    }catch(e:any){
    

        if(Platform.OS!=='web'){
          setResponseMessage('verifica tu conexion, datos cargados localmente');
          //setHasError(true);
            setModal(true);
            console.log('index asignaciones', await db.index('asignaciones'))
          const aa =  await db.indexWithRelations(
            {tableName:'asignaciones' },
            [{tableName:'compradores',alias:'purchaser',foreignKey:'id_purchaser'},{tableName:'rifas',alias:'rifa',foreignKey:'id_raffle'}],
            ['id','number','status','local'],
            [{alias:'purchaser',fields:['id','phone','name','email','deleted']},{alias:'rifa',fields:['deleted']}],
            `id_raffle = ${id} AND asignaciones.deleted = 0 AND status = 'separado' AND rifa.deleted = 0 AND purchaser.deleted = 0`
          );

          if(Array.isArray(aa)){
            setSeparated(aa);
            setSeparated2(aa);
            
            console.log(aa);
          }
          
        }else{
          setResponseMessage('Ha ocurrido un error, verifica tu conexion');
            setModal(true);
        }
        setLoading(false);
    }
    
  }

  function handleCloseModal(){
    setModal(false);
  }

  function OpenConfirm(obj:any,tipo:boolean){
    tipo===true?setConfirm(true):setConfirm(false);
    setSelected(obj)
    setConfirmModal(true);
  }

  async function HandleConfirm(){
      try{
     if(!selected.local){
       
      const response = await confirmSeparated(selected.id);
   if(response.mensaje){
    setResponseMessage(response.mensaje);
    setModal(true);
    const a = separated.filter(obj => obj.id !== selected.id);
    setSeparated(a);
    setSeparated2(a);
    
    
   }else{
    setResponseMessage(response.error);
    setModal(true);
   }
     }else{

       await db.update('asignaciones',{status:'pagado'},[{id:selected.id},""]);
      const aa = separated.filter(obj => obj.id!==selected.id);
      setSeparated(aa);
      setSeparated2(aa);
      console.log('index asignaciones', await db.index('asignaciones'))
     }

      }catch(e:any){

        if(Platform.OS!=='web'){
      
          if(selected.local){
            await db.update('asignaciones',{status:'pagado'},[{id:selected.id},""]);
          }else{
            if(selected.id>0){
            await db.update('asignaciones',{status:'pagado',local:1},[{id:selected.id},""]);
            }
        }
          const a = separated.filter(obj => obj.id !== selected.id);
          setSeparated(a);
          setSeparated2(a);
          console.log('index asignaciones', await db.index('asignaciones'))
          setResponseMessage('verifica tu conexion, datos guardados localmente');
        }else{
          setResponseMessage('Ha ocurrido un error, verifica tu conexion');
        }
        
        setModal(true);
  
      }
  }

  async function HandleDelete(){
    try{
      if(!selected.local){
        const response = await deleteSeparated(selected.id);
        setResponseMessage(response.mensaje||response.error);
        setHasError(!!response.error);
        setModal(true)
        handleAsignaciones();
      } else{

        await db.deleteDataTable('asignaciones',{id:selected.id});
          //   handleAsignaciones();
        const aa = separated.filter(obj => obj.id!==selected.id);
        setSeparated(aa);
        setSeparated2(aa);
      }
     
    //  console.log(response);
    }catch(e:any){
       if(Platform.OS!=='web'){
        if(selected.local){
          await db.deleteDataTable('asignaciones',{id:selected.id})
        }else{
          if(selected.id>0){
            await db.update('asignaciones',{local:1,deleted:1},[{id:selected.id},""]);

            console.log('index asignaciones', await db.index('asignaciones'))
          }
          
        const a = separated.filter(obj => obj.id !== selected.id);
        setSeparated(a);
        setSeparated2(a);
        }
        console.log('index asignaciones', await db.index('asignaciones'))
        setResponseMessage('verifica tu conexion, datos borrados localmente');
        
       }else{
        setResponseMessage('Ha ocurrido un error, verifica tu conexion');
       }

      
        setModal(true);
    }
    
  }


  function find(value:string) {
    setBuscar(value);
    const filtroLowerCase = value.toLowerCase();

    const filteredArray = separated.filter(obj => {
        const emailLowerCase = obj.purchaser_email.toLowerCase();
        const nameLowerCase = obj.purchaser_name.toLowerCase();
        const numberString = obj.number.toString();

        return emailLowerCase.includes(filtroLowerCase)|| nameLowerCase.includes(filtroLowerCase) || numberString.includes(filtroLowerCase);
    });

    // Actualiza el array separated2 con los resultados filtrados
  //  console.log("separated2 :",filteredArray)
    setSeparated2(filteredArray);
}
 

  return (
<GradientLayout  navigationItems={navigationItems} hasDrawer={true} >
  <ScrollView style={styles.main}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            onChangeText={find}
            value={buscar}


          /> 
        </View>
        <View style={styles.cardContainer}>
            {!loading && separated2.length>0 && (
               separated2.map((obj,index)=>(
             <TouchableOpacity key={index} onPress={()=>undefined} activeOpacity={1}>
                <SeparatedCard
                key={index}
                prueba={false}
                info={obj}
                onCancel={(info)=>OpenConfirm(info,false)}
                onConfirm={(info)=> OpenConfirm(info,true)}
                /></TouchableOpacity>
              ))
            )
           }
           {loading && (
              array.map((obj,index)=>(
                <TouchableOpacity key={index} onPress={()=>undefined} activeOpacity={1}>
                <SeparatedCard
                prueba={true}
                key={index}
                info={obj}
                onCancel={(info)=>undefined}
                onConfirm={(info)=> undefined}
                /></TouchableOpacity>
              ))

           )
           }       

          { !loading && separated2.length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado asignaciones . . .</Text></View>
            )
           }                     
          
        </View>
      </ScrollView>

      {(
          <ToastModal
          message={responseMessage == null ? '' : responseMessage}
          blockTime={500}
          time={2000}
          visible={modal}
          onClose={handleCloseModal}  
          />
      )}
        {(
          <Delete
          mode={confirm===true?"confirm":'delete'}
          message={confirm===true?"Porfavor confirma la asignacion.":"¿Estas seguro de querer cancelar esta asignacion?"}
          visible={confirmModal}
          onCancel={()=>setConfirmModal(false)}
          onConfirm={confirm===true?HandleConfirm:HandleDelete}
          onClose={()=>setConfirmModal(false)}
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
  gridContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  selectedNumbersContainer: {
    marginTop: 20,
  },
  selectedNumbersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedNumber: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedNumberText: {
    color: '#fff',
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
