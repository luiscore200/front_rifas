import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback,Dimensions } from 'react-native';

import { rifa } from '../../../config/Interfaces';
import { EditIcon,Delete2Icon,WinnerIcon,ShareIcon,CheckIcon, MenuIcon1,PlusIcon } from '../../../assets/icons/userIcons';

import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';


interface RifaCardProps {
  rifa: any;
  prueba:boolean;
  width?:any;
  onTouch(event:any,rifa: any): void;
  onToggle:()=>void;
  onWinner(rifa:any,index:number):void;

}

const RifaCard: React.FC<RifaCardProps> = ({ rifa,prueba,width, onTouch,onToggle,onWinner }) => {
  const [expanded, setExpanded] = useState(true);
  const ShimmerPlacerholder = createShimmerPlaceholder(LinearGradient);
  const getTextStatusColor = (status: string) => (status === "En juego" ? '#166534' :status ==="Finalizada"? '#991b1b':'#d97706');
  const getBGStatusColor = (status: string) => (status === "En juego" ? '#dcfce7' :status ==="Finalizada"? '#fee2e2':'#fcd34d');


  const safeDate = (fechaString: string) => {
    if (fechaString === "") return "";
    const [day, month, year] = fechaString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const getRifaStatus = (fecha: string,ganador:string) => {
    const today = new Date(safeDate(new Date().toLocaleDateString()));
    const premioDate = safeDate(fecha);
    if (premioDate === "") return 'Finalizada';
    return premioDate >= today ? 'En juego' : ganador!==""?'Finalizada':'Jugado';
  };

  const getRifaStatus2 = () => {
    const today = new Date(safeDate(new Date().toLocaleDateString()));
    if (rifa.premios && rifa.premios.length > 0) {
      for (const premio of rifa.premios) {
        const premioDate = safeDate(premio.fecha);
        if (premioDate === "" || premioDate < today) {
          return 'Finalizada';
        }
      }
      return 'En juego';
    }
    return 'En juego';
  };

  const toggleExpand = () => {
    onToggle();
    setExpanded(!expanded);
  };

  return (
   <TouchableOpacity onPress={()=> {!prueba?onToggle():undefined}} activeOpacity={1}>
    <View style={[styles.cardContainer,{width}]}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              {!prueba? <Text style={styles.userName}>{rifa.titulo}</Text>:   
              <ShimmerPlacerholder style={{ width:120,borderRadius:10,backgroundColor:"#cbd5e1",height:24,marginBottom:10 }} ></ShimmerPlacerholder>}

              
            </View>
           
            {!expanded && !prueba && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.userCountry}>{rifa.pais}</Text>
                  <Text style={styles.userCountry}>{Number(rifa.numeros) - Number(rifa.asignaciones)}/{rifa.numeros}</Text>
                </View>
                <View style={[styles.statusButton, { backgroundColor: getBGStatusColor(getRifaStatus2()) }]}>
                  <Text style={[styles.statusText, { color: getTextStatusColor(getRifaStatus2()) }]}>
                    {getRifaStatus2()}
                  </Text>
                </View>
              </>
            )}
            {expanded && !prueba && (
              <View style={styles.expandedContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Precio:</Text>
                  <Text style={styles.detailValue}>${rifa.precio}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Números:</Text>
                  <Text style={styles.detailValue}>{rifa.numeros}</Text>
                </View>
               {/*
                 <View style={styles.detailRow}>
                 <Text style={styles.detailLabel}>Tipo:</Text>
                 <Text style={styles.detailValue}>{rifa.tipo}</Text>
               </View>
              */   }
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Disponibles:</Text>
                  <Text style={styles.detailValue}>{Number(rifa.numeros) - Number(rifa.asignaciones)}</Text>
                </View>
                {rifa.premios?.map((premio:any, index:number) => (
                  <View key={index} style={styles.premioContainer}>
                  <View style={{flexDirection:'column'}}>
                  <Text style={styles.premioDescripcion}>{premio.descripcion}</Text>
                  <Text style={{color:'#6b7280',fontSize:14}}>{premio.fecha}</Text>
                  </View>
                    <TouchableOpacity style={[getRifaStatus(premio.fecha,premio.ganador)!=='Jugado'?styles.statusButton:styles.statusButtonPressable , { backgroundColor: getBGStatusColor(getRifaStatus(premio.fecha,premio.ganador))},{}]}
                      onPress={()=>{getRifaStatus(premio.fecha,premio.ganador)==='Jugado'? onWinner(rifa,index) :undefined }} activeOpacity={getRifaStatus(premio.fecha,premio.ganador)==='Jugado'? 0 :1}
                    >
                      <Text style={[styles.statusText, { color: getTextStatusColor(getRifaStatus(premio.fecha,premio.ganador)) }]}>
                        {getRifaStatus(premio.fecha,premio.ganador)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
              {expanded && prueba && (
              <View style={styles.expandedContent}>
                <View style={styles.detailRow}>
                <ShimmerPlacerholder style={{ width:90,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                <ShimmerPlacerholder style={{ width:60,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                </View>
                <View style={styles.detailRow}>
                <ShimmerPlacerholder style={{ width:90,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                <ShimmerPlacerholder style={{ width:60,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                </View>
               {/*
                 <View style={styles.detailRow}>
                 <Text style={styles.detailLabel}>Tipo:</Text>
                 <Text style={styles.detailValue}>{rifa.tipo}</Text>
               </View>
              */   }
                <View style={styles.detailRow}>
                <ShimmerPlacerholder style={{ width:90,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                <ShimmerPlacerholder style={{ width:60,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                </View>
              
                  <View  style={styles.premioContainer}>
                  <View style={{flexDirection:'column'}}>
                  <ShimmerPlacerholder style={{ width:90,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                <ShimmerPlacerholder style={{ width:60,borderRadius:10,backgroundColor:"#cbd5e1",height:20,marginBottom:5 }} ></ShimmerPlacerholder>
                  </View>
                  <ShimmerPlacerholder style={{ width:90,borderRadius:15,backgroundColor:"#cbd5e1",height:30,marginBottom:5 }} ></ShimmerPlacerholder>
                  </View>
                
              </View>
            )}




     {/*          <TouchableOpacity onPress={toggleExpand} > 
                <Text style={styles.moreInfo}>{expanded===true? "ocultar informacion":"mostrar informacion"}</Text>
                </TouchableOpacity>*/}
            
          </View>
          <View style={styles.menuContainer}>
            {!prueba && (
               <TouchableOpacity style={{paddingLeft:10,paddingTop:5}} 
               onPress={(event) => onTouch(event,rifa)} 
                 >
                 <MenuIcon1 style={{color:'#CCCC'}}/>
               </TouchableOpacity>
            )

            }
           
              {prueba && (<ShimmerPlacerholder style={{ width:10,borderRadius:10,backgroundColor:"#cbd5e1",height:30,marginBottom:5 }} ></ShimmerPlacerholder>)}
            
            
            
          </View>
        </View>
      </View>
    </View>
    </TouchableOpacity> 
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
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: '#333',
  },
  userCountry: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  expandedContent: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
  },
  premioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    justifyContent:'space-between'
  },
  premioDescripcion: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight:'700',
    flex: 1,
  },
  menuContainer: {
    position: 'relative',
    marginLeft: 'auto',
  },
  menuButton: {
    padding: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    width:80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 4,
  },
  statusButtonPressable: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    width:80,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  moreInfo: {
    color: '#1E90FF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },

});

export default RifaCard;
