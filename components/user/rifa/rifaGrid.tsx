import React, { useState, FC, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { NextIcon, PrevIcon, StarIcon, StarIcon2 } from '../../../assets/icons/userIcons';

interface AssignedNumber {
  id: number;
  id_raffle: number;
  number: number;
  status: 'disponible' | 'pagado' | 'separado' ;
  id_purchaser: number | null;
}

interface RifaGridProps {
  totalNumbers: number;
  
  assignedNumbers: AssignedNumber[];
  maxHeight: number;
  price: number;
  premios:number[];
  onConfirmSelection: (selectedNumbers: number[]) => void;
  touched?:()=>void;
}

const RifaGrid: FC<RifaGridProps> = ({ totalNumbers, assignedNumbers,premios, price, maxHeight, touched, onConfirmSelection }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const  itemsPerPage= 100;
  const cuadricula = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalNumbers / itemsPerPage);
  const [list,setList]=useState(false);
  const [lista,setLista]=useState<any[]>([]);

   
  useEffect(() => {
    const listDistance= 1000;
     const aa = [];
     for (let i = 0; i < totalNumbers; i += listDistance) {
       const page = Math.floor(i / itemsPerPage) + 1;
       aa.push({text:`${i + 1} - ${i + listDistance}`,page});
     }
     setLista(aa);
   }, [totalNumbers]);


  const toggleNumberSelection = (number: number): void => {
    if(list){setList(false)}
    setSelectedNumbers(prevSelected =>
      prevSelected.includes(number) ? prevSelected.filter(num => num !== number) : [...prevSelected, number]
    );
  };

  const getStatus = (number: number): 'disponible' | 'pagado' | 'separado'  => {
    const assigned = assignedNumbers.find(assigned => assigned.number === number);
    return assigned ? assigned.status : 'disponible';
  };

  const renderCell = (number: number) => {
    const isSelected = selectedNumbers.includes(number);
    const status = getStatus(number);
    const isBlocked = number > totalNumbers;
    let isWinner = false;
    let Npremio= 0;

    if(premios.length>0){
      premios.forEach((element,index) => {if(element===number){isWinner=true; Npremio=index+1;}});
    }

    let cellStyle = styles.cell;
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
        onPress={() => {toggleNumberSelection(number);if(touched){touched()}}}
        disabled={isBlocked || isWinner|| status !== 'disponible'}
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
        top: 55,
        right:90,
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
              onPress={() => {setList(false);setCurrentPage(obj.page);if(touched){touched()}}}
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
        onPress={() => {setCurrentPage(currentPage - 1);if(touched){touched()}}}
        style={[{  paddingHorizontal:30, padding: 10,}, currentPage === 1 && {  opacity: 0.3,}]}
      >
        <PrevIcon style={{color:"#6b7280"}}/>
      </TouchableOpacity>
     <TouchableOpacity onPress={()=>{setList(!list);if(touched){touched()}}}>
      <Text style={{  fontSize: 16,}}>{`Página ${currentPage} de ${totalPages}`}</Text>
     </TouchableOpacity>
   
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => {setCurrentPage(currentPage + 1);if(touched){touched()}}}
        style={[{  paddingHorizontal:30, padding: 10,}, currentPage === totalPages && {  opacity: 0.3,}]}
      >
         <NextIcon style={{color:'#6b7280'}}/>
      </TouchableOpacity>
    </View>
  );

  const ColumnGrid = () => {
    if (selectedNumbers.length === 0) {
      return null; // Retorna null si no hay elementos
    }
  
    const matrix = [];
    let i = 0;
  
    while (i < selectedNumbers.length) {
      const duo = selectedNumbers.slice(i, i + 2);
      matrix.push(
        <View key={i} style={{ flexDirection: 'column' }}>
          {duo.map((number, index) => (
            <TouchableOpacity activeOpacity={1} onPress={()=>{setList(false);if(touched){touched()}}} key={index} style={styles.selectedNumber}>
              <Text style={styles.selectedNumberText}>{number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
      i += 2;
    }
  
    return (
      <View style={{ flexDirection: 'row' }}>
        {matrix}
      </View>
    );
  };
  const renderGrid = () => {
    const startNumber = (currentPage - 1) * itemsPerPage + 1;
    const maxNumber= startNumber + itemsPerPage -1;
    console.log(startNumber +" "+maxNumber);
    const grid = [];
    let number = startNumber;
    while (number <= maxNumber) {
      const row = [];
      for (let i = 0; i < (Math.ceil(Math.sqrt(itemsPerPage))/5) && number <= maxNumber; i++) {
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
    <TouchableOpacity activeOpacity={1} onPress={()=>{setList(false);if(touched){touched()}}} style={styles.container}>
        {renderPagination()}
     <View style={{paddingTop:5,paddingHorizontal:20}}>
     <ScrollView horizontal  onTouchStart={()=>setList(false)}>
        <ScrollView style={{ height:maxHeight}} onTouchStart={()=>setList(false)}>
          <TouchableOpacity activeOpacity={1} onPress={()=>{list?setList(false):undefined;if(touched){touched()}}}>
            {renderGrid()
            }
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>
     </View>
      <View style={styles.selectedNumbersContainer}>
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
        
        <View style={styles.selectedNumbersRow}>
          <Text style={[styles.selectedNumbersTitle, { flex: 1 }]}>Tus números</Text>
             <ScrollView horizontal   style={{borderWidth:0,maxWidth:'60%'}}>
            <ColumnGrid/>
             </ScrollView>
        </View>
        <View style={styles.totalContainer}>
          <View>
            <Text>Precio total:</Text>
            <Text style={styles.totalPrice}>${price * selectedNumbers.length}</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirmSelection(selectedNumbers)}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {list && (<RenderListPaginations/>)

      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
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
    right:0,
    left:0,
    paddingVertical:20,
   
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
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

export default RifaGrid;
