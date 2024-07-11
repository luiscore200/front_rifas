import React, { FC } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface NumberGridModalProps {
  visible: boolean;
  touchable: boolean;
  totalNumbers: number;
  maxHeight: number;
  cuadricula: number;
  onSelectNumber: (number: number) => void;
  onClose: () => void;
}

const NumberGridModal: FC<NumberGridModalProps> = ({ visible, cuadricula, touchable, totalNumbers, maxHeight, onSelectNumber, onClose }) => {
  if (!visible) return null;

  const renderCell = (number: number) => (
    <TouchableOpacity
      key={number}
      style={styles.cell}
      onPress={() => touchable && onSelectNumber(number)}
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

  const renderGrid = () => {
    const grid = [];
    let number = 1;
    while (number <= totalNumbers) {
      const row = [];
      for (let i = 0; i < 5 && number <= totalNumbers; i++) {
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
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalContent}>
        <View style={{ padding: 20 }}>
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
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#6b7280',
    fontWeight: '700',
  },
});

export default NumberGridModal;
