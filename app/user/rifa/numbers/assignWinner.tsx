import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ScrollView } from 'react-native';
import { premio, rifa } from "../../../../config/Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import ToastModal from "../../../../components/toastModal";
import PremioCard from "../../../../components/user/rifa/ganador/premioCard";
import NumberGridModal from "../../../../components/user/rifa/ganador/numbersModalGrid";
import ConfirmationModal from "../../../../components/ConfirmModal";
import { rifaFind, updateWinner } from "../../../../services/api";
import { useAuth } from "../../../../services/authContext2";
import GradientLayout from "../../../layout";


export default function Assign() {

  const {auth,logout}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"),status:1 },
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  const { id }: any = useLocalSearchParams<{ id: string }>();
  const { rifa }: any = useLocalSearchParams<{ rifa: string }>();

  const [rifa2, setRifa2] = useState<rifa>();
  const [modal,setModal]=useState(false);
  const [responseMessage,setResponseMessage]=useState<string|null>();
  const [hasError,setHasError]=useState(false);
  const [premios,setPremios]=useState<premio[]>([]);
  const [confirm,setConfirm]=useState(false);
  const [confirmModal,setConfirmModal]=useState(false);
  const [grid,setGrid]=useState(false);
  const [selectedIndex,setSelectedIndex]=useState<number>(0);
  const [number, setNumber]=useState<number>(0);

  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [id]);

  useEffect(() => { 
    console.log("actualuzado", rifa2);
  }, [rifa2]);
  
  useEffect(() => { 
    setPremios(rifa2?.premios ? rifa2.premios : []);
    console.log("Premios actualizados", premios);
  }, [rifa2]);
  
  useEffect(() => { 
    console.log("nuevos premios",premios);
  }, [premios]);
  

  function handleCloseModal(){
    setModal(false);
  }
  function selectedPremio(number:number){
    setSelectedIndex(number);
    setConfirm(false);
    setGrid(true);


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

  async function handleRifa(){
    try{
      const response = await rifaFind(id);
      console.log("aaa",response);
      if(!!response.error){
        setResponseMessage(response.error);
        setModal(true);
      }
      if(isRifa(response)){
         setRifa2(response);
     
      }else{
          setResponseMessage("No se ha podido sincronizar los cambios con la base de datos");
          setModal(true);
      }
      
    }catch(e:any){

    }
  }

  function handleConfirm(number:number){
    setNumber(number);
    setConfirm(true);

  }

  function handleCancel(){
    setConfirm(false);
    setGrid(false);
  }

  async function updatePremio(index:number,field:string,value:number){
    setGrid(false);
        
 
    const newPremios = [...premios];
  
    
    newPremios[index] = {
      ...newPremios[index],
      [field]: value.toString()
    };
    setPremios(newPremios);

    try{
      const response=await updateWinner(id,newPremios,index);
     // setResponseMessage(response.mensaje||response.error);
     // setModal(true);
     console.log(response);
     // await handleRifa();
    }catch(e:any){
      setResponseMessage(e.message);
      setModal(true);
    }
   
    
  }
  

 
  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} >
      <ScrollView style={styles.main}>
       
        <View style={styles.cardContainer}>
           
        { premios.length!==0 && (
            premios.map((premio,index)=>( 
                <PremioCard  
                key={index} 
                premio={premio}
                onTouch={()=>selectedPremio(index)}
                 />
            )))
           }
              <PremioCard  
            
                premio={{"id":1,"descripcion":"Primer Premio","loteria":"SINUANO NOCHE","ganador":"","fecha":"2024-05-31"}}
                onTouch={()=>selectedPremio(0)}
                 />
           { premios.length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}><Text>. . . No se han encontrado premios . . .</Text></View>
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
        {!!rifa2 && (
            <NumberGridModal
            visible={grid}
            totalNumbers={rifa2.numeros?10000:100}
            touchable={true}
            onSelectNumber={handleConfirm}
            onClose={()=>handleCancel()}
            maxHeight={400}
            cuadricula={5}
          />
        )}
          { (
          <ConfirmationModal
            visible={confirm}
            mode="confirm"
            message="Por favor confirma tu eleccion"
            onCancel={ ()=>setConfirm(false)}
            onClose={ ()=>setConfirm(false)}
            onConfirm={()=>updatePremio(selectedIndex,"ganador",number)}
          
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
    paddingTop:20,
    marginBottom: 16,
  },
});
