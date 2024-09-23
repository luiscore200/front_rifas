import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { CheckMarkIcon,CrossMarkIcon, EyeIcon } from '../../../../assets/icons/userIcons';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';



interface SeparatedCardProps {
  info:any;
  onCancel:(info:any)=>void;
  onConfirm:(info:any)=>void;
  

  prueba:boolean;
}

const SeparatedCard: React.FC<SeparatedCardProps> = ({ info,prueba,onCancel, onConfirm }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
 // const getTextStatusColor = (status: any) => (status == "separado" ? '#166534' : '#991b1b');
 // const getBGStatusColor = (status: any) => (status == "separado" ? '#dcfce7' : '#fee2e2');
const ShimmerPlacerholder = createShimmerPlaceholder(LinearGradient);
  

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        
         {!prueba && (
         <View style={styles.cardContent}>
           <View style={[styles.userIcon,{  backgroundColor:info.status==='separado'? "#eab308":'#34d399'}]}>
           <Text style={[styles.userIconText,{  color: info.status==='separado'? "#a16207":'#166534'}]}>{info.number}</Text>
         </View>
         <View style={styles.userInfo}>
           <Text style={styles.userName}>{info.purchaser_name}</Text>
           
           <Text style={styles.userEmail}>{info.purchaser_email}</Text>
           <Text style={styles.userEmail}>{info.purchaser_phone}</Text>
         </View>
         <View style={{flexDirection:'row'}}>
         
            <TouchableOpacity onPress={()=> onConfirm(info)}
            style={{backgroundColor:info.status==='separado'?"#4ade80":"#a3e635"        ,padding:5,marginRight:5,borderRadius:20,shadowColor:'#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.6,shadowRadius: 4,elevation: 5,}}>
                {
                  info.status==='separado'?(<CheckMarkIcon style={{color:"#166534"}} />):(<EyeIcon bgc='#a3e635'  style={{color:'#065f46'}}/>)
                }
            </TouchableOpacity>
           

           
           <TouchableOpacity onPress={()=>  onCancel(info)}
           style={{backgroundColor:"#f87171",padding:5,marginLeft:5,borderRadius:20,shadowColor:'#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.6,shadowRadius: 4,elevation: 5,}}>
             <CrossMarkIcon  style={{color:"#991b1b"}} />
           </TouchableOpacity>

         </View>
         <TouchableOpacity style={styles.menuButton} >
            {//<Text style={styles.menuButtonText}>⋮</Text>
            }          
         </TouchableOpacity>
         </View>
         )}
         {prueba && (
              <View style={styles.cardContent}>
              <ShimmerPlacerholder style={{width: 40,height: 40, borderRadius: 5,justifyContent: 'center', alignItems: 'center', marginRight: 20,backgroundColor: "#cbd5e1"}}>
              
            </ShimmerPlacerholder>
            <View style={styles.userInfo}>
              <ShimmerPlacerholder style={{ width:120,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:10 }} ></ShimmerPlacerholder>
              <ShimmerPlacerholder style={{ width:70,borderRadius:10,backgroundColor:"#cbd5e1",height:15,marginBottom:10 }} ></ShimmerPlacerholder>
              <ShimmerPlacerholder style={{ width:70,borderRadius:10,backgroundColor:"#cbd5e1",height:15,marginBottom:10 }} ></ShimmerPlacerholder>
            </View>
            <View style={{flexDirection:'row',marginRight:10  }}>

                
            <ShimmerPlacerholder style={{ height:40,width:40,backgroundColor:"#cbd5e1",marginRight:5,borderRadius:20}}>
                
            </ShimmerPlacerholder>
                  <ShimmerPlacerholder style={{height:40,width:40,backgroundColor:"#cbd5e1",marginLeft:5,borderRadius:20,shadowColor:'#000'}}>
               
                </ShimmerPlacerholder>
   
            </View>
          
            </View>

         )

         }
      
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical:16,
    paddingRight:5,
    paddingLeft:16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
   // transition: 'all 0.3s ease',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    
  },
  userIconText: {
  
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  userEmail: {
    paddingBottom:5,
    fontSize: 12,
    color: '#888',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  menuOption: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
  },
});

export default SeparatedCard;
