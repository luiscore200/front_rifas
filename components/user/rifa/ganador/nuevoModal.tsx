import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BackIcon, NextIcon, PrevIcon } from '../../../../assets/icons/userIcons';
import PremioCard from './premioCard';
import { rifa } from '../../../../config/Interfaces';
import ConfirmationModal from '../../../ConfirmModal';
import { updateWinner } from '../../../../services/api';
import ToastModal from '../../../toastModal';

interface GanadorModalProps {
  visible: boolean; 
  rifa:rifa;
  onClose: () => void;
  width?:any;
  onUpdate:(mensaje:string)=>void;
  index:number;
 
}

const GanadorModal: FC<GanadorModalProps> = ({ rifa,visible, index, width, onUpdate, onClose }) => {
  if (!visible) return null;


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 250;
  const totalPages = Math.ceil(Number(rifa.numeros)/ itemsPerPage);
  const [list,setList]=useState(false);
  const [lista,setLista]=useState<any[]>([]);
  const [open,setOpen]=useState(true);
  const [selectedPremio,setSelectedPremio]=useState<any>();
  const [selectedNumber,setSelectedNumber]=useState<any>();
  const cuadricula = 5;
  const maxHeight= width?500:  350;
  let totalNumbers = Number(rifa.numeros);

    const [premios,setPremios]=useState(rifa.premios);
    const [confirmation,setConfirmation]=useState(false);
    const [modal,setModal]=useState<boolean>(false);
    const [responseMessage,setResponseMessage]=useState<string>("");
    
 

  const verifyTouch = ()=>{
    if(list){
      setList(false);
    }else{
      onClose();
    }
  }


  const volver = ()=>{
    setSelectedNumber(null);
    setSelectedPremio(null);
    setOpen(false);
  }

  async function updatePremio(index:number,field:string,value:number){

   if(rifa.premios && rifa.id){
         
    const newPremios = [...rifa.premios];
  
    
    newPremios[index] = {
      ...newPremios[index],
      [field]: value.toString()
    };
    setPremios(newPremios); 
   // setOpen(false);
    setSelectedNumber(null);
    setSelectedPremio(null);
    

    try{
      const response=await updateWinner(rifa.id,newPremios,index);
 //     setResponseMessage(response.mensaje||response.error);
   //   setModal(true);
     console.log(response);
     if(response.mensaje){
      onUpdate(response.mensaje);
      

     }else{
        setResponseMessage(response.error);
        setModal(true);
      
     }
     
    }catch(e:any){
      setResponseMessage('ha ocurrido un error, verifica tu conexion');
      setModal(true);
    }
   
   }
    
  }
  

  const select= (number:number)=>{
        setSelectedNumber(number);
        setConfirmation(true);

  }
  
 
  useEffect(() => {
   const listDistance= 1000;
    const aa = [];
    for (let i = 0; i < totalNumbers; i += listDistance) {
      const page = Math.floor(i / itemsPerPage) + 1;
      aa.push({text:`${i + 1} - ${i + listDistance}`,page});
    }
    setLista(aa);
  }, [totalNumbers]);


const selectPremio = (index:number)=>{

    setSelectedPremio(index);
    setOpen(true);
}




  const renderCell = (number: number) => (
    <TouchableOpacity
      key={number}
      style={styles.cell}
      onPress={() =>  select(number)}
    >
      <Text style={styles.cellText}>{number}</Text>
    </TouchableOpacity>
  );

  


  const renderMatrix = (startNumber: number) => {
    const matrix = [];
    for (let i = 0; i < cuadricula; i++) {
      const rowNumbers = Array.from({ length: cuadricula }, (_, j) => startNumber + i * cuadricula + j).filter(num => num <= totalNumbers);
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
        top: 80,
        right: 80,
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
              onPress={() => {setList(false);setCurrentPage(obj.page);}}
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
  
   const renderPagination = () => (
    <View style={{    flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',marginBottom: 10,}}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(currentPage - 1)}
        style={[{  padding: 10,}, currentPage === 1 && {  opacity: 0.3,}]}
      >
        <PrevIcon style={{color:"#CCCCC"}}/>
      </TouchableOpacity>
     <TouchableOpacity onPress={()=>setList(!list)}>
      <Text style={{  fontSize: 16,}}>{`Página ${currentPage} de ${totalPages}`}</Text>
     </TouchableOpacity>
   
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage(currentPage + 1)}
        style={[{  padding: 10,}, currentPage === totalPages && {  opacity: 0.3,}]}
      >
         <NextIcon style={{color:'#CCCCC'}}/>
      </TouchableOpacity>
    </View>
  );


  const renderGrid = () => {
    const cols = totalNumbers>=1000? 4:2;
    const startNumber = (currentPage - 1) * itemsPerPage + 1;
    const maxNumber= startNumber + itemsPerPage -1;
    console.log(startNumber +" "+maxNumber);
    const grid = [];
    let number = startNumber;
    while (number <= maxNumber) {
      const row = [];
      for (let i = 0; i < cols && number <= maxNumber; i++) {
        row.push(renderMatrix(number));
        number += cuadricula * cuadricula;
      }
      grid.push(
        <View key={number} style={styles.gridRow}>
          {row}
        </View>
      );
    }
    return grid;
  };

  return (
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={verifyTouch}>
      <TouchableOpacity style={[styles.modalContent,{width}]} onPress={undefined} activeOpacity={1}>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:15, marginHorizontal:25}}>
           <View>
         {/*
             <TouchableOpacity onPress={()=>volver()} >
           
             <BackIcon style={{color:open?'black':'white'}}/>
             </TouchableOpacity>

           </View>
            <Text style={{fontWeight:'700'}}>{open?'ASIGNAR NUMERO':'ESCOGER PREMIO'}</Text> 
            <View>
            <TouchableOpacity onPress={()=>undefined} activeOpacity={1} >
           <NextIcon style={{color:'white'}}/>
           </TouchableOpacity>

*/}
            </View>
        </View>

        
        <View style={{ padding: 20 }}>
          {open && (
            <View>
              
                {renderPagination()}
              {!width && (
                  <ScrollView
                  showsHorizontalScrollIndicator={false} 
                  horizontal>
                  <ScrollView 
                    showsVerticalScrollIndicator={false} 
                  style={{ maxHeight: maxHeight, minHeight: maxHeight }}>
                  <View>
                      {renderGrid()}
                  </View>
                  </ScrollView>
              </ScrollView>
              )}
               {width && (
                  <View>
                  <View style={{ maxHeight: maxHeight, minHeight: maxHeight }}>
                  <View>
                      {renderGrid()}
                  </View>
                  </View>
              </View>
              )}
            </View>
          )

          }
          {!open && premios && (

        <View style={{height:maxHeight}}>
           



          <ScrollView >
          {
                     premios.length!==0 && (
                        premios.map((premio,index)=>( 
                            <PremioCard  
                            key={index} 
                            premio={premio}
                            onTouch={()=>selectPremio(index)}
                             />
                        )))
            }
          </ScrollView>
        </View>
         )  }
         
           {   premios && premios.length===0 && (
               <View  style={{marginHorizontal:10,alignItems:"center",marginTop:20}}>
                <Text>. . . No se han encontrado premios . . .</Text>
                </View>
            )
            
          


          }
           
                
      
       {/*
            <TouchableOpacity style={{
                marginHorizontal:10,backgroundColor: '#6366F1',paddingHorizontal: 16,paddingVertical: 10,borderRadius: 8, alignItems:'center'}} onPress={()=>{undefined}}>
                  <Text style={{color: '#FFFFFF',fontWeight: 'bold',}}>{'Confirmar'}</Text>
                </TouchableOpacity> */
       }
          <TouchableOpacity style={styles.closeButton} onPress={()=>{onClose()}}>
            <Text style={styles.closeButtonText}>{'Cerrar'}</Text>
          </TouchableOpacity>
            </View>
       
        {list && (<RenderListPaginations/>)
     }
           { (
          <ConfirmationModal
            visible={confirmation}
            mode="confirm"
            message="Por favor confirma tu eleccion"
            onCancel={ ()=>setConfirmation(false)}
            onClose={ ()=>setConfirmation(false)}
            onConfirm={()=>updatePremio(index,"ganador",selectedNumber)}
           
          
          />
        )}

        {(
             <ToastModal
                message={responseMessage}
                visible={modal}
                time={1000}
                blockTime={500}
                onClose={()=>setModal(false)}

        />

        )}
      </TouchableOpacity>
  
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  cellText: {
    color: '#000',
  },
  matrix: {
    margin: 10,
  },
  closeButton: {
marginHorizontal:10,backgroundColor: '#fff',paddingHorizontal: 16,paddingVertical: 10,borderRadius: 8, alignItems:'center',borderWidth:0,borderColor:'#6b7280',marginVertical:15
  },
  closeButtonText: {
    color: '#6b7280',
    fontWeight: '700',
  },
});

export default GanadorModal;
