import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { phoneCode, rifa } from '../../../../config/Interfaces';
import { compradorValidationRules, validateForm } from '../../../../config/Validators';
import { cashInNequi, getNequiToken, validateClientAndAmount, createComprador,assignNumbers, main, indexComprador, phoneCodeIndex, forcedAssign } from '../../../../services/api';
import ToastModal from '../../../../components/toastModal';
import { useAuth } from '../../../../services/authContext2';
import GradientLayout from '../../../layout';
import Database from '../../../../services/sqlite';
import FormReutilizableModal from '../../../../components/selectReutilizable';



interface error {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    selectedCode?:string;
}
interface comprador {
    name: string;
    email: string;
    phone: string;
    document: string;
}

export default function AssignClient() {


    const {auth,user,logout,online,setOnline,codigos,setCodigos}=useAuth();
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
    const [touched, setTouched] = useState({ name: false, email: false, phone: false,selectedCode:false, document: false });
    const [comprador, setComprador] = useState<any>({ name: "", email: "", phone: "", document: "",selectedCode:'' });
    const [pagado,setPagado]= useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [hasError,setHasError]= useState(false);
    const [responseMessage,setResponseMessage]=useState<string>();
    const [modal,setModal]=useState(false);
    const [compradores2,setCompradores2]=useState<any>([]);
    const [compradores,setCompradores]=useState<any>([]);
    const [buscar,setBuscar]=useState<string>("");
    const db = new Database();
    const [crear,setCrear]=useState(false);
    const [phoneCode,setPhoneCode]=useState<phoneCode[]>([]);
    const [confirmEstado,setConfirmEstado]=useState(false); 
    const [selectedId,setSelectedId]=useState<any>(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isXLargeScreen, setIsXLargeScreen] = useState(false);
    
    useEffect(() => { setRifa2(JSON.parse(rifa)) }, [rifa]);
    useEffect(() => { setNumbers(JSON.parse(number)) }, [number]);
    useEffect(() => { console.log(Numbers) }, [Numbers]);
    useEffect(() => { console.log(rifa2) }, [rifa2]);
    useEffect(() => { handle();handleCodePhone() }, []);
    useEffect(() => {
        setTouched({ name: false, email: false, phone: false,selectedCode:false, document: false } );
        setComprador({ name: "", email: "", phone: "", document: "",selectedCode:'' });
    }, [crear]);



    function change(field: string, value: any) {
        const updateData = { ...comprador, [field]: value };
        const updateTouched = { ...touched, [field]: true };
      
        // Si field es selectedCode o phone, asegurarse de que ambos estén marcados como tocados
        if (field === 'selectedCode' || field === 'phone') {
          updateTouched['selectedCode'] = true;
          updateTouched['phone'] = true;
        }
      
        setComprador(updateData);
        setTouched(updateTouched);
        console.log(updateData);
      
        const validate = validateForm(updateData, updateTouched, compradorValidationRules);
        setError(validate);
      }
      
    

    async function handle (){
            try {
                const response = await indexComprador();
                if(response.compradores) {

                    if(Platform.OS !=='web'){

                        const ee  = await db.find('compradores',{deleted:0,local:1});
                        const  all = ee.concat(response.compradores);
                        setCompradores(all);
                        setCompradores2(all);
                    }else{
                        setCompradores(response.compradores);
                        setCompradores2(response.compradores);
                        console.log(response.compradores)
                    }

                }
            } catch (error) {
                try {
                    const ee  = await db.find('compradores',{deleted:0});
                    setCompradores(ee);
                    setCompradores2(ee);
                    setResponseMessage("datos cargados localmente, revisa tu conexion");
                    setModal(true);
                    
                } catch (error) {
                    
                }
            }
    }

    const isCode = (item: any): item is phoneCode => {return item && typeof item.code === 'string' && typeof item.name === 'string';};
  
    const handleCodePhone = async () => {
     if(codigos.length===0){
        if(Platform.OS==='web'){

            try{
                const data = await phoneCodeIndex();
               // console.log(data);
                if(data.error){
                  setResponseMessage(data.error);
                   setModal(true);
                   }
                
                if (Array.isArray(data) && data.every(isCode)) {
          
                  console.log(data);
                  setPhoneCode(data);
                } else {
                  console.log('Los datos no son del tipo esperado: Code[]');
                }
               }catch(e:any){
                console.log(e);
                setResponseMessage("error al obtener datos, verifica tu conexion");
                setModal(true);
               }
        }
        if(Platform.OS==='android'||Platform.OS==='ios'){
            try{
                const data = await phoneCodeIndex();
               // console.log(data);
                if(data.error){
                  setResponseMessage(data.error);
                   setModal(true);
                   }
                
                if (Array.isArray(data) && data.every(isCode)) {
          
                  console.log(data);
                  setPhoneCode(data);
                  setCodigos(data);
                  await db.insert('codigos',data);
                } else {
                  console.log('Los datos no son del tipo esperado: Code[]');
                }
               }catch(e:any){
                console.log(e);
                setResponseMessage("error al obtener datos, verifica tu conexion");
                setModal(true);
               }

        }
     }else{
        setPhoneCode(codigos);

     }
    };

    async function save(especifico:any,pagado:boolean,crear:boolean) {
      setHasError(false);
      //console.log('especifico',especifico);
      //  console.log('pagado',pagado);
      //  console.log('crear',crear);
       if(crear){

        //si se crea un nuevo usuario
        setTouched({ name: true, email: true, phone: true, selectedCode: true, document: false });
        const errors = validateForm(comprador, { name: true, email: true, phone: true, selectedCode: true, document: false }, compradorValidationRules);
        console.log(errors);
        setError(errors);
    
            const value = comprador.selectedCode+ " "+comprador.phone;
            const form = {name:comprador.name,email:comprador.email,document:comprador.document,phone:value};
    
            if (Object.keys(errors).length === 0) {
              //si el fomulario es valido
                setLoading(true);
                try {
                  const create = await createComprador(form);
                  if (!!create.error) { 
                    setHasError(true);
                    setResponseMessage(create.error);
                    setModal(true);
                    return;
                  }
                    //si no hubo error al crear
                  if(!pagado){
                    //si el estado es separado
                    const assign = await assignNumbers(id,create.comprador.id,Numbers);
                    !online? setOnline(true):undefined;
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


                  }else {
                       //si el estado es pagado
                      const promises =  Numbers.map( async(obj)=>{

                        const a = await forcedAssign(id,create.comprador.id,"pagado",obj);
                        if(a.error){ 
                          setHasError(true);
                          setResponseMessage(a.error);
                          setModal(true);
                          }
                      });
                      await Promise.all(promises);
                     if(!hasError){
                      setResponseMessage("asignaciones agregadas con exito");
                      setModal(true);                      
                     }
                     }
    
                    setLoading(false);




                } catch (error:any) {
               
    
                   
                    if (Platform.OS !== 'web') {
                        const db = new Database();
                      const ee = await db.find('compradores',{email:comprador.email});
                      console.log("eee",ee);
                      if(ee.length===0){
                       
                         await db.insert('compradores',[{form,local:1,id:-Date.now()}]);
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
    
                
    
                
            } 
       }else{
        //esta es una separacion completa del metodo segun si se ha elegido crear o se ha seleccionado un numero de la lista
        //si no se crea un nuevo usuario y se selecciona de la lista
        
        try {
         
            if(especifico>=0){
              //si el id no es local
              

                  if(!pagado){
                    //si el id no es local y el estado es separado
                          const assign = await assignNumbers(id,especifico,Numbers);
                          !online? setOnline(true):undefined;
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


                  }else {
                       //si el estado es pagado 
                        const promises =  Numbers.map( async(obj)=>{

                          const a = await forcedAssign(id,especifico,"pagado",obj);
                         
                          console.log('obj',obj);
                          if(a.error){ 
                            setHasError(true);
                            setResponseMessage(a.error);
                            console.log('error en la promesa no crear y pagado',a.error);
                            setModal(true);
                            }
                        });
                        await Promise.all(promises);
                      if(!hasError){
                        setResponseMessage("asignaciones agregadas con exito");
                        setModal(true);                      
                      }
                   }
                   setLoading(false);
            }else{
              //si el id es local
              
                    if(Platform.OS==='android'||Platform.OS==='ios'){
                        const query = Numbers.map(number => ({
                            id: -Date.now() - Math.floor(Math.random() * 1000), 
                            id_raffle: id,  
                            id_purchaser: especifico,  
                            local: 1,  
                            status: 'separado',  
                            created_at:"",
                            number 
                        }));
                           await db.insert('asignaciones',query);

                           setResponseMessage('datos guardados localmente, verifica tu conexion');
                           setModal(true);

                    }


            }
            
        } catch (error) {

            if(Platform.OS==='android'||Platform.OS==='ios'){
                const query = Numbers.map(number => ({
                    id: -Date.now() - Math.floor(Math.random() * 1000), 
                    id_raffle: id,  
                    id_purchaser: especifico,  
                    local: 1,  
                    status: 'separado',  
                    created_at:"",
                    number 
                }));
                   await db.insert('asignaciones',query);
                   setResponseMessage('datos guardados localmente, verifica tu conexion');
                   setModal(true);

            }else{

                setResponseMessage('error al asignar, verifica tu conexion');
                setModal(true);
            }
            
        }

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

    

  


    
    function find(value:string) {
        setBuscar(value);
    
      const filtroLowerCase = value.toLowerCase();
    
      const filteredArray = compradores2.filter((obj:any) => {
          const emailLowerCase = obj.email.toLowerCase();
          const nameLowerCase = obj.phone.toLowerCase();
          const numberString = obj.name.toString();
  
          return emailLowerCase.includes(filtroLowerCase)|| nameLowerCase.includes(filtroLowerCase) || numberString.includes(filtroLowerCase);
      });
  
      // Actualiza el array separated2 con los resultados filtrados
     
      setCompradores(filteredArray);
    
    }

    const Item = (props:any)=>{
            return(
                    <View>
                        <TouchableOpacity
                            style={[
                                styles.cell, selectedId!==null && selectedId===props.item.id?{backgroundColor: '#bbf7d0' }:{}
                                
                            ]}
                            onPress={() => {setSelectedId(props.item.id);setConfirmEstado(true)}}
                            >
                            <Text style={styles.cellText}>{props.item.name}</Text>
                            <Text style={styles.cellSubText}>{props.item.email}</Text>
                            <Text style={styles.cellSubText}>{props.item.phone}</Text>
                        </TouchableOpacity>
                    </View>
            );

    }

    const ejecutar =(pagado:boolean)=>{
      setConfirmEstado(false);
      setPagado(pagado);
      save(selectedId,pagado,false);

    }



    return (
        <GradientLayout  navigationItems={navigationItems} hasDrawer={true} size={(a,b,c,d)=>{setIsSmallScreen(a);setIsMediumScreen(b);setIsLargeScreen(c);setIsXLargeScreen(d)}}>
            <View style={styles.main}>
            <View style={[styles.searchContainer,
               isSmallScreen && { width:'90%' },
               isMediumScreen && { width:'90%' },
               isLargeScreen && { width:'40%' },
               isXLargeScreen && {width:'40%'},
            ]}>
                <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={buscar}
            onChangeText={find}
          />
          <TouchableOpacity style={styles.addButton}  onPress={()=>setCrear(true)}>
            <Text style={styles.addButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>
        
                    {!crear &&(
                   
                    
                        <ScrollView  
                        showsVerticalScrollIndicator={false}
                        style={[{},
                          isSmallScreen && { width:'95%' },
                          isMediumScreen && { width:'95%' },
                          isLargeScreen && { width:'40%' },
                          isXLargeScreen && {width:'40%'},
                        ]}>
                        {
                            compradores.map((obj: any, index: any) => {
                                return <Item key={index} item={obj} />;
                            })
                        }
                        </ScrollView>)
                    }
                
            
                    {crear && (

<View style={[styles.formContainer,
    isSmallScreen && { width:'95%' },
    isMediumScreen && { width:'95%' },
    isLargeScreen && { width:'40%' },
    isXLargeScreen && {width:'40%'},
]}>

  

              
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
  <Text style={styles.label}>Telefono</Text>
<View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={comprador.selectedCode}
                          onValueChange={(text)=>{change('selectedCode', text )}}
                          style={styles.picker}
                        >
                          {phoneCode.map((item, index) => (
                            <Picker.Item key={index} label={`${item.code} ${item.name}`} value={item.code} />
                          ))}
                        </Picker>
                      </View>
                    </View>
<View style={{ flex: 2,justifyContent:'center' }}>
                      <Text style={[styles.selectedCodeText, comprador.selectedCode === "" && styles.placeholderText,{paddingTop:7}]}>
                        {comprador.selectedCode === "" ? "(000)" : `(${comprador.selectedCode})`}
                      </Text>
                    </View>
                    <View style={{ flex: 6 }}>
                      <TextInput
                      value={comprador.phone}
                        style={styles.phoneInput}
                        keyboardType="numeric"
                        placeholder="3216540987"
                        placeholderTextColor={"#cccc"}
                        onChangeText={(text) => change('phone', text )}
                        onBlur={() => change('phone', comprador.phone)}
                      />
                    </View>
                 
</View>
 
<View style={[styles.inputGroup,{marginTop:15}]}>
            <Text style={styles.label}>Estado</Text>
            <View style={[styles.statusContainer,
              {marginLeft:10}
            ]}>
              <Switch
                value={pagado}
                onValueChange={setPagado}
                trackColor={{ false: "#fde68a", true: "#dcfce7" }}
                thumbColor={pagado ? "#34D399" : "#eab308"}
              />
              <Text style={[styles.statusText, { color: pagado ? '#10B981' : '#eab308' }]}>
                {pagado ? 'Pagado' : 'Separado'}
              </Text>
            </View>
          </View>

</View>
{touched.phone && error.phone && <Text style={{ color: 'red' }}>{error.phone}</Text>}
{touched.selectedCode && error.selectedCode && <Text style={{ color: 'red' }}>{error.selectedCode}</Text> }
<View style={styles.inputGroup}>

   <View  style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
   <TouchableOpacity style={[{ backgroundColor: '#fff', borderWidth: 1,borderColor: '#94a3b8',paddingHorizontal: 16,paddingVertical: 10,borderRadius: 10,marginTop: 25,},{width:'45%'}]}  onPress={()=>{setSelectedId(false);setCrear(false)}}>
        <Text style={{ color: '#94a3b8', fontWeight: 'bold', textAlign: 'center'}}>volver</Text>
    </TouchableOpacity>
   <TouchableOpacity style={[styles.saveButton,{width:'45%'}]} disabled={loading} onPress={()=>save(null,pagado,crear)}>
        <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Agregar'}</Text>
    </TouchableOpacity>
   
   </View>
</View>
</View>
                    )}
             
             
            </View>
            {(
             <ToastModal
             message={responseMessage == null ? '' : responseMessage}
             time={hasError? 3000:1500 }
             blockTime={1000}
             visible={modal}
             onClose={handleCloseModal}  
             />
                )}
              {!crear &&  (
                <FormReutilizableModal
                  visible={confirmEstado}
                  message='Escoja el estado de la asignacion'
                  inputs={[{obj:'Pagado',color:'#6ee7b7'},{obj:'Separado',color:'#eab308'}]}
                  onOne={()=>ejecutar(true)}
                  onTwo={()=>ejecutar(false)}
                  onCancel={()=>{setConfirmEstado(false);setSelectedId(null) }}
                  onClose={()=>{setConfirmEstado(false);setSelectedId(null) }}
                
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
        alignItems:'center'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
      placeholderText: {
        color: '#ccc',
      },
      cell: {
        paddingHorizontal: 15,
        paddingVertical: 7,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal:'3%',
        
      },
      cellText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      cellSubText: {
        fontSize: 14,
        color: '#666',
      },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#F3F4F6',
      },
      addButton: {
        marginLeft: 8,
        backgroundColor: '#6366F1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
      },
      addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
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
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusText: {
      marginLeft: 8,
      fontWeight: 'bold',
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
