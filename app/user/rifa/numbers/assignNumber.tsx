import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { rifaAssign } from "../../../../services/api";
import RifaGrid from "../../../../components/user/rifa/rifaGrid";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { rifa } from "../../../../config/Interfaces";
import { LinearGradient } from "expo-linear-gradient";
import ToastModal from "../../../../components/toastModal";


export default function Assign() {
  const { id }: any = useLocalSearchParams<{ id: string }>();
  const [asignaciones, setAsignaciones] = useState<any | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const { rifa }: any = useLocalSearchParams<{ rifa: string }>();
  const [rifa2, setRifa2] = useState<rifa>();
  const [modal,setModal]=useState(false);
  const [responseMessage,setResponseMessage]=useState();
  const [hasError,setHasError]=useState(false);

  useEffect(() => { handleAsignaciones() }, [id]);
  useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
  useEffect(() => { console.log(rifa2) }, [rifa2]);
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
    <LinearGradient colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}>
        {/* Aquí puedes agregar contenido al header si es necesario */}
      </View>
      <View style={styles.gridContainer}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 20 }}>Escoja sus números</Text>
          <RifaGrid
            totalNumbers={rifa2 != undefined ? Number(rifa2.numeros) : 100}
            assignedNumbers={!!asignaciones ? asignaciones : []}
            maxHeight={Dimensions.get('window').height * 0.6} // Ajusta el valor para usar un 70% de la altura de la pantalla
            onConfirmSelection={handleConfirmSelection}
            price={rifa2 != undefined ? rifa2?.precio : 0}
            cuadricula={7}
          />
        </View>
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
});
