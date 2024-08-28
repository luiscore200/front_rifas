import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { phoneCode } from '../../config/Interfaces';
import { Picker } from '@react-native-picker/picker';


import Updated from '../../components/responseModal';
import { userCreate as create, phoneCodeIndex } from '../../services/api';
import { registerValidationRules, validateForm } from '../../config/Validators';
import ToastModal from '../../components/toastModal';

const userCreate: React.FC = () => {
  interface Errors {email?: string;password?: string; name?:string,selectedCode?:string, phone?:string, domain?:string}
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState<phoneCode[]>([]);
  const [selectedCode,setSelectedCode]= useState('');
  const [phone,setPhone]=useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('password');
  const [isActive, setIsActive] = useState(true);
  const [payed,setPayed]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasError,setHasError]=useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<Errors>({});
  const [touchedFields, setTouchedFields] = useState({ name: false, domain: false, phone: false, selectedCode: false, email: false, password: false });
  const [responseIndexMessage,setResponseIndexMessage]=useState<string | null>(null);
  const [indexToast,setIndexToast]=useState(false);


/// actualiza los code

  useEffect(() => {
    handleCodePhone();
  }, []);
// actualiza pais cuando code cambia
  useEffect(() => {
    if (selectedCode) {
      const selectedCountry = phoneCode.find(item => item.code === selectedCode);
      setCountry(selectedCountry?.name || "");
      updatePhone(phone);
    }
  }, [selectedCode]);
// actualiza los errores en el inventario
  useEffect(() => {
    setErrors(validateForm({ name, domain, email, selectedCode, phone, password }, touchedFields,registerValidationRules));
  }, [name, domain, email, selectedCode, phone, password, touchedFields]);

///// atrapar y verificar codes
  const isCode = (item: any): item is phoneCode => {return item && typeof item.code === 'string' && typeof item.name === 'string';};
  
  const handleCodePhone = async () => {
    try{
      const data = await phoneCodeIndex();
      console.log(data);
      if(data.error){
        setResponseIndexMessage(data.error);
        setIndexToast(true);
        }
      
      if (Array.isArray(data) && data.every(isCode)) {
        setPhoneCode(data);
      } else {
        console.error('Los datos no son del tipo esperado: Code[]');
      }
    }catch(e:any){
      console.log(e);
      setResponseIndexMessage(e.message);
      setIndexToast(true);
    }
  };

//atrapar touchedsfields
  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  //atrapar touchedfields de phone input group
  const handleBlurPhoneAndCode = () => {
    setTouchedFields(prevState => ({
      ...prevState,
      phone: true,
      selectedCode: true
    }));
  };

  const updatePhone = (phone: string) => {
    setPhone(phone);
  };

  const handleSave = async () => {
    const newUser = { name, domain, phone, email, country, password, status: isActive ? 'Active' : 'Inactive',payed };
    console.log(newUser);

    setTouchedFields({ name: true, domain: true, phone: true, selectedCode: true, email: true, password: true });

    const formErrors = validateForm({ name, domain, email, selectedCode, phone, password }, { name: true, domain: true, phone: true, selectedCode: true, email: true, password: true }, registerValidationRules);
    
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {

      console.log('Registro exitoso:', newUser);
      try {
        const response:any = await create(newUser);
        setResponseMessage(response.mensaje || response.error);
        setHasError(!!response.error);
        setModalVisible(true);
      } catch (error:any) {
        setResponseMessage(error.message);
        setHasError(true);
        setModalVisible(true);
      } 
    } else {
      console.log('Formulario inválido:', formErrors);
      setResponseMessage('Por favor corrija el formulario');
      setHasError(true);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (!hasError) {
      router.replace('admin/dashboard')
    }
  };

  return (
    <LinearGradient colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.header}>
        
      </View>
      <ScrollView style={styles.main}>
        <View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('admin/dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Usuario</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              onBlur={() => handleBlur('name')}
              />
              {touchedFields.name && errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dominio</Text>
            <TextInput
              style={styles.input}
              value={domain}
              onChangeText={setDomain}
              onBlur={() => handleBlur('domain')}
              />
              {touchedFields.domain && errors.domain && <Text style={{ color: 'red' }}>{errors.domain}</Text>}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onBlur={() => handleBlur('email')}
              />
              {touchedFields.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
          </View>

          <View style={{ marginBottom: 32 }}>
                  <Text style={styles.label}>Telefono</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={selectedCode}
                          onValueChange={setSelectedCode}
                          onBlur={() => handleBlurPhoneAndCode()}
                          style={styles.picker}
                        >
                          {phoneCode.map((item, index) => (
                            <Picker.Item key={index} label={`${item.code} ${item.name}`} value={item.code} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.selectedCodeText, selectedCode === "" && styles.placeholderText]}>
                        {selectedCode === "" ? "(000)" : `(${selectedCode})`}
                      </Text>
                    </View>
                    <View style={{ flex: 6 }}>
                      <TextInput
                        style={styles.phoneInput}
                        keyboardType="numeric"
                        placeholder="3216540987"
                        placeholderTextColor={"#cccc"}
                        onChangeText={updatePhone}
                        onBlur={() => handleBlurPhoneAndCode()}
                      />
                    </View>
                  </View>
                  {touchedFields.phone && errors.phone && <Text style={{ color: 'red' }}>{errors.phone}</Text>}
                  {touchedFields.selectedCode && errors.selectedCode && <Text style={{ color: 'red' }}>{errors.selectedCode}</Text>}
                </View>


        
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              onBlur={() => handleBlur('password')}
              
            />
                   {touchedFields.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
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
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Suscrito</Text>
            <View style={styles.statusContainer}>
              <Switch
                value={payed}
                onValueChange={setPayed}
                trackColor={{ false: "#fee2e2", true: "#dcfce7" }}
                thumbColor={payed ? "#34D399" : "#EF4444"}
              />
              <Text style={[styles.statusText, { color: payed ? '#10B981' : '#EF4444' }]}>
                {payed ? 'Suscripted' : 'unSupcripted'}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/*modalVisible && (
        <Updated
          message={responseMessage == null ? '' : responseMessage}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )*/}
         {(
        <ToastModal
        message={responseMessage == null ? '' : responseMessage}
        time={hasError? 3000:1500 }
        blockTime={1000}
        visible={modalVisible}
        onClose={handleCloseModal}  
        />
  )}
   { (
        <ToastModal
        message={responseIndexMessage == null ? '' : responseIndexMessage}
        blockTime={1000}
        time={3000}
        visible={indexToast}
        onClose={()=>setIndexToast(false)}  
        />
  )

  }
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
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  backButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: 'black', textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { marginBottom: 8, color: 'black', fontWeight: 'bold' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 25,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    borderColor: "#ccc",
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  picker: {
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
  },
  placeholderText: {
    color: '#ccc',
  },
  selectedCodeText: {
    height: 40,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInput: {
    height: 40,
    width: '100%',
    paddingLeft: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
});

export default userCreate;
