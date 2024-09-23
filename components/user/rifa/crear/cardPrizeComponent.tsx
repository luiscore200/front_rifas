import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { premio } from '../../../../config/Interfaces';
import { Delete2Icon, StarIcon } from '../../../../assets/icons/userIcons';
import { createPremioValidationRules, validateForm } from '../../../../config/Validators';
import CustomDatePicker from './datePicker';



interface CardPrizeComponentProps {
  obj: premio;
  first: boolean;
  touched: any;
  error: any;
  onUpdate: (field:string,value:any) => void;
  onDelete: (id: number) => void;
}

interface Error {
  descripcion?: string;
  loteria?: string;
  fecha?: string;
}

const CardPrizeComponent: React.FC<CardPrizeComponentProps> = ({ obj, first, touched, error, onDelete, onUpdate }) => {


  const [show,setShow]=useState(false);
  const [date,setDate]=useState(new Date());

  useEffect(()=>(
   safeDate(obj.fecha)
  ),[obj]);

  const safeDate = (fechaString:string) => {
    if(fechaString=="") return;
    const [day, month, year] = fechaString.split('/'); // Divide la cadena en día, mes y año
    const fechaDate = new Date(`${year}-${month}-${day}`); // Formato ISO 8601: yyyy-mm-dd
    setDate(fechaDate);
    
  }

  const handleDelete = () => {
    onDelete(obj.id);
  };

  const togglePick = () => {

    setShow(!show);
  };

  const onChange = (event: any, selectedDate?: Date) => {
   if(Platform.OS==='android' || Platform.OS==='ios'){
    if (event.type === 'set' && selectedDate) {
      setShow(Platform.OS === 'ios');
      
      console.log(selectedDate.toLocaleDateString())
      onUpdate("fecha",selectedDate.toLocaleDateString());
     
    } else {
      setShow(false);
    }
   }
   if(Platform.OS==='web'){

    onUpdate("fecha",selectedDate?.toLocaleDateString());
   }
  };


  const handleUpdateField = (field: string, value: any) => {
    onUpdate(field,value);
    
  };


  return (
    <View style={styles.card}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Premio</Text>
        <TextInput
          style={styles.input}
          placeholder="Primer Premio"
        
          placeholderTextColor={'#ccc'}
          onBlur={()=>handleUpdateField("descripcion",obj.descripcion)}  
          value={obj.descripcion}
          onChangeText={(text)=>handleUpdateField("descripcion",text)}
          
          
        />
            {touched.descripcion && error.descripcion && <Text style={{ color: 'red' }}>{error.descripcion}</Text>}
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Loteria</Text>
        <TextInput
          style={styles.input}
          placeholder="SINUANO NOCHE"
          placeholderTextColor={'#ccc'}
          value={obj.loteria}
          onBlur={()=>handleUpdateField("loteria",obj.loteria)}
          onChangeText={(text)=>handleUpdateField("loteria",text)}
          
          
        />
            {touched.loteria && error.loteria && <Text style={{ color: 'red' }}>{error.loteria}</Text>}
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Fecha</Text>
        <View style={styles.inputRow}>
          {Platform.OS !== 'web' ? (
            <>
              {show && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  style={styles.pick}
                  minimumDate={new Date()}
                />
              )}
              <Pressable onPress={togglePick}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="06/03/2024"
                  placeholderTextColor="#ccc"
                  editable={false}
                  value={obj.fecha}
                  onBlur={() => handleUpdateField("fecha", obj.fecha)}
                />
              </Pressable>
            </>
          ) : (
            <CustomDatePicker
            selectedDate={date}
            onChange={(e:any)=>onChange('',e)}
          />
          )}
       {first && (   <View style={styles.starButton}>
          <StarIcon style={styles.starIcon}/>
          </View>)

       }
       
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Delete2Icon style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
        {touched.fecha && error.fecha && <Text style={{ color: 'red' }}>{error.fecha}</Text>}

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
