import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import GradientLayout from './layout';
import { generalConfig } from '../services/api';
import { setStorageItemAsync } from '../services/storage';
import { useAuth } from '../services/authContext2';





const home = ()=>{

  const {user,check,auth}=useAuth();

  const Auth = async()=>{await check()}

  const handleConfig = async()=>{
   try {
    const response = await generalConfig();
    if(!!response.mensaje){
      await setStorageItemAsync('general_config', JSON.stringify(response.config));
      await setStorageItemAsync('subscriptions', JSON.stringify(response.subscriptions));
    }
    console.log(response);
   } catch (error) {
    
   }
  }

useEffect(()=>{
  Auth();
  handleConfig();
  setTimeout(()=>{change()},3000);
  },[]);


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