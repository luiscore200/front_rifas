import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

interface FormReutilizableModalProps {
  visible: boolean;
   
  message: string;
  //onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  onOne?:()=>void;
  onTwo?:()=>void;
  onTree?:()=>void;
  onFour?:()=>void;
  onFive?:()=>void;
  onSix?:()=>void;
  inputs:any[];
  

}

const FormReutilizableModal: React.FC<FormReutilizableModalProps> = ({ visible,inputs, message, onOne,onTwo,onTree,onFour,onFive,onSix, onCancel, onClose }) => {

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  const touched = (index:number)=>{
    console.log('imdexx',index);
        if(index===0 && onOne){
            onOne();
           
        }
        if(index===1 && onTwo){
            onTwo();
         
        }
        if(index===2 && onTree){
            onTree();
           
        }
        if(index===3 && onFour){
            onFour();
           
        }
        if(index===4 && onFive){
            onFive();
           
        }
        if(index===5 && onSix){
            onSix();
          
        }
        
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
       <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
       
        <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonGroup}>
          
              {inputs.map((obj,index)=>(
                <TouchableOpacity  key={index} style={[styles.button,{backgroundColor:obj.color}]} onPress={()=>{touched(index)}}>
                <Text style={styles.buttonText}>{obj.obj}</Text>
              </TouchableOpacity>
              ))
              

              }
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={{color:"#a1a1aa",fontWeight:'bold'}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </View>
        
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    maxWidth:400,    
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:5,
  },
  confirmButton: {
    backgroundColor: '#34D399',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor:"#cccc"
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FormReutilizableModal;
