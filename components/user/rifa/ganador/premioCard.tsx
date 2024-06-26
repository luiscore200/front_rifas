import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { premio } from '../../../../config/Interfaces';
import { WinnerIcon } from '../../../../assets/icons/userIcons';

interface PremioCardProps {
    premio: premio;
    onTouch(): void;
}

const PremioCard: React.FC<PremioCardProps> = (obj) => {
   // console.log("premioooo", obj.premio);

    const getTextStatusColor = (status: any) => {
        if (status === "En juego") return '#166534';
        if (status === "Pendiente por asignar") return '#b45309';
        return '#166534';
    };

    const getBGStatusColor = (status: any) => {
        if (status === "En juego") return '#dcfce7';
        if (status === "Pendiente por asignar") return '#fef3c7';
        return '#dcfce7';
    };

    const safeDate = (fechaString: any) => {
        if (fechaString === "") return "";
        const [day, month, year] = fechaString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    const getRifaStatus = (fecha: any) => {
        const today = new Date(safeDate(new Date().toLocaleDateString()));
        const premioDate = safeDate(fecha);
        if (premioDate === "") return 'Asignada';
        return premioDate >= today ? 'En juego' : 'Asignada';
    };

    const rifaStatus = getRifaStatus(obj.premio.fecha);
    const isPending = rifaStatus === 'Asignada' && obj.premio.ganador === "";

    return (
        <TouchableOpacity
            style={[styles.card, isPending && styles.cardPending]}
            onPress={() => isPending && obj.onTouch()}
            disabled={!isPending}
        >
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{obj.premio.descripcion}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.subtitle}>{obj.premio.loteria}</Text>
                <Text style={styles.date}>{obj.premio.fecha}</Text>
              
            </View>
            </View>
               <View  style={{flexDirection:'row',marginRight:10}}>
            
               <View style={{height:30,width:50,borderWidth:0,borderColor:"#cccc",marginHorizontal:10,alignItems:'flex-end', borderRadius:5}}>  
                    
                    <Text style={{fontSize:20, color:"#6b7280",fontWeight:'600'}}>{obj.premio.ganador}</Text>
                </View>
                <View style={{marginTop:5}}><WinnerIcon  style={{width:20,height:20,color:'#eab308'}}/></View>
               </View>


            </View>
              <View style={[styles.statusButton, { backgroundColor: getBGStatusColor(isPending ? 'Pendiente por asignar' : rifaStatus) }]}>
                    <Text style={[styles.statusText, { color: getTextStatusColor(isPending ? 'Pendiente por asignar' : rifaStatus) }]}>
                        {isPending ? 'Pendiente por asignar' : rifaStatus}
                    </Text>
                </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#fff',
    },
    cardPending: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    cardContent: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    statusButton: {
        minWidth: 150,
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
});

export default PremioCard;
