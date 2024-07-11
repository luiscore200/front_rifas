import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback,Dimensions } from 'react-native';

import { rifa } from '../../../config/Interfaces';
import { EditIcon,Delete2Icon,WinnerIcon,ShareIcon,CheckIcon, MenuIcon1,PlusIcon } from '../../../assets/icons/userIcons';


interface MenuCardProps {
  rifa:any;
  isvisible:boolean;
  onOptions(rifa: any,opcion:string): void;
  event:any;
  onClose():void;
  
}

const MenuCard: React.FC<MenuCardProps> = ({ isvisible,event,rifa,onOptions,onClose}) => {
  


  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });


  //useEffect(()=>{openModal(event)},[event])


  const { height: windowHeight } = Dimensions.get('window');

  const closeModal = (opcion:string)=> {
    onOptions(rifa,opcion);
  }

  const openModal = (event:any) => {
    const { pageX, pageY } = event.nativeEvent;
    setCardPosition({ x: pageX, y: pageY });
   
  };

 

  return (
  !!isvisible &&(
   
        
<TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              position: 'absolute',
              top: event.y + 70 > windowHeight * 0.85 ? event.y-220 : event.y + 70,
              left: event.y + 70 > windowHeight * 0.85 ? event.x-120 : event.x-120,
              transform: [{ translateX: -50 }, { translateY: -50 }],
            }}

            pointerEvents="auto"
          >




<View style={styles.modal}>
              <View style={{paddingBottom:10}}>
           
                  <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingVertical:5,paddingBottom:10,borderBottomWidth:1,borderColor:"#cccc"}} onPress={()=>closeModal("compartir")}>
                   <View style={{paddingRight:10}}>
                    <ShareIcon style={{width:18,height:18}}/>
                   </View>
                    <Text>Compartir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingTop:10,paddingVertical:5}} onPress={()=>closeModal("asignar")}>
                   <View style={{paddingRight:10}}>
                    <PlusIcon style={{width:18,height:18, color:"#fb923c"}}/>
                   </View>
                    <Text>Asignar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingVertical:5}} onPress={()=>closeModal("confirmar")}>
                   <View style={{paddingRight:10}}>
                    <CheckIcon style={{width:18,height:18,color:'#22c55e'}}/>
                   </View>
                    <Text>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingTop:5}} onPress={()=>closeModal("ganador")}>
                   <View style={{paddingRight:10}}> 
                    <WinnerIcon style={{width:18,height:18,color:'#fcd34d'}}/>
                   </View>
                    <Text>Ganador</Text>
                  </TouchableOpacity>
              </View>
                 <View  style={{borderTopWidth:1,borderColor:'#cccc',paddingVertical:10}}>
                 <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingVertical:5}} onPress={()=>closeModal("editar")}>
                   <View style={{paddingRight:10}}>
                    <EditIcon style={{width:18,height:18}}/>
                   </View>
                    <Text>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',alignContent:'center',paddingVertical:5}} onPress={()=>closeModal("eliminar")}>
                   <View style={{paddingRight:10}}> 
                    <Delete2Icon style={{width:18,height:18, color:'#ef4444'}}/>
                   </View>
                    <Text>Eliminar</Text>
                  </TouchableOpacity>

                 </View>
                  
                </View>
          </View>
          </TouchableWithoutFeedback>
       
  )

  
  
    
  );
};

const styles = StyleSheet.create({
  
  overlay: {
    ...StyleSheet.absoluteFillObject, // Ocupa toda la pantalla
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Fondo transparente para que sea invisible
    zIndex: 999, // Asegura que esté encima de otros componentes
  },
  modalContainer: {
    position: 'absolute',
    top: 50, // Ajusta esta posición según tus necesidades
    right: 10, // Ajusta esta posición según tus necesidades
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth:200,
    
  },
});

export default MenuCard;
