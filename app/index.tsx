import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView,Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import GradientLayout from './layout';
import { generalConfig, phoneCodeIndex } from '../services/api';
import { getStorageItemAsync, setStorageItemAsync } from '../services/storage';
import { useAuth } from '../services/authContext2';
import Database from '../services/sqlite';








const home = ()=>{
  const db = new Database();
  const {user,check,auth,setSubContext,setConfigContext,setMySubContext,codigos,setCodigos}=useAuth();

  const [loading,setLoading]=useState(true);

  const Auth = async()=>{await check()}


  

  const handleConfig = async()=>{
   try {
    const response = await generalConfig();
    const data = await phoneCodeIndex();
    
    if(!!response.mensaje){
      await setStorageItemAsync('general_config', JSON.stringify(response.config));
      await setStorageItemAsync('subscriptions', JSON.stringify(response.subscriptions));
      console.log('suscripciones',response.subscription);
      setSubContext(response.subscriptions);
      
      setConfigContext(response.config);

      if(auth){
       if(response.subscriptions.length>0){
        const aa=  response.subscription.find((obj:any) => obj.sub_id === user.id_subscription);
        setMySubContext(aa);
        console.log('mi subcripcion especifica',aa);
       }
      }

      if (Array.isArray(data)) {
        setCodigos(data);
      }

     
      if (Platform.OS ==='android'||Platform.OS==='ios') {

    await db.deleteDataTable('general_config');
    const config = new Array(1).fill(response.config);
    await db.insert('general_config',config);



    await db.deleteDataTable('subscriptions');
    await db.insert('subscriptions',response.subscriptions);

    const localcode= await db.index('codigos');
    if(localcode.left===0){
      
      if (Array.isArray(data)) {
        await db.insert('codigos',data);
        setCodigos(data);

      }

    }else{
      setCodigos(localcode);
    }
 


      }
    }
   // console.log(response);
   } catch (error) {
    if (Platform.OS !== 'web') {
    setSubContext(await db.index('subscriptions'));
    setConfigContext(await db.index('general_config'));
    
    if(auth){
      const sb = await db.index('subscriptions');
      const aa=  sb.find((obj:any) => obj.sub_id === user.id_subscription);
      setMySubContext(aa);
      console.log('mi subcripcion especifica',aa);
    }

    }else{
      const aa = await getStorageItemAsync('subscriptions');
      if(aa!==null && aa) setSubContext(JSON.parse(aa));

      if(auth){
        if(Array.isArray(aa)){
         const ee=  aa.find((obj:any) => obj.sub_id === user.id_subscription);
         setMySubContext(ee);
        }
      }


      const bb = await getStorageItemAsync('general_config');
      if(bb!==null && bb) setConfigContext(JSON.parse(bb));
    }

    
    console.log(error);
   }
  }

  const createDB = async()=>{
   
  try {
await db.reset();
    await db.runQuery('PRAGMA foreign_keys = ON;');

    await db.createTable('general_config', [
      { name: 'id', type: 'INTEGER', nullable: false },
      { name: 'app_logo', type: 'TEXT', nullable: true, default:"" },
      { name: 'app_icon', type: 'TEXT', nullable: true, default:"" },
      { name: 'app_name', type: 'TEXT', nullable: true, default:""  },
      { name: 'banner_1', type: 'TEXT', nullable: true, default:""  },
      { name: 'banner_2', type: 'TEXT', nullable: true, default:""  },
      { name: 'banner_3', type: 'TEXT', nullable: true, default:""  },
      { name: 'email', type: 'TEXT', nullable: true, default:""  },
    
      
  ]);

    await db.createTable('subscriptions', [
      { name: 'id', type: 'INTEGER', nullable: false },
      { name: 'name', type: 'TEXT', nullable: true, default: '' },
      { name: 'sub_id', type: 'TEXT', nullable: true, default: '' },
      { name: 'email', type: 'INTEGER', nullable: true, default: 0 },  
      { name: 'banners', type: 'INTEGER', nullable: true, default: 0 },  
      { name: 'image', type: 'TEXT', nullable: true, default: '' },
      { name: 'max_num', type: 'INTEGER', nullable: true, default: 0 },
      { name: 'max_raffle', type: 'INTEGER', nullable: true, default: 6 },
      { name: 'share', type: 'INTEGER', nullable: true, default: 0 },  
      { name: 'url', type: 'TEXT', nullable: true, default: '' },
      { name: 'whatsapp', type: 'INTEGER', nullable: true, default: 0 }  
      
  ]);

    await db.createTable('notificaciones', [
      { name: 'id', type: 'INTEGER', nullable: false },
      { name: 'code', type: 'INTEGER', nullable: true },
      { name: 'created_at', type: 'TEXT', nullable: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'type', type: 'TEXT', nullable: true }
    ]);

    await db.createTable('codigos', [
      { name: 'id', type: 'INTEGER', nullable: false, options:'PRIMARY KEY AUTOINCREMENT'},
      { name: 'code', type: 'TEXT', nullable: true },
      { name: 'name', type: 'TEXT', nullable: true },
   
    ]);
   
   
    await db.createTable('rifas', [
      { name: 'id', type: 'INTEGER', nullable: false, options:"PRIMARY KEY" },
      { name: 'titulo', type: 'TEXT', nullable: true },
      { name: 'pais', type: 'TEXT', nullable: true },
      { name: 'imagen', type: 'TEXT', nullable: true },
      { name: 'precio', type: 'INTEGER', nullable: true },
      { name: 'asignaciones', type: 'INTEGER', nullable: true },
      { name: 'tipo', type: 'TEXT', nullable: true },
      { name: 'numeros', type: 'TEXT', nullable: true },
      { name: 'premios', type: 'TEXT', nullable: true },
      { name: 'local', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (local IN (0, 1))"  },
      { name: 'deleted', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (deleted IN (0, 1))"  }
    ]);
    
    await db.createTable('compradores',  [
      { name: 'id', type: 'INTEGER', nullable: false, options:'PRIMARY KEY' },
      { name: 'name', type: 'TEXT', nullable: false },
      { name: 'email', type: 'TEXT', nullable: false },
      { name: 'phone', type: 'TEXT', nullable: true, default: '' },
      { name: 'document', type: 'TEXT', nullable: true, default: '' },
      { name: 'local', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (local IN (0, 1))"  },
      { name: 'deleted', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (deleted IN (0, 1))"  }
      
    
  ]);

  
  
  await db.createTable('asignaciones', [
    { name: 'id', type: 'INTEGER', nullable: false, options:'PRIMARY KEY' },
    { name: 'id_purchaser', type: 'INTEGER', nullable: false },
    { name: 'id_raffle', type: 'INTEGER', nullable: false  },
    { name: 'number', type: 'INTEGER', nullable: false },
    { name: 'created_at', type: 'TEXT', nullable: false },
    { name: 'status', type: 'TEXT', nullable: false, options: "CHECK (status IN ('pagado', 'separado'))" },
    { name: 'local', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (local IN (0, 1))"  },
    { name: 'deleted', type: 'INTEGER', nullable: true, default:0,  options: "CHECK (deleted IN (0, 1))"  }
  ],` FOREIGN KEY (id_purchaser) REFERENCES compradores(id) ON UPDATE CASCADE,
  FOREIGN KEY (id_raffle) REFERENCES rifas(id) ON DELETE CASCADE ON UPDATE CASCADE`,
  ['id', 'id_purchaser', 'id_raffle']
);
  
  
 
    
  } catch (error) {
     console.log(error);
  }
  setLoading(false);
  }

  useEffect(()=>{Platform.OS !== 'web'? createDB():setLoading(false)},[])

useEffect(()=>{
  
  Auth();
  handleConfig();
  setTimeout(()=>{change()},4000);
  },[loading]);


  const change = ()=>{
    router.replace("/loading");
  }

return(
    <LinearGradient
    colors={['#6366F1', '#BA5CDE']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.container}
  >

  </LinearGradient>
);
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    }, 
    animation: {
      width: 200,
      height: 200,
    },
  });   
export default home;