import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import GradientLayout from './layout';
import { generalConfig } from '../services/api';
import { setStorageItemAsync } from '../services/storage';





const home = ()=>{


  const handleConfig = async()=>{
   try {
    const response = await generalConfig();
    if(!!response.mensaje){
      await setStorageItemAsync('general_config', JSON.stringify(response.config));
    }
    console.log(response);
   } catch (error) {
    
   }
  }

useEffect(()=>{
  handleConfig();
  setTimeout(() => {
  router.replace("auth/login");
  }, 3000);
  },[]);

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