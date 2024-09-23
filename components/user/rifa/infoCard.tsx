import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { CheckIcon, CheckMarkIcon, CrossMarkIcon } from '../../../assets/icons/userIcons';
import ConfirmationModal from '../../ConfirmModal';

interface InfoAssignamentModalProps {
  visible: boolean;
  onCancel: () => void;
  onClose: () => void;
  onDelete:(obj:any)=>void;
  onConfirm:(obj:any)=>void;
  asignaciones: any[];
  asignacion: any;
}



const InfoAssignamentModal: React.FC<InfoAssignamentModalProps> = ({ visible, asignaciones, asignacion,onDelete,onConfirm, onCancel, onClose }) => {
  const [group, setGroup] = useState<any[]>([]);
  const [only,setOnly]=useState<any>(null);
console.log(asignacion);
  const handleCancel = () => {
    onCancel();
    onClose();
  };
  const [borrar,setBorrar]=useState(false);
  const [id,selectedId]=useState<number|null>(null);
  const [open,setOpen]=useState(false);
  useEffect(() => {
    const aa = asignaciones.filter((obj: any) => obj.purchaser_email === asignacion.purchaser_email);
    setGroup(aa);
    
  }, [asignacion,asignaciones]);

  useEffect(()=>{
    const bb = group.find((obj:any)=> obj.id===asignacion.id)||null;
    setOnly(bb);
  },[group])
  

  const openConfirmation = (id:number,borrar:boolean)=>{
    selectedId(id);
    setBorrar(borrar);
    setOpen(true);
    
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{asignacion.purchaser_name}</Text>
                  <Text style={styles.userEmail}>{asignacion.purchaser_email}</Text>
                  <Text style={styles.userPhone}>{asignacion.purchaser_phone}</Text>
                </View>
                <ScrollView style={styles.scrollView}>

                  {only!==null && (
                        <TouchableOpacity style={styles.assignmentItem} onPress={() => {}} activeOpacity={1}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={[styles.userIcon,{  backgroundColor:only.status==='separado'? "#eab308":'#34d399'}]}>
                            <Text style={[styles.userIconText,{  color: only.status==='separado'? "#a16207":'#166534'}]}>{only.number}</Text>
                            </View>
                        <Text style={styles.assignmentStatus}>{only.status}</Text>
                        
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          {only.status==='separado' && (
                            <TouchableOpacity style={{padding:5,borderRadius:17,paddingRight:5}} onPress={()=>openConfirmation(only,false)}>
                            <CheckMarkIcon/>
                          </TouchableOpacity>
                        )

                        }
                                <TouchableOpacity style={{padding:5,borderRadius:17,paddingRight:5}}  onPress={()=>openConfirmation(only,true)}>
                          <CrossMarkIcon/>
                        </TouchableOpacity>
                        </View>
                      </TouchableOpacity>

                  )
                  
                  }

                  {group.map((obj: any, index: number) => {
                    

                    if(obj.id!==asignacion.id){
                      return(
                        <TouchableOpacity key={index} style={styles.assignmentItem} onPress={() => {}} activeOpacity={1}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                          <View style={[styles.userIcon,{  backgroundColor:obj.status==='separado'? "#eab308":'#34d399'}]}>
                             <Text style={[styles.userIconText,{  color: obj.status==='separado'? "#a16207":'#166534'}]}>{obj.number}</Text>
                             </View>
                          <Text style={styles.assignmentStatus}>{obj.status}</Text>
                         
                          </View>
                         <View style={{flexDirection:'row',alignItems:'center'}}>
                            {obj.status==='separado' && (
                             <TouchableOpacity style={{padding:5,borderRadius:17,paddingRight:5}} onPress={()=>openConfirmation(obj,false)}>
                             <CheckMarkIcon/>
                           </TouchableOpacity>
                         )
    
                         }
                                 <TouchableOpacity style={{padding:5,borderRadius:17,paddingRight:5}}  onPress={()=>openConfirmation(obj,true)}>
                            <CrossMarkIcon/>
                          </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )
                    }
                    
               
                
                }
                  
                  )}
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {open && id!==null &&  (
        <ConfirmationModal
        visible={open}
        mode={borrar?'delete':'confirm'}
        message={borrar?'¿Esta seguro de querer eliminar esta asignacion?':'Porfavor confirme su eleccion'}
        onConfirm={()=>{ borrar? onDelete(id):onConfirm(id);setOpen(false)}}
        onCancel={()=>{selectedId(null);setOpen(false);setBorrar(false)}}
        onClose={()=>{selectedId(null);setOpen(false);setBorrar(false)}}
        width={400}
        />
      )

      }
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
    maxWidth: 400,
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
  userInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
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
  scrollView: {
    height: 300,
    width: '100%',
    marginBottom: 20,
  },
  assignmentItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  assignmentText: {
    fontSize: 14,
    color: '#333',
  },
  assignmentStatus: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderWidth:1,
    borderColor:'#94a3b8',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InfoAssignamentModal;
