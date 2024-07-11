import React, { useState, FC } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { StarIcon, StarIcon2 } from '../../../assets/icons/userIcons';

interface AssignedNumber {
  id: number;
  id_raffle: number;
  number: number;
  status: 'disponible' | 'pagado' | 'separado' ;
  id_purchaser: number | null;
}

interface RifaGridProps {
  totalNumbers: number;
  cuadricula:number;
  assignedNumbers: AssignedNumber[];
  maxHeight: number;
  price: number;
  premios:number[];
  onConfirmSelection: (selectedNumbers: number[]) => void;
}

const RifaGrid: FC<RifaGridProps> = ({ totalNumbers,cuadricula, assignedNumbers,premios, price, maxHeight, onConfirmSelection }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const toggleNumberSelection = (number: number): void => {
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
        onPress={() => toggleNumberSelection(number)}
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

  const renderGrid = () => {
    const grid = [];
    let number = 1;
    while (number <= totalNumbers) {
      const row = [];
      for (let i = 0; i < 5 && number <= totalNumbers; i++) {
        row.push(renderMatrix(number));
        number +=cuadricula*cuadricula;
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
    <View style={styles.container}>
     <View style={{paddingTop:5,paddingHorizontal:20}}>
     <ScrollView horizontal>
        <ScrollView style={{ maxHeight:maxHeight,minHeight:maxHeight }}>
          <View>
            {renderGrid()}
          </View>
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
          <Text style={[styles.selectedNumbersTitle, { flex: 3 }]}>Tus números</Text>
          <ScrollView style={ { flex: 7 }}  horizontal>
          <View style={[styles.selectedNumbers]}>
          
            {selectedNumbers.map(number => (
              <View key={number} style={styles.selectedNumber}>
                <Text style={styles.selectedNumberText}>{number}</Text>
              </View>
            ))}
           
          </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
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
    position:'relative',
    borderTopStartRadius:20,
    borderTopEndRadius:20,  
    borderWidth:0,
    shadowColor: '#000',
    shadowOffset: { width:0,height:-10 },
  
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  
    
    padding:10,
  
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
