import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { indexSeparated,deleteSeparated,confirmSeparated } from "../../../../services/api";
import RifaGrid from "../../../../components/user/rifa/rifaGrid";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput,ScrollView } from 'react-native';
import { rifa } from "../../../../config/Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import ToastModal from "../../../../components/toastModal";
import SeparatedCard from "../../../../components/user/rifa/separated/separatedCard";
import Delete from "../../../../components/ConfirmModal";





export default function Assign() {
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
 

  const [confirmModal,setConfirmModal]=useState(false);

  useEffect(() => { handleAsignaciones() }, [id]);
  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
  useEffect(() => { console.log(rifa2) }, [rifa2]);
 
  async function handleAsignaciones() {
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
          
          setResponseMessage("algo ha ocurrido, no se ha podido cargar el listado");
          setHasError(true);
          setModal(true);
        }else{
          setSeparated(response);
          setSeparated2(response);
          console.log(response);
        }
     
      }
      
    }catch(e:any){
      setResponseMessage(e.message);
      setHasError(true);
      setModal(true);
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
      
        const response = await confirmSeparated(selected.id);
       setResponseMessage(response.mensaje||response.error);
        setHasError(!!response.error);
        setModal(true) 
        handleAsignaciones();
       // console.log(response);
      }catch(e:any){
        setResponseMessage(e.message);
        setHasError(true);
        setModal(true);
        handleAsignaciones();
      //  console.log(e.message)
      }
  }

  async function HandleDelete(){
    try{
      
      const response = await deleteSeparated(selected.id);
        setResponseMessage(response.mensaje||response.error);
        setHasError(!!response.error);
        setModal(true)
        handleAsignaciones();
    //  console.log(response);
    }catch(e:any){
         setResponseMessage(e.message);
        setHasError(true);
        setModal(true);
        handleAsignaciones();
    // console.log(e.message)
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
    console.log("separated2 :",filteredArray)
    setSeparated2(filteredArray);
}
 

  return (
    <LinearGradient colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}>
        {/* Aquí puedes agregar contenido al header si es necesario */}
      </View>
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
            { separated2.length>0 && (
               separated2.map((obj,index)=>(
                <SeparatedCard
                key={index}
                info={obj}
                onCancel={(info)=>OpenConfirm(info,false)}
                onConfirm={(info)=> OpenConfirm(info,true)}
                />
              ))
            )
           }       

               { separated2.length===0 && (
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
