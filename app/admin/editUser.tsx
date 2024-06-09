import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userUpate } from '../../services/api';
import Updated from '../../components/responseModal';





// Definición del tipo de usuario (ajustar según tus necesidades)


const EditUser: React.FC = () => {
  // Usar useLocalSearchParams para obtener el parámetro de usuario completo
  const {user}:any = useLocalSearchParams<{user:string}>();
  const user1= JSON.parse(user);
//console.log(user1);
 // const user = JSON.parse(user1);

//const user1=   {  id:1,name: 'John Doe',email: 'john@example.com',status: 'Active',};


  const [name, setName] = useState(user1.name);
  const [domain, setDomain] = useState(user1.domain);
  const [email, setEmail] = useState(user1.email);
  const [country, setCountry] = useState(user1.country);
  const [status, setStatus] = useState(user1.status);
  const [isActive, setIsActive] = useState(user1.status === 'Active');
  const [modalVisible, setModalVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string|null>(null);
  const [hasError, setHasError] = useState(false);

  
  const handleSave = async () => {
    const updatedUser = { ...user1, name, domain, email, country, status: isActive ? 'Active' : 'Inactive' };
    try {
      const aa = await userUpate(updatedUser);
      setResponseMessage(aa.mensaje || aa.error);
      setHasError(!!aa.error);
      setModalVisible(true);
    } catch (error) {
      setResponseMessage('An error occurred');
      setHasError(true);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (!hasError) {
      router.back();
    }
  };

  return (
    <LinearGradient colors={['#6366F1', '#BA5CDE']} 
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}>
      <View style={styles.header}>
  {/*} <TouchableOpacity onPress={() => {}}>
        <Text style={styles.backButton}>Back</Text>
  </TouchableOpacity> */}

  

      </View>
    

      <ScrollView style={styles.main}>

          
      <View >
      <TouchableOpacity style={styles.backButton} onPress={() => {router.back()}}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Editar Usuario</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Dominio</Text>
            <TextInput
              style={styles.input}
              value={domain}
              onChangeText={setDomain}
             
            />
          </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Pais</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />
          </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.statusContainer}>
          <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={isActive ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#EF4444' }]}>
                {isActive ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
        </View>
        <View style={styles.inputGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          {/* Ajustar botones según la lógica de navegación */}
        </View>

        </View>
      </ScrollView>
      {modalVisible && (
        <Updated
          message={responseMessage==null? '': responseMessage }
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  main: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  backButton: {
  
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#CCCCCC',
    borderRadius: 10,
  
    marginTop:20,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  backButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
 
  container: {
    flex: 1,
  },
  formContainer: { padding: 16, marginHorizontal:10, marginVertical:20, paddingVertical:20, borderWidth:1,borderColor:"#CCCCCC", borderRadius:10},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: 'black', textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8, color: 'black', fontWeight: 'bold' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, backgroundColor: '#FFFFFF', },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#6366F1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 ,marginTop:25, },
  cancelButton: { backgroundColor: '#EF4444', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
});

export default EditUser;