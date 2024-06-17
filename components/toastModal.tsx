import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, useColorScheme, TouchableWithoutFeedback } from 'react-native';

interface ToastModalProps {
  message: string;
  visible: boolean;
  time: number;
  blockTime: number;  // Nuevo parámetro para el tiempo de bloqueo
  onClose: () => void;
}

const ToastModal: React.FC<ToastModalProps> = ({ message, visible, time, blockTime, onClose }) => {
  const colorScheme = useColorScheme();
  const [blockInteractions, setBlockInteractions] = useState(true);

  useEffect(() => {
    if (visible) {
      // Bloquear interacciones inicialmente
      setBlockInteractions(true);

      // Desbloquear interacciones después del tiempo especificado en blockTime
      const unblockTimer = setTimeout(() => {
        setBlockInteractions(false);
      }, blockTime);

      // Cerrar el modal después del tiempo especificado en time
      const closeTimer = setTimeout(() => {
        onClose();
      }, time);

      return () => {
        clearTimeout(unblockTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [visible, time, blockTime, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      hardwareAccelerated
    >
      {blockInteractions ? (
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, colorScheme === 'light' ? styles.modalContainerDark : styles.modalContainerLight]}>
            <Text style={[styles.message, colorScheme === 'light' ? styles.messageDark : styles.messageLight]}>{message}</Text>
          </View>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground}>
            <View style={[styles.modalContainer, colorScheme === 'light' ? styles.modalContainerDark : styles.modalContainerLight]}>
              <Text style={[styles.message, colorScheme === 'light' ? styles.messageDark : styles.messageLight]}>{message}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent', // Fondo transparente para permitir interacción
  },
  modalContainer: {
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    marginBottom: 70,
    alignItems: 'center',
    elevation: 5,
  },
  modalContainerDark: {
    backgroundColor: '#333', // Gris oscuro suave para light mode
  },
  modalContainerLight: {
    backgroundColor: '#f0f0f0', // Gris claro suave para dark mode
  },
  message: {
    fontSize: 16,
  },
  messageDark: {
    color: 'white', // Texto blanco para fondo oscuro
  },
  messageLight: {
    color: 'black', // Texto negro para fondo claro
  },
});

export default ToastModal;
