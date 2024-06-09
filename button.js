import React from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function buttonGradient({ onPress }){
    return(<TouchableOpacity  style={styles.container}  onPress={onPress}>
                <LinearGradient colors={['#FFB677','#FF3CBD']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.button}>
                        <Text style={styles.text} >
                            SIGN IN 
                        </Text>
                </LinearGradient>
        
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{

        
        
      
        alignItems:'center',
        width:200,
        marginTop:60,

    },    
    text:{
        fontSize:14,
        color:'#fff',
     
        fontWeight:'bold',
    },
    button:{
   
        
        borderRadius:25,
        padding:10,
        justifyContent:'center',
        alignItems:'center',
        width:'80%',
    }
})