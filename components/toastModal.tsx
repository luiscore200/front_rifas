import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, useColorScheme } from 'react-native';

interface ToastModalProps {
  message: string;
  visible: boolean;
  time: number;
  onClose: () => void;
}

const ToastModal: React.FC<ToastModalProps> = ({ message, visible, time, onClose }) => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, time);

      return () => clearTimeout(timer);
    }
  }, [visible, time, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, colorScheme === 'light' && styles.modalContainerDark, colorScheme === 'dark' && styles.modalContainerLight]}>
          <Text style={[styles.message, colorScheme === 'light' && styles.messageDark, colorScheme === 'dark' && styles.messageLight]}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)', // Fondo semi-transparente
  },
  modalContainer: {
    backgroundColor: '#f0f0f0', // Gris claro suave
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    marginBottom: 70,
    alignItems: 'center',
    elevation: 5,
  },
  modalContainerDark: {
    backgroundColor: '#333', // Gris oscuro suave
  },
  modalContainerLight: {
    backgroundColor: 'white', // Blanco
  },
  message: {
    fontSize: 16,
    color: 'black', // Texto negro por defecto
  },
  messageDark: {
    color: 'white', // Texto blanco en light mode
  },
  messageLight: {
    color: 'black', // Texto negro en dark mode
  },
});

export default ToastModal;
