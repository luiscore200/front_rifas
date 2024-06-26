    import React, { useEffect, useRef, useState } from 'react';
    import { Animated, Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
    import { User } from '../config/Interfaces';
    import { EditIcon, Delete2Icon } from '../assets/icons/userIcons'; // Ajusta la ruta según tu estructura de archivos
import { Colors } from 'react-native/Libraries/NewAppScreen';

    interface OptionsModalProps {
    obj: any;
    visible: boolean;
    onClose: () => void;
    onEdit: (user: any) => void;
    onDelete: (user: any) => void;
    }

    const OptionsModal: React.FC<OptionsModalProps> = ({ obj, visible, onClose, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(visible);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
        setShowModal(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        } else {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowModal(false));
        }
    }, [visible, opacity]);

    const handleEdit = () => {
        onClose();
        onEdit(obj);
    };

    const handleDelete = () => {
        onClose();
        onDelete(obj);
    };

    return (
        <Modal
        transparent
        visible={showModal}
        animationType="none"
        onRequestClose={onClose}
        >
        <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <Animated.View style={{ ...styles.modalContent, opacity }}>
                <TouchableOpacity style={styles.option} onPress={handleEdit}>
                <EditIcon style={[styles.optionIcon,{color:'black'}]} />
                <Text style={styles.optionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={handleDelete}>
                <Delete2Icon style={[styles.optionIcon,{color:'#ef4444'}]} />
                <Text style={[styles.optionText,{color:'#ef4444'}]}>Delete</Text>
                </TouchableOpacity>
            </Animated.View>
            </TouchableOpacity>
        </TouchableOpacity>
        </Modal>
    );
    };

    const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '100%',
        padding: 0,
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        
    },
    optionIcon: {
       width:24,
       height:24,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
    });

    export default OptionsModal;
