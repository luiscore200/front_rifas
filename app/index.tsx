import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import GradientLayout from './layout';
import LottieView from 'lottie-react-native';



const home = ()=>{

useEffect(()=>{setTimeout(() => {
//   router.replace("auth/login");
  }, 5000);
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