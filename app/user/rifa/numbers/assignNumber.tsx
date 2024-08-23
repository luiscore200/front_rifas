import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { rifaAssign } from "../../../../services/api";
import RifaGrid from "../../../../components/user/rifa/rifaGrid";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { rifa } from "../../../../config/Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import ToastModal from "../../../../components/toastModal";
import { useAuth } from "../../../../services/authContext2";
import GradientLayout from "../../../layout";


export default function Assign() {

  const {auth,logout}=useAuth();
  const navigationItems = [
    { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"),status:1 },
    { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
    { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
    { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
  ];

  const { id }: any = useLocalSearchParams<{ id: string }>();
  const [asignaciones, setAsignaciones] = useState<any | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const { rifa }: any = useLocalSearchParams<{ rifa: string }>();
  const [rifa2, setRifa2] = useState<rifa>();
  const [premios,setPremios]= useState<number[]>([])
  const [modal,setModal]=useState(false);
  const [responseMessage,setResponseMessage]=useState();
  const [hasError,setHasError]=useState(false);
  const [touchedOut,setTouchedOut]=useState<boolean>(false);

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
      const response = await rifaAssign(id);
      if(!!response.error){
        setResponseMessage(response.error);
        setHasError(true);
        setModal(true);

      }else{
        setAsignaciones(response);
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

  const handleConfirmSelection = (selected: number[]) => {
    
    setSelectedNumbers(selected);
    // Aquí puedes manejar el envío de los números seleccionados al servidor o cualquier otra lógica
    console.log('Números seleccionados confirmados:', selected);
    router.navigate({
      pathname:'user/rifa/numbers/assignClient',
      params:{id:id,rifa:rifa,number:JSON.stringify(selected)},
    });
  };

  return (
    <GradientLayout  navigationItems={navigationItems} hasDrawer={true} touchOut={touchedOut} touchedOut={()=>{setTouchedOut(false)}} >

    
      <View style={styles.gridContainer}>
        
          <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 20 }}>Escoja sus números</Text>
          <RifaGrid
            totalNumbers={rifa2 != undefined? Number(rifa2?.numeros):100}
            assignedNumbers={!!asignaciones ? asignaciones : []}
            maxHeight={400} // Ajusta el valor para usar un 70% de la altura de la pantalla
            onConfirmSelection={handleConfirmSelection}
            price={rifa2 != undefined ? rifa2?.precio : 0}
            premios={premios}
            touched={()=>setTouchedOut(true)}
          
          />
       
      </View>
      {(
             <ToastModal
             message={responseMessage == null ? '' : responseMessage}
             time={hasError? 3000:1500 }
             blockTime={1000}
             visible={modal}
             onClose={handleCloseModal}  
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
});
