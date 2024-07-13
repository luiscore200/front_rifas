import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

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

  if (!visible) return null;

  return (
    <View style={[styles.container, { pointerEvents: blockInteractions ? 'auto' : 'none' }]}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, colorScheme === 'light' ? styles.modalContainerDark : styles.modalContainerLight]}>
          <Text style={[styles.message, colorScheme === 'light' ? styles.messageDark : styles.messageLight]}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    marginBottom: 70,
    alignItems: 'center',
    elevation: 5,
    maxWidth:'80%',
  },
  modalContainerDark: {
    backgroundColor: '#333',
  },
  modalContainerLight: {
    backgroundColor: '#f0f0f0',
  },
  message: {
    fontSize: 16,
  },
  messageDark: {
    color: 'white',
  },
  messageLight: {
    color: 'black',
  },
});

export default ToastModal;
