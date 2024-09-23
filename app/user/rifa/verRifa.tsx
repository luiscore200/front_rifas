import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { confirmSeparated, deleteSeparated, getAllAssignament, notificarPendientes, rifaAssign } from "../../../services/api";
import RifaGrid from "../../../components/user/rifa/rifaGrid";
import { View, Text, StyleSheet,Platform, TouchableOpacity, ScrollView } from 'react-native';
import { rifa } from "../../../config/Interfaces";
import { useAuth } from "../../../services/authContext2";
import GradientLayout from "../../layout";
import Database from "../../../services/sqlite";

import { NextIcon, PrevIcon, StarIcon2 } from "../../../assets/icons/userIcons";
import InfoAssignamentModal from "../../../components/user/rifa/infoCard";
import ToastModal from "../../../components/toastModal";



export default function Assign() {

  const {auth,logout,online,setOnline}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"),status:1 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  const { id }: any = useLocalSearchParams<{ id: string }>();
  const { rifa }: any = useLocalSearchParams<{ rifa: string }>();
  const [asignaciones, setAsignaciones] = useState<any | null>([]);
  const [selectedNumber, setSelectedNumber] = useState<any>();

  const [rifa2, setRifa2] = useState<rifa>();
  const [premios,setPremios]= useState<number[]>([])
  const [modal,setModal]=useState(false);
  const [responseMessage,setResponseMessage]=useState<string>();
  const [hasError,setHasError]=useState(false);
  const [touchedOut,setTouchedOut]=useState<boolean>(false);
  const db = new Database();

    const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);
  


  const [lista,setLista]=useState<any[]>([])
  const [list,setList]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal,setOpenModal]=useState(false);

  useEffect(() => {
    const listDistance= 1000;
     const aa = [];
     for (let i = 0; i < Number(rifa2?.numeros); i += listDistance) {
       const page = Math.floor(i / 100) + 1;
       aa.push({text:`${i + 1} - ${i + listDistance}`,page});
     }
     setLista(aa);
   }, [rifa2]);


   
  const getStatus = (number: number): 'disponible' | 'pagado' | 'separado'  => {
    const assigned = asignaciones.find((assigned:any) => assigned.number === number);
    return assigned ? assigned.status : 'disponible';
  };

  

  useEffect(() => { handleAsignaciones() }, [id]);
  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
  useEffect(() => { 
    const premios2 = rifa2?.tipo=="anticipados"? rifa2.premios?.map(obj => ({ ...obj })).reverse(): rifa2?.premios;
    const premiosNumber:number[]= [];
    premios2?.map(obj=>(premiosNumber.push(Number(obj.ganador))));
    setPremios(premiosNumber);

  }, [rifa2]);
  useEffect(() => { console.log(asignaciones) }, [asignaciones]);

 async function handleAsignaciones() {
   
    try{
    //  const response = await indexSeparated(id);
   const response = await getAllAssignament(id);
      if(!!response.error){
        setResponseMessage(response.error);
        setHasError(true);
        setModal(true);

      }else{
        if(!Array.isArray(response)){
          setAsignaciones([]);
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
            `id_raffle = ${id} AND asignaciones.deleted = 0 AND  AND rifa.deleted = 0 AND purchaser.deleted = 0 AND asignaciones.local = 1`
          );

          const total = aa.concat(response);
          setAsignaciones(response);
        


          }else{
            setAsignaciones(response);
         

          }

         
      
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
            `id_raffle = ${id} AND asignaciones.deleted = 0  AND rifa.deleted = 0 AND purchaser.deleted = 0`
          );

          if(Array.isArray(aa)){
            setAsignaciones(aa)
            
           
          }
          
        }else{
          setResponseMessage('Ha ocurrido un error, verifica tu conexion');
            setModal(true);
        }
    
    }
    
  }



  const SelectNumber =(number:number)=>{
    const aa =asignaciones.find((obj:any)=>obj.number ===number);
    setSelectedNumber(aa);
    setOpenModal(true);

  }


  
 

 


  const renderCell = (number: number) => {
    const isSelected = false;
    const status = getStatus(number);
    const isBlocked = number > Number(rifa2?.numeros);
    let isWinner = false;
    let Npremio= 0;

    if(premios.length>0){
      premios.forEach((element,index) => {if(element===number){isWinner=true; Npremio=index+1;}});
    }

    let cellStyle:any = styles.cell;
    let textStyle = styles.cellText;

    if (isBlocked) {
      cellStyle = styles.blockedCell;
      textStyle = styles.blockedCellText;
    } else if (status === 'pagado') {
      if(isWinner){
        cellStyle = styles.assignedWinnerCell;
        textStyle = styles.assignedCellText;
      }else{
        cellStyle = styles.assignedCell;
        textStyle = styles.assignedCellText;
      }
     
    } else if (status === 'separado') {
      if(isWinner){
        cellStyle = styles.reservedWinnerCell;
      textStyle = styles.reservedCellText;
      }else{
        cellStyle = styles.reservedCell;
      textStyle = styles.reservedCellText;
      }
    } else if (isSelected) {
      cellStyle = styles.selectedCell;
      textStyle = styles.selectedCellText;
    } else if (isWinner){
       cellStyle = styles.cellWinner;
       textStyle = styles.cellText;

    }
  

    return (
    
      <TouchableOpacity
        key={number}
        style={cellStyle}
        onPress={() => SelectNumber(number)}
        disabled={isBlocked ||( status !=='separado' && status!=='pagado')}
      >
        {!!isWinner &&(
         <View style={{position:'absolute',top:-9,left:12,zIndex:999}}>
           <StarIcon2 number={Npremio} border={"#ca8a04"} style={{width:"28",height:"28",color:"#eab308"}}/>
         </View>
        )
          
        }
        <Text style={textStyle}>{number}</Text>
      </TouchableOpacity>
     
    );
  };

  const renderMatrix = (startNumber: number) => {
    const matrix = [];
    for (let i = 0; i < 5; i++) {
      const rowNumbers = Array.from({ length: 5 }, (_, j) => startNumber + i * 5 + j).filter(num => num <= Number(rifa2?.numeros));
      matrix.push(
        <View key={startNumber + i} style={styles.row}>
          {rowNumbers.map(number => renderCell(number))}
        </View>
      );
    }
    return (
      <View key={startNumber} style={styles.matrix}>
        {matrix}
      </View>
    );
  };

  const RenderListPaginations = () => {
    return (
      <View style={{
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'absolute',
        width: 200,
        minHeight: 200,
        maxHeight: 450,
        top: 190,
        left: '50%',
        transform:[{translateX:-100}],
        zIndex: 999,
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden'
      }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 6 }}>
          {lista.map((obj, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {setList(false);setCurrentPage(obj.page)}}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: '#333', fontSize: 14,fontWeight:'400' }}>{obj.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPagination = () =>{
    let totalPages = Math.ceil(Number(rifa2?.numeros) / 100);
    
    return(
   
    <View style={{    flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginBottom: 10,}}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => {setCurrentPage(currentPage - 1)}}
        style={[{  paddingHorizontal:30, padding: 10,}, currentPage === 1 && {  opacity: 0.3,}]}
      >
        <PrevIcon style={{color:"#6b7280"}}/>
      </TouchableOpacity>
     <TouchableOpacity onPress={()=>{setList(!list)}}>
      <Text style={{  fontSize: 16,}}>{`Página ${currentPage} de ${totalPages}`}</Text>
     </TouchableOpacity>
   
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => {setCurrentPage(currentPage + 1)}}
        style={[{  paddingHorizontal:30, padding: 10,}, currentPage === totalPages && {  opacity: 0.3,}]}
      >
         <NextIcon style={{color:'#6b7280'}}/>
      </TouchableOpacity>
    </View>
  );}




  const renderGrid = () => {
    const startNumber = (currentPage - 1) * 100 + 1;
    const maxNumber= startNumber + 100 -1;
    console.log(startNumber +" "+maxNumber);
    const grid = [];
    let number = startNumber;
    while (number <= maxNumber) {
      const row = [];
      for (let i = 0; i < (Math.ceil(Math.sqrt(100))/5) && number <= maxNumber; i++) {
        row.push(renderMatrix(number));
        number += 5 * 5;
      }
      grid.push(
        <View key={number} style={styles.gridRow}>
          {row}
        </View>
      );
    }
    return grid;
  };



  async function HandleDelete(id_asignacion:number){
    try{
      if(id_asignacion>=0){
        const response = await deleteSeparated(id_asignacion);
        if(response.mensaje){
            setResponseMessage(response.mensaje);
            setHasError(false);
            setModal(true)
            const aa = asignaciones.filter((obj:any) => obj.id!==id_asignacion);
            setAsignaciones(aa);
      
                      
        }else{
            setResponseMessage(response.error);
            setHasError(!!response.error);
            setModal(true)
            handleAsignaciones();       

        }
        setResponseMessage(response.mensaje||response.error);
        setHasError(!!response.error);
        setModal(true)
        handleAsignaciones();
      } else{

        await db.deleteDataTable('asignaciones',{id:id_asignacion});
          //   handleAsignaciones();
        const aa = asignaciones.filter((obj:any) => obj.id!==id_asignacion);
        setAsignaciones(aa);
      
      }
     
    //  console.log(response);
    }catch(e:any){
       if(Platform.OS!=='web'){
        if(id_asignacion>=0){
          await db.deleteDataTable('asignaciones',{id:id_asignacion})
        }else{
          if(id_asignacion>0){
            await db.update('asignaciones',{local:1,deleted:1},[{id:id_asignacion},""]);

            console.log('index asignaciones', await db.index('asignaciones'))
          }
          
        const a = asignaciones.filter((obj:any) => obj.id !== id_asignacion);
        setAsignaciones(a);
     
        }
        console.log('index asignaciones', await db.index('asignaciones'))
        setResponseMessage('verifica tu conexion, datos borrados localmente');
        
       }else{
        setResponseMessage('Ha ocurrido un error, verifica tu conexion');
       }

      
        setModal(true);
    }
    
  }


  
  async function HandleConfirm(id_asignacion:number){
    try{
   if(id_asignacion>0){
     
    const response = await confirmSeparated(id_asignacion);
 if(response.mensaje){
  setResponseMessage(response.mensaje);
  setModal(true);
  const a = asignaciones.map((obj:any) =>{
    if(obj.id===id_asignacion){
        obj.status='pagado';
        return obj;
    }else{
        return obj;
    }


  });
 
  setAsignaciones(a);
  
  
 }else{
  setResponseMessage(response.error);
  setModal(true);
 }
   }else{

     await db.update('asignaciones',{status:'pagado'},[{id:id_asignacion},""]);
    const aa = asignaciones.filter((obj:any) => obj.id!==id_asignacion);
    
    setAsignaciones(aa);
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
        const a = asignaciones.filter((obj:any) => obj.id !== id_asignacion);
        
        setAsignaciones(a);
        console.log('index asignaciones', await db.index('asignaciones'))
        setResponseMessage('verifica tu conexion, datos guardados localmente');
      }else{
        setResponseMessage('Ha ocurrido un error, verifica tu conexion');
      }
      
      setModal(true);

    }
}


