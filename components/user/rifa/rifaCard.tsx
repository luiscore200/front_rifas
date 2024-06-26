import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback,Dimensions } from 'react-native';

import { rifa } from '../../../config/Interfaces';
import { EditIcon,Delete2Icon,WinnerIcon,ShareIcon,CheckIcon, MenuIcon1,PlusIcon } from '../../../assets/icons/userIcons';


interface RifaCardProps {
  rifa: rifa;
  onTouch(event:any,rifa: any): void;
  onToggle():void;
}

const RifaCard: React.FC<RifaCardProps> = ({ rifa, onTouch,onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const getTextStatusColor = (status: string) => (status === "En juego" ? '#166534' : '#991b1b');
  const getBGStatusColor = (status: string) => (status === "En juego" ? '#dcfce7' : '#fee2e2');


  const safeDate = (fechaString: string) => {
    if (fechaString === "") return "";
    const [day, month, year] = fechaString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const getRifaStatus = (fecha: string) => {
    const today = new Date(safeDate(new Date().toLocaleDateString()));
    const premioDate = safeDate(fecha);
    if (premioDate === "") return 'Finalizada';
    return premioDate >= today ? 'En juego' : 'Finalizada';
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
   <TouchableWithoutFeedback onPress={toggleExpand}>
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.userName}>{rifa.titulo}</Text>

              
            </View>
           
            {!expanded && (
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
            {expanded && (
              <View style={styles.expandedContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Precio:</Text>
                  <Text style={styles.detailValue}>${rifa.precio}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Números:</Text>
                  <Text style={styles.detailValue}>{rifa.numeros}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tipo:</Text>
                  <Text style={styles.detailValue}>{rifa.tipo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Disponibles:</Text>
                  <Text style={styles.detailValue}>{Number(rifa.numeros) - Number(rifa.asignaciones)}</Text>
                </View>
                {rifa.premios?.map((premio, index) => (
                  <View key={index} style={styles.premioContainer}>
                    <Text style={styles.premioDescripcion}>{premio.descripcion}</Text>
                    <View style={[styles.statusButton, { backgroundColor: getBGStatusColor(getRifaStatus(premio.fecha)) }]}>
                      <Text style={[styles.statusText, { color: getTextStatusColor(getRifaStatus(premio.fecha)) }]}>
                        {getRifaStatus(premio.fecha)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
     {/*          <TouchableOpacity onPress={toggleExpand} > 
                <Text style={styles.moreInfo}>{expanded===true? "ocultar informacion":"mostrar informacion"}</Text>
                </TouchableOpacity>*/}
            
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={{paddingLeft:10,paddingTop:5}} 
            onPress={(event) => onTouch(event,rifa)} 
              >
              <MenuIcon1/>
            </TouchableOpacity>
            
            
          </View>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback> 
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
    color: '#555',
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
  },
  premioDescripcion: {
    fontSize: 14,
    color: '#666',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
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
