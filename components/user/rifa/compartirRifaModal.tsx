import React, { FC, useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { memo } from 'react';

interface Comprador {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
}

interface CompartirModalProps {
  visible: boolean;
  compradores: Comprador[];
  onClose: () => void;
  onShared: (obj: number[]) => void;
}

const CompartirModal: FC<CompartirModalProps> = ({ visible, compradores, onShared, onClose }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [filter, setFilter] = useState<Comprador[]>(compradores);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    setFilter(compradores);
  }, [compradores]);

  const handlefilter = (value: string) => {
    setText(value);
    const filtroLowerCase = value.toLowerCase();

    const filteredArray = compradores.filter(obj => {
      const emailLowerCase = obj.email.toLowerCase();
      const nameLowerCase = obj.name.toLowerCase();
      const numberString = obj.phone.toString();

      return emailLowerCase.includes(filtroLowerCase) || nameLowerCase.includes(filtroLowerCase) || numberString.includes(filtroLowerCase);
    });

    setFilter(filteredArray);
  }

  const handleSelect = useCallback((id: number) => {
    setSelectedNumbers(prevSelectedNumbers =>
      prevSelectedNumbers.includes(id)
        ? prevSelectedNumbers.filter(number => number !== id)
        : [...prevSelectedNumbers, id]
    );
  }, []);

  const toggleNumbers = useCallback(() => {
    if (selectedNumbers.length === compradores.length) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers(compradores.map(comprador => comprador.id));
    }
  }, [selectedNumbers, compradores]);

  const renderItem = useCallback(({ item }: { item: Comprador }) => (
    <TouchableOpacity
      style={[
        styles.cell,
        { backgroundColor: selectedNumbers.includes(item.id) ? '#bbf7d0' : '#f5f5f5' }
      ]}
      onPress={() => handleSelect(item.id)}
    >
      <Text style={styles.cellText}>{item.name}</Text>
      <Text style={styles.cellSubText}>{item.email}</Text>
      <Text style={styles.cellSubText}>{item.phone}</Text>
    </TouchableOpacity>
  ), [selectedNumbers, handleSelect]);

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity activeOpacity={1} style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={text}
            onChangeText={handlefilter}
          />
          <TouchableOpacity style={styles.selectButton} onPress={toggleNumbers}>
            <Text style={styles.selectButtonText}>{selectedNumbers.length===compradores.length?"Desmarcar":"Marcar" }</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <FlatList
          data={filter}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => onShared(selectedNumbers)}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
    elevation: 5,
  },
  flatListContainer: {
    minHeight:300,
    padding: 20,
  },
  cell: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cellSubText: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor:"#cccc"
  },
  closeButtonText: {
    color:"#a1a1aa",
    fontWeight:'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal:20,
    marginTop:20,
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
  selectButton: {
    marginLeft: 8,
    alignItems:'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    width:110,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#6366F1',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default memo(CompartirModal);
