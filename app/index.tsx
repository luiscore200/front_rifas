import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View,TextInput, Alert, TouchableOpacity } from 'react-native';
import ButtonGradient from '../button';

import { router } from 'expo-router';
import { login as loginApi} from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../services/authContext2';
import { MaterialIcons } from '@expo/vector-icons';



export default function index() {

  const {login}=useAuth();
  const handleLogin = async () => {
  
    try {
      const data = await loginApi(email, password);
      console.log(data);
    const a=  await login(data);
    console.log(a);
     

    } catch (error:any) {
      console.log(error.message);
      alert(error.message);

    }
      //await saveLocalStorage(data);
    

      
    /*  router.navigate({
          pathname: '/[token]',
          params: { token: data.access_token },
        });
      */
    
   
  };


  
  
   const [email,setEmail]=useState("");
   const [password,setPassword]=useState("");
   const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
   
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
        <View style={styles.card}>
          <View style={styles.cardContent}>
                <View style={{padding:16}}>
            <View style={styles.inputContainer}>
          
              <Text style={styles.label}>Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="m@example.com"
                placeholderTextColor={"#cccc"}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="**********"
                    placeholderTextColor={"#cccc"}
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={setPassword}
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
              </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerText}>¿ Has olvidado tu contraseña ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={()=>router.navigate("/register")} >
              <Text style={styles.footerText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  },
  passwordToggle: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoIcon: {
    height: 48,
    width: 48,
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoDescription: {
    color: '#FFFFFF',
  },
  card: {
    paddingTop:10,
    backgroundColor: '#fff',
    borderRadius: 8,
    
  },
  cardContent: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
   
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 6,
    padding: 9,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
   
    alignItems:'center',
    backgroundColor: '#f1f1f1',
    height:50,
    borderColor:'#f1f1f1',
    borderBottomEndRadius:8,
    borderBottomStartRadius:8,
    borderBottomWidth:1
  },
  footerLink: {
    
  },
  footerText: {
    color: '#6366F1',
    fontSize: 15,
   
  },
});