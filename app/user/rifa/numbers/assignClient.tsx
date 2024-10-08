import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { rifa } from '../../../../config/Interfaces';
import { compradorValidationRules, validateForm } from '../../../../config/Validators';
import { cashInNequi, getNequiToken, validateClientAndAmount, createComprador,assignNumbers, main } from '../../../../services/api';
import ToastModal from '../../../../components/toastModal';
import { useAuth } from '../../../../services/authContext2';
import GradientLayout from '../../../layout';
import Database from '../../../../services/sqlite';


interface error {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
}
interface comprador {
    name: string;
    email: string;
    phone: string;
    document: string;
}

export default function AssignClient() {


    const {auth,user,logout,online,setOnline}=useAuth();
    const navigationItems = [
     { label: 'Inicio', action: () => router.push("/user/rifa/dashboard"),status:1 },
     { label: 'Suscripcion', action: () =>router.push('/user/suscripcion'),status:1},
      { label: 'Configuracion', action: () =>router.push('/user/userSettings'),status:1 },
      { label: 'Logout', action: async() => await logout(),status:auth===true?1:0},
    ];

    const { id }: any = useLocalSearchParams<{ id: string }>();
    const { number }: any = useLocalSearchParams<{ number: string }>();
    const [Numbers, setNumbers] = useState<number[]>([]);
    const { rifa }: any = useLocalSearchParams<{ rifa: string }>();
    const [rifa2, setRifa2] = useState<rifa>();
    const [error, setError] = useState<error>({});
    const [touched, setTouched] = useState({ name: false, email: false, phone: false, document: false });
    const [comprador, setComprador] = useState<comprador>({ name: "", email: "", phone: "", document: "" });
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('manual');
    const [hasError,setHasError]= useState(false);
    const [responseMessage,setResponseMessage]=useState<string>();
    const [modal,setModal]=useState(false);

    useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
    useEffect(() => { setNumbers(JSON.parse(number)) }, [number]);
    useEffect(() => { console.log(Numbers) }, [Numbers]);
    useEffect(() => { console.log(rifa2) }, [rifa2]);

    function change(field: any, value: any) {
        const updateData = { ...comprador, [field]: value };
        const updateTouched = { ...touched, [field]: true };
        setComprador(updateData);
        setTouched(updateTouched);
        const validate = validateForm(updateData, updateTouched, compradorValidationRules);
        setError(validate);
    }

    async function save() {
        setTouched({ name: true, email: true, phone: true, document: false });
        const errors = validateForm(comprador, { name: true, email: true, phone: true, document: false }, compradorValidationRules);
        console.log(errors);
        setError(errors);

        if (Object.keys(errors).length === 0) {
          //  console.log("formulario valido");
            setLoading(true);
            try {
                const create = await createComprador(comprador);
                if (!!create.error) { 
                  setHasError(true);
                  setResponseMessage(create.error);
                  setModal(true);
                } else {
                    !online? setOnline(true):undefined;
                  const assign = await assignNumbers(id,create.comprador.id,Numbers);
                  if(!!assign.error){
                    setHasError(true);
                    setResponseMessage(assign.error);
                    setModal(true);
                  }
                  if(!!assign.mensaje){
                    setHasError(false);
                    setResponseMessage(assign.mensaje);
                    setModal(true);
                  }
                  console.log(assign);
                 }

                setLoading(false);
            } catch (error:any) {
           
               // setHasError(true);
               // setResponseMessage(error.message);
              //  setModal(true);
           

                //verificar si comprador existe, si existe
                        //tomar el id y subirlo a la tabla "asignaciones_pendientes" (id rifa, id comprador, [numeros])
                //si no existe agregar a "compradores_pendientes", sera una replica de compradores, sin el id

                //cuando haya internet se ejecutara primero la consulta compradores_pendientes y luego asignaciones_pendientes

               
                if (Platform.OS !== 'web') {
                    const db = new Database();
                  const ee = await db.find('compradores',{email:comprador.email});
                  console.log("eee",ee);
                  if(ee.length===0){
                  
                     await db.insert('compradores',[{...comprador,local:1,id:-Date.now()}]);
                     const cr = await db.find('compradores',{local:1,email:comprador.email});
                     const query = Numbers.map(number => ({
                        id: -Date.now() - Math.floor(Math.random() * 1000), 
                        id_raffle: id,  
                        id_purchaser: cr[0].id,  
                        local: 1,  
                        status: 'separado',  
                        created_at:"",
                        number 
                    }));
                       await db.insert('asignaciones',query)
                     //  console.log("asignaciones locals",await db.find("asignaciones",{local:1}));
                  }else{
                    const query = Numbers.map(number => ({
                        id: -Date.now() - Math.floor(Math.random() * 1000), 
                        id_raffle: id,  
                        id_purchaser: ee[0].id,  
                        local: 1,  
                        status: 'separado',  
                        created_at:"",
                        number 
                    }));
                       await db.insert('asignaciones',query)
                     //  console.log("asignaciones locals",await db.find("asignaciones",{local:1}));

                  }
                  console.log('index compradores', await db.index('compradores'));
                  
              }
              setLoading(false);
              setResponseMessage('verifica tu conexion, datos guardados localmente');
              setModal(true);

            }

            

            
        } else {
            console.log("formulario invalido");
        }
    }


    function handleCloseModal(){
      setModal(false);
      if(!hasError){
        router.navigate({
          pathname: "/user/rifa/dashboard",
        
        });
      }
    }

    async function save2(){
              try{

const a= await  main();
        console.log(a);
      }catch(e:any){console.log(e.message)}
  
    }

    return (
        <GradientLayout  navigationItems={navigationItems} hasDrawer={true} >
            <ScrollView style={styles.main}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Asignar Comprador</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput style={styles.input} value={comprador.name} placeholderTextColor={"#cccc"} onBlur={() => change('name', comprador.name)} onChangeText={(text) => change('name', text)} placeholder="Ingrese el nombre" />
                        {touched.name && error.name && <Text style={{ color: 'red' }}>{error.name}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo</Text>
                        <TextInput style={styles.input} value={comprador.email} placeholderTextColor={"#cccc"} onBlur={() => change('email', comprador.email)} onChangeText={(text) => change('email', text)} placeholder="Ingrese el correo" keyboardType="email-address" />
                        {touched.email && error.email && <Text style={{ color: 'red' }}>{error.email}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono</Text>
                        <TextInput style={styles.input} value={comprador.phone} placeholderTextColor={"#cccc"} onBlur={() => change('phone', comprador.phone)} onChangeText={(text) => change('phone', text)} placeholder="Ingrese el teléfono +57 3210987654" keyboardType="phone-pad" />
                        {touched.phone && error.phone && <Text style={{ color: 'red' }}>{error.phone}</Text>}
                    </View>
{/*
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Documento</Text>
                        <TextInput style={styles.input} value={comprador.document} placeholderTextColor={"#cccc"} onBlur={() => change('document', comprador.document)} onChangeText={(text) => change('document', text)} placeholder="Ingrese el documento" keyboardType="numeric" />
                        {touched.document && error.document && <Text style={{ color: 'red' }}>{error.document}</Text>}
                    </View>
               
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Método de Pago</Text>
                        <Picker
                            selectedValue={paymentMethod}
                            onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)}
                            style={styles.picker}>
                            <Picker.Item label="Manual" value="manual" />
                            <Picker.Item label="Nequi" value="nequi" />
                        </Picker>
                    </View>
             */    }
                    <View style={styles.inputGroup}>
                        <TouchableOpacity style={styles.saveButton} disabled={loading} onPress={save}>
                            <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Validate'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
             
            </ScrollView>
            {(
             <ToastModal
             message={responseMessage == null ? '' : responseMessage}
             time={hasError? 3000:1500 }
             blockTime={1000}
             visible={modal}
             onClose={handleCloseModal}  
             />
                )}
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    formContainer: {
        padding: 16,
        marginHorizontal: 10,
        marginVertical: 20,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'black',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        color: 'black',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#FFFFFF',
    },
    picker: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
