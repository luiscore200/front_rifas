import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { NextIcon, PrevIcon } from '../../../../assets/icons/userIcons';

interface NumberGridModalProps {
  visible: boolean;

  totalNumbers: number;
 
  onSelectNumber: (number: number) => void;
  onClose: () => void;
}

const NumberGridModal: FC<NumberGridModalProps> = ({ visible,   totalNumbers,  onSelectNumber, onClose }) => {
  if (!visible) return null;


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 250;
  const totalPages = Math.ceil(totalNumbers / itemsPerPage);
  const [list,setList]=useState(false);
  const [lista,setLista]=useState<any[]>([]);
  const maxHeight=600;
  const cuadricula = 5;



  const verifyTouch = ()=>{
    if(list){
      setList(false);
    }else{
      onClose();
    }
  }

  const select= (number:number)=>{
    console.log(number);
     setList(false);
     onSelectNumber(number);

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

  const renderCell = (number: number) => (
    <TouchableOpacity
      key={number}
      style={styles.cell}
      onPress={() => select(number)}
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
      <View style={styles.modalContent}>

        
        <View style={{ padding: 20 }}>
          {renderPagination()}
          <ScrollView horizontal>
            <ScrollView style={{ maxHeight: maxHeight, minHeight: maxHeight }}>
              <View>
                {renderGrid()}
              </View>
            </ScrollView>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        {list && (<RenderListPaginations/>)
     }
      </View>
  
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#6b7280',
    fontWeight: '700',
  },
});

export default NumberGridModal;
