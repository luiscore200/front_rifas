// UserCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { User } from '../../../config/Interfaces';


interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const getTextStatusColor = (status:any) => ( status == "Active" ? '#166534' : '#991b1b'); // Dynamic color based on status
  const getBGStatusColor = (status:any) => ( status == "Active" ? '#dcfce7' : '#fee2e2'); // Dynamic color based on status
 // const getStatus = (status:any) => ( status === 1 ? 'Active' : 'Inactive'); // Dynamic color based on status

  
  const toggleModal = () => { 
   // setModalVisible(!modalVisible);
   };

  const closeModal = () => { setModalVisible(false); };

  return (
    
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={[styles.userIcon, { backgroundColor: getTextStatusColor(user.status) }]}>
          <Text style={styles.userIconText}>{user.name.charAt(0)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={[styles.statusButton,{ backgroundColor: getBGStatusColor(user.status) }]}>
          <Text style={[styles.statusText,{color: getTextStatusColor(user.status)}]}>{user.status}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={toggleModal}>
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.menuOption} onPress={closeModal}>
                <Text style={styles.menuOptionText}>Actualizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuOption} onPress={closeModal}>
                <Text style={styles.menuOptionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 18,
  },
  statusButton: {
    paddingVertical:4,
    paddingHorizontal:8,
    borderRadius: 10,
   // backgroundColor: '#e0e0e0', // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
   // color: '#333', // Adjust as needed
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
  
    padding: 20,
  },
  menuOption: {
    paddingVertical: 10,
    alignItems: 'center',
 
  },
  menuOptionText: {
    fontSize: 16,
  },
});

export default UserCard;
