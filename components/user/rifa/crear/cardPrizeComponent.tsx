import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform } from 'react-native';
import { Delete2Icon, StarIcon } from '../../../../assets/icons/userIcons';
import  DateTimePicker from '@react-native-community/datetimepicker';
import { premio } from '../../../../config/Interfaces';






interface CardPrizeComponentProps {
    obj:premio;
    first:boolean;
    onUpdate: (obj:premio) => void;
    onDelete: (id:number) => void;
  
  }
  

const CardPrizeComponent : React.FC<CardPrizeComponentProps> = ({ obj,first, onDelete, onUpdate }) => {
  const [description, setDescription] = useState(obj.descripcion);
  const [loteria, setLoteria] = useState(obj.loteria);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  

  
  const handleDelete = () => {
    onDelete(obj.id);
  };

  const togglePick = ()=> {setShow(!show)};

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setShow(Platform.OS === 'ios');
      setDate(selectedDate);
      onUpdate({ id: obj.id, descripcion: description,loteria:loteria, fecha: selectedDate.toLocaleDateString() });
    } else {
      setShow(false);
    }
  };

  const handleDescriptionChange = (text:string) => {
    setDescription(text);
    console.log(description);

    onUpdate({id:obj.id,descripcion:text,loteria:loteria,fecha:date.toLocaleDateString()});
  };
  
  
  const handleLoteriaChange = (text:string) => {
    setLoteria(text);
    console.log(description);

    onUpdate({id:obj.id,descripcion:description,loteria:text,fecha:date.toLocaleDateString()});
  };
  
  

  return (
    <View style={styles.card}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Premio</Text>
        <TextInput
          style={styles.input}
          placeholder="Primer Premio"
        
          placeholderTextColor={'#ccc'}
        
          value={description}
          onChangeText={handleDescriptionChange}
          
          
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Loteria</Text>
        <TextInput
          style={styles.input}
          placeholder="SINUANO NOCHE"
          placeholderTextColor={'#ccc'}
          value={loteria}
          onChangeText={handleLoteriaChange}
          
          
        />
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Fecha</Text>
        <View style={styles.inputRow}>
        {show && (
               <DateTimePicker
              
               mode="date"
               display="spinner"
               value={date}
               onChange={onChange}
               style={styles.pick}
               minimumDate={new Date()}
         
              
             />
        
        ) }
       
         
             <Pressable onPress={togglePick}>
             <TextInput
             style={styles.inputWithIcon}
             placeholder="06/03/2024"
             placeholderTextColor={'#ccc'}
             editable={false}
             value={date.toLocaleDateString()}
         
             //onChangeText={handleDateChange}
           /></Pressable>

       {first && (   <View style={styles.starButton}>
          <StarIcon style={styles.starIcon}/>
          </View>)

       }
       
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Delete2Icon style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  pick:{
    backgroundColor:"white",
    borderRadius:20,
  },

  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    
   
  },
  inputWithIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minWidth:'60%',    
    padding: 10,
    
  },
  deleteButton: {
    position:'absolute',    
    right: 15,
  },
  starButton: {
    position:'absolute',    
    right: 65,
  },
  starIcon: {
    color: '#EBC344',
    marginLeft: 30,
  },
  deleteIcon: {
    color: 'red',
    marginLeft: 30,
  },
});

export default CardPrizeComponent;
