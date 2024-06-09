import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';


interface ResponseModalProps {
    message: string;
    visible: boolean;
    onClose: () => void;
  
  
    }

const ResponseModal:React.FC<ResponseModalProps> = ({ message, visible, onClose }) => {
    const [showModal, setShowModal] = useState(visible);

    const handleClose = () => {
        onClose();
    };

    
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ResponseModal;
