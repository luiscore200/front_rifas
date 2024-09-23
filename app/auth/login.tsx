import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,TextInput, Alert, TouchableOpacity , useWindowDimensions } from 'react-native';
import ButtonGradient from '../../button';

import { router } from 'expo-router';
import { login as loginApi} from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../services/authContext2';
import { MaterialIcons } from '@expo/vector-icons';
import { loginValidationRules, validateForm } from '../../config/Validators';
import ToastModal from '../../components/toastModal';
import { getStorageItemAsync } from '../../services/storage';
import BannerModal from '../../components/bannerModal';





interface Errors {email?: string;password?: string;}



export default function index() {
 

  
  const [config,setConfig]=useState<any>(null);
  const {login}=useAuth();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touchedFields, setTouchedFields] = useState({email: false, password: false });
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [toast,setToast]=useState(false);
  const [banner,setBanner]=useState<string>("");
  const [bannerVisible,setBannerVisible]=useState(false);
  const { width, height } = useWindowDimensions();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isXLargeScreen, setIsXLargeScreen] = useState(false);
  useEffect(() => {
    setIsSmallScreen(width < 360);
    setIsMediumScreen(width >= 360 && width < 768);
    setIsLargeScreen(width >= 768 && width < 1024);
    setIsXLargeScreen(width >= 1024);
  }, [width]);



const handleConfig = async ()=>{
  const conf = await getStorageItemAsync("general_config");
  console.log(conf);
  setConfig(conf?JSON.parse(conf):null);

}
useEffect(()=>{handleConfig()},[]);
useEffect(()=>{
setTimeout(() => {
  if(config){
    setBanner(config.banner_1);
    setBannerVisible(true);
   }
}, 1000);
},[config]);
    
  useEffect(() => {
    setErrors(validateForm({ email, password }, touchedFields,loginValidationRules));
  }, [ email, password, touchedFields]);

  const handleBlur = (fieldName: string) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
  };

  const handleLogin = async () => {
    setTouchedFields({  email: true, password: true });
    const formErrors = validateForm({  email, password }, touchedFields, loginValidationRules);


    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await loginApi(email, password);
        
    
      
     if(response.mensaje){
     
      setResponseMessage(response.mensaje);
      setHasError(false);
      setToast(true);
      const a=  await login(response);
      if(response.user.role==="user"){router.replace('user/rifa/dashboard');}
      if(response.user.role==="admin"){router.replace('admin/dashboard'); }
     }else{
      setResponseMessage(response.error);
      setHasError(true);
      setToast(true);
     
     }
  
      } catch (error:any) {
        console.log(error.message);
        setResponseMessage(error.message);
        setToast(true);
      
      }
    
      /*  router.navigate({
            pathname: '/[token]',
            params: { token: data.access_token },
          });
        */ 

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



   
   return (
    <LinearGradient
    colors={['#6366F1', '#BA5CDE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          
          <Text style={styles.logoText}>{config?config.app_name:"MegaWIN"}</Text>
          <Text style={styles.logoDescription}>App de rifas digitales</Text>
        </View>
        <View style={[styles.card,
             isSmallScreen && {width:'90%'},
             isMediumScreen && { width:'90%'},
             isLargeScreen && { width:'40%' },
             isXLargeScreen && {width:'30%'},
        ]}>
          <View style={styles.cardContent}>
                <View style={{padding:16}}>
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
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="**********"
                    placeholderTextColor={"#cccc"}
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerText}>¿ Has olvidado tu contraseña ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={()=>router.navigate("auth/register")} >
              <Text style={styles.footerText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      { (
        <ToastModal
        message={responseMessage == null ? '' : responseMessage}
        time={1000}
        blockTime={1000}
        visible={toast}
        onClose={handleToast}  
        />
  )
  }
        {banner!=="" && (
   
        <BannerModal visible={bannerVisible} width={isLargeScreen?'40%':isXLargeScreen?'30%':undefined}
         imageUrl={banner} onClose={()=>setBannerVisible(false)}/>
     
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
    alignItems:'center',
  
    
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