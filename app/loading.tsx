import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';





const home = ()=>{


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