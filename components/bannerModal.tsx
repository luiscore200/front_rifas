import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

interface BannerModalProps {
  visible: boolean;
  imageUrl: string; // URL de la imagen para el banner
  onClose: () => void;
}

const BannerModal: React.FC<BannerModalProps> = ({ visible, imageUrl, onClose }) => {

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: imageUrl }} style={styles.bannerImage} resizeMode="cover" />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden', // Para asegurar que la imagen no se salga del contenedor
  },
  bannerImage: {
    width: '100%',
    height: 700, // Ajusta la altura de la imagen según sea necesario
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BannerModal;
