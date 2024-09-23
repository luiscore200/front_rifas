import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { indexSeparated,deleteSeparated,confirmSeparated, getAllAssignament } from "../../../../services/api";
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
import InfoAssignamentModal from "../../../../components/user/rifa/infoCard";





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
  const [separadas,setSeparadas]=useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);


  const [open,setOpen]=useState(false);
  const array = [1,1,1];
  const db = new Database();
 
 

  const [confirmModal,setConfirmModal]=useState(false);

  useEffect(() => { handleAsignaciones() }, [id]);
  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
  useEffect(() => { console.log(rifa2) }, [rifa2]);
 
  async function handleAsignaciones() {
    setLoading(true);
   
    try{
    //  const response = await indexSeparated(id);
   const response = await getAllAssignament(id);
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
          console.log(response);
          
          if(Platform.OS!=='web'){
                 
          const aa =  await db.indexWithRelations(
            {tableName:'asignaciones' },
            [{tableName:'compradores',alias:'purchaser',foreignKey:'id_purchaser'},{tableName:'rifas',alias:'rifa',foreignKey:'id_raffle'}],
            ['id','number','status','local'],
            [{alias:'purchaser',fields:['id','phone','name','email','deleted']},{alias:'rifa',fields:['deleted']}],
            `id_raffle = ${id} AND asignaciones.deleted = 0  AND rifa.deleted = 0 AND purchaser.deleted = 0 AND asignaciones.local = 1`
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
            `id_raffle = ${id} AND asignaciones.deleted = 0 AND rifa.deleted = 0 AND purchaser.deleted = 0`
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
   // console.log('funciona');
   setConfirm(tipo);
    setSelected(obj)
    setConfirmModal(true);
  }

  function openUserModal (asignacion:any){
      setSelected(asignacion);
      setOpen(true);
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
  async function HandleConfirm2(id_asignacion:number){
    try{
   if(id_asignacion>=0){
     
    const response = await confirmSeparated(id_asignacion);
 if(response.mensaje){
  setResponseMessage(response.mensaje);
  setModal(true);
  const a = separated.map((obj:any) =>{
    if(obj.id===id_asignacion){
        obj.status='pagado';
        return obj;
    }else{
        return obj;
    }


  });
  setSeparated(a);
  setSeparated2(a);
  
  
 }else{
  setResponseMessage(response.error);
  setModal(true);
 }
   }else{

     await db.update('asignaciones',{status:'pagado'},[{id:id_asignacion},""]);
    const aa = separated.filter(obj => obj.id!==id_asignacion);
    setSeparated(aa);
    setSeparated2(aa);
    console.log('index asignaciones', await db.index('asignaciones'))
   }

    }catch(e:any){

      if(Platform.OS!=='web'){
    
        if(id_asignacion<0){
          await db.update('asignaciones',{status:'pagado'},[{id:id_asignacion},""]);
        }else{
          if(id_asignacion>0){
          await db.update('asignaciones',{status:'pagado',local:1},[{id:id_asignacion},""]);
          }
      }
        const a = separated.filter(obj => obj.id !== id_asignacion);
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
        if(response.mensaje){
          setResponseMessage(response.mensaje);
          setHasError(false);
          setModal(true)
          const aa = separated.filter((obj:any) => obj.id!==selected.id);
          setSeparated(aa);
          setSeparated2(aa);
    
                    
      }else{
          setResponseMessage(response.error);
          setHasError(!!response.error);
          setModal(true)
          handleAsignaciones();       

      }

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

  async function HandleDelete2(id_asignacion:number){
    try{
      if(id_asignacion>=0){
        const response = await deleteSeparated(id_asignacion);
        if(response.mensaje){
          setResponseMessage(response.mensaje);
          setHasError(false);
          setModal(true)
          const aa = separated.filter((obj:any) => obj.id!==id_asignacion);
          setSeparated(aa);
          setSeparated2(aa);
    
                    
      }else{
          setResponseMessage(response.error);
          setHasError(!!response.error);
          setModal(true)
          handleAsignaciones();       

      }

      } else{

        await db.deleteDataTable('asignaciones',{id:id_asignacion});
          //   handleAsignaciones();
        const aa = separated.filter(obj => obj.id!==id_asignacion);
        setSeparated(aa);
        setSeparated2(aa);
      }
     
    //  console.log(response);
    }catch(e:any){
       if(Platform.OS!=='web'){
        if(id_asignacion<0){
          await db.deleteDataTable('asignaciones',{id:id_asignacion})
        }else{
          if(selected.id>0){
            await db.update('asignaciones',{local:1,deleted:1},[{id:id_asignacion},""]);

            console.log('index asignaciones', await db.index('asignaciones'))
          }
          
        const a = separated.filter(obj => obj.id !== id_asignacion);
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

    const newArray = separated.filter((obj)=>{
       obj.status === separadas?'separado':'pagado';
    })

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
<GradientLayout  navigationItems={navigationItems} hasDrawer={true}  size={(a,b,c,d)=>{setIsSmallScreen(a);setIsMediumScreen(b);setIsLargeScreen(c);setIsXLargeScreen(d)}}>
  <View style={styles.main}>
        <View  style={[styles.searchContainer,
             isSmallScreen && {width:'90%' },
             isMediumScreen && {width:'90%' },
             isLargeScreen && { width:'60%' },
             isXLargeScreen && {width:'60%'},
        ]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            onChangeText={find}
            value={buscar}


          /> 
        </View>
        <View style={[{flexDirection:'row',alignItems:'center',alignContent:'center',marginBottom:20, justifyContent:'center',},
         isSmallScreen && {width:'95%' },
         isMediumScreen && {width:'95%' },
         isLargeScreen && { width:'60%' },
         isXLargeScreen && {width:'60%'},
        ]}>
             
        <TouchableOpacity
        style={[{  borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15, },separadas?styles.buttonPressed:styles.button]}activeOpacity={separadas?1:1}   onPress={()=>{!separadas?setSeparadas(true):undefined}}
      >
        <Text style={{ textAlign: 'center', color: '#fff' }}>Separados</Text>
      </TouchableOpacity>

      {/* Botón elevado */}
      <TouchableOpacity
           
        style={[{borderTopRightRadius: 15,
          borderBottomRightRadius: 15,},!separadas?styles.buttonPressed:styles.button]}  activeOpacity={!separadas?1:1}  onPress={()=>{separadas?setSeparadas(false):undefined}}
      >
        <Text style={{ textAlign: 'center', color:'#fff'  }}>Pagados</Text>
      </TouchableOpacity>

              
        </View>
        <ScrollView 
           showsVerticalScrollIndicator={false} 
        style={[styles.cardContainer,  
          isSmallScreen && {width:'95%' },
          isMediumScreen && {width:'95%'},
          isLargeScreen && { width:'60%',  padding:20 },
          isXLargeScreen && {width:'60%',  padding:40},]}>

            {!loading && separated2.length>0 && separadas  && (
               separated2.filter((obj)=>
                obj.status === 'separado'
             ).map((obj,index)=>(
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
               {!loading && separated2.length>0 && !separadas && (
                 separated2.filter((obj)=>
                  obj.status === 'pagado'
               ).map((obj,index)=>(
             <TouchableOpacity key={index} onPress={()=>undefined} activeOpacity={1}>
                <SeparatedCard
                key={index}
                prueba={false}
                info={obj}
                onCancel={(info)=>OpenConfirm(info,false)}
               
                onConfirm={(info)=>{openUserModal(info)}}
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
               { !loading &&  separadas && separated2.filter(obj=>obj.status==='separado').length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado asignaciones . . .</Text></View>
            )
           }  
                 { !loading &&  !separadas && separated2.filter(obj=>obj.status==='pagado').length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado asignaciones . . .</Text></View>
            )
           }  
          
        </ScrollView>
      </View>

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
          onCancel={()=>{setConfirmModal(false);setSelected(null)}}
          onConfirm={confirm===true?HandleConfirm:HandleDelete}
          onClose={()=>{setConfirmModal(false);setSelected(null)}}
          width={400}
          />
              )}
         {open && (
            <InfoAssignamentModal
            visible={open}
            asignacion={selected}
            asignaciones={separated}
            onCancel={()=>{setSelected(null); setOpen(false)}}
            onClose={()=>{setSelected(null); setOpen(false)}}
            onDelete={(asignacion)=>{ setSelected(asignacion);  console.log('se quiere borrar la asignacion',asignacion.id);HandleDelete2(asignacion.id)}}
            onConfirm={(asignacion)=>{ setSelected(asignacion); console.log('se quiere confirmar la asignacion',asignacion.id);HandleConfirm2(asignacion.id)}}
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
     alignItems:'center'
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
  buttonPressed:{
    backgroundColor: '#94a3b8',
  
    justifyContent: 'center',
    width: '45%',
    paddingHorizontal: 20,
    paddingVertical: 10,
   
   
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: -5,
  },
  button:{
    
      backgroundColor: '#cbd5e1',
      
      justifyContent: 'center',
      width: '45%',
      paddingHorizontal: 20,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 5,
    
  }
});
