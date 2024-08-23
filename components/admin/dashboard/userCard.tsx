import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { User } from '../../../config/Interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

interface UserCardProps {
  user: User|any;
  prueba?:boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user,prueba= false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const getTextStatusColor = (status: any) => (status == "Active" ? '#166534' : '#991b1b');
  const getBGStatusColor = (status: any) => (status == "Active" ? '#dcfce7' : '#fee2e2');
  const ShimmerPlacerholder = createShimmerPlaceholder(LinearGradient);
  

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
      {!prueba && (
          <View style={styles.cardContent}>
          <View style={[styles.userIcon, { backgroundColor: getTextStatusColor(user.status) }]}>
            <Text style={styles.userIconText}>{user.name.charAt(0)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={[styles.statusButton, { backgroundColor: getBGStatusColor(user.status) }]}>
            <Text style={[styles.statusText, { color: getTextStatusColor(user.status) }]}>{user.status}</Text>
          </View>
         {// <TouchableOpacity style={styles.menuButton} ><Text style={styles.menuButtonText}>⋮</Text></TouchableOpacity>
}</View>
      )}
           {prueba && (
          <View style={[styles.cardContent,{marginRight:10}]}>
           <ShimmerPlacerholder style={{ width:45,borderRadius:20,backgroundColor:"#cbd5e1",height:45,marginBottom:5 }} ></ShimmerPlacerholder>
          <View style={[styles.userInfo,{marginLeft:15}]}>
          <ShimmerPlacerholder style={{ width:110,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
          <ShimmerPlacerholder style={{ width:130,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
          </View>
          <ShimmerPlacerholder style={{ width:70,borderRadius:15,backgroundColor:"#cbd5e1",height:27,marginBottom:5 }} ></ShimmerPlacerholder>
 </View>
      )}
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
   // transition: 'all 0.3s ease',
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
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#888',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
