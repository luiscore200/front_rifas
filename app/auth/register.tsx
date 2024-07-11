import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity, ScrollView, KeyboardAvoidingView,Platform } from 'react-native';
import { router } from 'expo-router';
import {  phoneCodeIndex, register } from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../services/authContext2';
import { phoneCode as code } from '../../config/Interfaces';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { validateForm,registerValidationRules } from '../../config/Validators';

import ToastModal from '../../components/toastModal';



export default function Register() {
  const {login}=useAuth();
  interface Errors {email?: string;password?: string; name?:string,selectedCode?:string, phone?:string, domain?:string}
  const [phoneCode, setPhoneCode] = useState<code[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touchedFields, setTouchedFields] = useState({ name: false, domain: false, phone: false, selectedCode: false, email: false, password: false });
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [toast,setToast]=useState(false);
  const [responseIndexMessage,setResponseIndexMessage]=useState<string | null>(null);
  const [indexToast,setIndexToast]=useState(false);


  useEffect(() => {
    handleCodePhone();
  }, []);


  useEffect(() => {
    if (selectedCode) {
      const selectedCountry = phoneCode.find(item => item.code === selectedCode);
      setCountry(selectedCountry?.name || "");
      updatePhone(phone);
    }
  }, [selectedCode]);

  useEffect(() => {
    setErrors(validateForm({ name, domain, email, selectedCode, phone, password }, touchedFields,registerValidationRules));
  }, [name, domain, email, selectedCode, phone, password, touchedFields]);

  const handleBlur = (fieldName: string) => {
  
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };
////////// validacion de array de codigos 
  const isCode = (item: any): item is code => {return item && typeof item.id === 'number' && typeof item.name === 'string';};
  
  const handleCodePhone = async () => {
   try{
    const data = await phoneCodeIndex();
    if(data.error){
      setResponseIndexMessage(data.error);
      setIndexToast(true);
       }
    
    if (Array.isArray(data) && data.every(isCode)) {
      setPhoneCode(data);
    } else {
      console.log('Los datos no son del tipo esperado: Code[]');
    }
   }catch(e:any){
    console.log(e);
    setResponseIndexMessage(e.message);
    setIndexToast(true);
   }
  };
  /////////
  

  const handleRegister = async () => {
 //   showToast("aaaa","short");
  
    setTouchedFields({ name: true, domain: true, phone: true, selectedCode: true, email: true, password: true });
    const formErrors = validateForm({ name, domain, email, selectedCode, phone, password }, { name: true, domain: true, phone: true, selectedCode: true, email: true, password: true }, registerValidationRules);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const userData = {
        name,
        domain,
        phone,
        email,
        country,
        password,
      };

  try{
        
    const response = await register(userData);
    const a=  await login(response);
    setResponseMessage(response.mensaje || response.error);
    setHasError(!!response.error);
    setToast(!toast);
  }catch(e:any){
    setResponseMessage(e.message);
    setHasError(true);
    setToast(true);
  }
      
     // responseToast(response.mensaje, response.error);
    } else {
      console.log('Formulario inválido:', formErrors);
    }
  };


  function handleToast(){
    setToast(!toast);
    if(!hasError){
      setTimeout(() => {
        router.replace('user/rifa/dashboard');
      }, 1000); // Espera de 5 segundos (5000 milisegundos)
    }
  }

  

  



  const updatePhone = (phone: string) => {
    setPhone(phone);
  };

  const handleBlurPhoneAndCode = () => {
    setTouchedFields(prevState => ({
      ...prevState,
      phone: true,
      selectedCode: true
    }));
  };

  return (
    <LinearGradient
      colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>megaWIN</Text>
          <Text style={styles.logoDescription}>App de rifas digitales</Text>
        </View>
        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.cardContent}>
              <View style={{ padding: 16 }}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese su nombre"
                    placeholderTextColor={"#cccc"}
                    onChangeText={setName}
                    onBlur={() => handleBlur('name')}
                  />
                  {touchedFields.name && errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Dominio</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="miNegocio"
                    placeholderTextColor={"#cccc"}
                    onChangeText={setDomain}
                    onBlur={() => handleBlur('domain')}
                  />
                  {touchedFields.domain && errors.domain && <Text style={{ color: 'red' }}>{errors.domain}</Text>}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Correo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="m@example.com"
                    placeholderTextColor={"#cccc"}
                    onChangeText={setEmail}
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
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="**********"
                      placeholderTextColor={"#cccc"}
                      value={password}
                      secureTextEntry={!isPasswordVisible}
                      onChangeText={setPassword}
                      onBlur={() => handleBlur('password')}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <MaterialIcons
                        name={isPasswordVisible ? "visibility" : "visibility-off"}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                  {touchedFields.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.footerLink}>
                <Text style={styles.footerText}></Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerLink} onPress={() => router.navigate("auth/login")}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
     
  { (
        <ToastModal
        message={responseMessage == null ? '' : responseMessage}
        blockTime={500}
        time={2000}
        visible={toast}
        onClose={handleToast}  
        />
  )

  }
   { (
        <ToastModal
        message={responseIndexMessage == null ? '' : responseIndexMessage}
        blockTime={1000}
        time={2000}
        visible={indexToast}
        onClose={()=>setIndexToast(false)}  
        />
  )

  }
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 60,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoDescription: {
    color: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  cardContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomRightRadius:0,
    borderBottomLeftRadius:0,
    padding: 16,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
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
  placeholderText: {
    color: '#ccc',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    height: 50,
    borderColor: '#f1f1f1',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    borderBottomWidth: 1,
  },
  footerLink: {
    position: 'absolute',
    right: 15,
  },
  footerText: {
    color: '#6366F1',
    fontSize: 15,
  },
});