const notificar = async()=>{
  try {
      const response = await notificarPendientes(id);
      if(response.mensaje){
        setResponseMessage('notificaciones enviadas con exito');
        setModal(true);
      }else{
        setResponseMessage('ha ocurrido un error con la solicitud');
        setModal(true);
      }
  } catch (error) {
    setResponseMessage('ha ocurrido un error, verifica tu conexion');
    setModal(true);
  }


}

  

  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} touchOut={touchedOut} touchedOut={()=>{setTouchedOut(false)}}
    size={(a,b,c,d)=>{setIsSmallScreen(a);setIsMediumScreen(b);setIsLargeScreen(c);setIsXLargeScreen(d)}} >


      <TouchableOpacity activeOpacity={1} onPress={()=>{setList(false)}} style={styles.container}>
      <View   
      style={[{},
        isLargeScreen && { width:'30%',marginHorizontal:'35%' },
        isXLargeScreen &&{ width:'30%',marginHorizontal:'35%' },
      ]}
      >
      {renderPagination()
        }
      </View>
     {(isSmallScreen||isMediumScreen)?(
      <View style={{paddingTop:5,paddingHorizontal:20}}>
      <ScrollView horizontal  onTouchStart={()=>setList(false)}>
         <ScrollView style={{ height:(isLargeScreen||isXLargeScreen)?700:500}} onTouchStart={()=>setList(false)}>
           <TouchableOpacity activeOpacity={1} onPress={()=>{list?setList(false):undefined}}>
             {renderGrid()
             }
           </TouchableOpacity>
         </ScrollView>
       </ScrollView>
      </View>
     ):(
      <View style={{paddingTop:5,paddingHorizontal:20,alignItems:'center'}}>
     <ScrollView horizontal  onTouchStart={()=>setList(false)}>
        <ScrollView style={{ height:(isLargeScreen||isXLargeScreen)?700:500}} onTouchStart={()=>setList(false)}>
          <TouchableOpacity activeOpacity={1} onPress={()=>{list?setList(false):undefined}}>
            {renderGrid()
            }
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
     </View>
     )

     }
      <View style={[styles.selectedNumbersContainer,
            isSmallScreen && {  right:0,
              left:0,},
            isMediumScreen && {   right:0,
              left:0, },
            isLargeScreen && { width:'40%',marginHorizontal:'30%' },
            isXLargeScreen &&{ width:'40%',marginHorizontal:'30%' },
      ]}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ff6b6b' }]} />
            <Text>Asignado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#bdbdbd' }]} />
            <Text>Disponible</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ffcc00' }]} />
            <Text>Separado</Text>
          </View>

        
        </View>
        
        <View style={styles.totalContainer}>
          <View>
            <Text>Asignaciones:</Text>
            <Text>{asignaciones.length}/{rifa2?.numeros} </Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={() => notificar()}>
            <Text style={styles.confirmButtonText}>Notificar Pendientes</Text>
          </TouchableOpacity>
        </View>
      </View>
      
       </TouchableOpacity>
       {list && (<RenderListPaginations/>)

        }
        {openModal && (
            <InfoAssignamentModal
            visible={openModal}
            asignacion={selectedNumber}
            asignaciones={asignaciones}
            onCancel={()=>{setOpenModal(false)}}
            onClose={()=>{setOpenModal(false)}}
            onDelete={(asignacion)=>{console.log('se quiere borrar la asignacion',asignacion.id);HandleDelete(asignacion.id)}}
            onConfirm={(asignacion)=>{console.log('se quiere confirmar la asignacion',asignacion.id);HandleConfirm(asignacion.id)}}
            />
        )

        }
        {modal && responseMessage && (
            <ToastModal
            visible={modal}
            message={responseMessage}
            blockTime={500}
            time={1500}
            onClose={()=>setModal(false)}
            
            />
        )

        }
    </GradientLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:20
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
  container2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    margin: 5,
  },
  item: {
    backgroundColor: '#ccc',
    padding: 10,
    margin: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  cellWinner: {
    width: 40,
    height: 40,
    backgroundColor: '#fff7ed',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth:2,
    borderColor:'#facc15',
    borderRadius: 5,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  
  cellText: {
    color: '#000',
  },
  assignedCell: {
    width: 40,
    height: 40,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  assignedWinnerCell: {
    width: 40,
    height: 40,
    backgroundColor: '#fda4af',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth:2,
    borderColor:"#ca8a04",
    borderRadius: 5,
  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  assignedCellText: {
    color: '#fff',
  },
  reservedCell: {
    width: 40,
    height: 40,
    backgroundColor: '#ffcc00',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  reservedWinnerCell: {
    width: 40,
    height: 40,
    backgroundColor: '#fde047',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth:2,
    borderColor:"#ca8a04",
    borderRadius: 5,


    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  reservedCellText: {
    color: '#fff',
  },
  selectedCell: {
    width: 40,
    height: 40,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  },
  selectedCellText: {
    color: '#fff',
  },
  blockedCell: {
    width: 40,
    height: 40,
    backgroundColor: '#bdbdbd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 5,
  },
  blockedCellText: {
    color: '#757575',
  },
  matrix: {
    margin: 10,
  },  
  gridRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectedNumbersContainer: {
    position:'absolute', 
    borderTopStartRadius:20,
    borderTopEndRadius:20,  
    borderWidth:1,
    borderColor:'#9ca3af',
    backgroundColor: '#fff',
    shadowColor: '#000',
    borderBottomWidth:0,
    
    
    padding:10,
    bottom:0,
  
    paddingVertical:50,
   
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
    
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    height: 10,
    width: 10,
    borderWidth: 0,
    marginEnd: 10,
  },
  selectedNumbersRow: {
    flexDirection: 'row',
    minHeight: 100,
    maxHeight:100,
    marginHorizontal:10,
 
    
  },
  selectedNumbersTitle: {
    marginTop: 8,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedNumbers: {
    borderWidth:1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginVertical: 10,
    
  },
  selectedNumber: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 10,
    width: 55,
    height:30,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
    justifyContent:'center'
  },
  selectedNumberText: {
    color: '#fff',
  },
  totalContainer: {
    marginTop:10,
    marginLeft:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: 'red',
  },
  confirmButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight:10, 
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
});
