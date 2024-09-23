import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { NextIcon, PrevIcon } from '../../../../assets/icons/userIcons';

const daysOfWeek = ['Dm', 'Ln', 'Mar', 'Mr', 'Jv', 'Vr', 'Sa'];

const CustomDatePicker = ({ selectedDate, onChange }: any) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState(selectedDate || new Date());
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateChange = (day: any) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setDate(newDate);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
        onChange(newDate);
        setShowCalendar(false); // Ocultar el calendario después de seleccionar una fecha
    };

    const changeMonth = (offset: any) => {
        let newMonth = currentMonth + offset;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const generateWeekRow = (days: any, weekIndex: number) => {
        return (
            <View key={`week-${weekIndex}`} style={styles.weekRow}>
                {days.map((day: any, index: number) => (
                    <View key={`${weekIndex}-${index}`} style={styles.dayContainer}>
                        {day}
                    </View>
                ))}
            </View>
        );
    };

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDay = new Date(currentYear, currentMonth, 1).getDay();

        const days = [];
        let week = [];
        let weekIndex = 0;

        // Agregar espacios vacíos antes del primer día del mes
        for (let i = 0; i < startDay; i++) {
            week.push(<View key={`empty-${i}`} style={styles.emptyDay}></View>);
        }

        // Agregar los días del mes
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = i === date.getDate() && currentMonth === date.getMonth() && currentYear === date.getFullYear();
            week.push(
                <TouchableOpacity
                    key={`day-${i}`}
                    style={[styles.day, isSelected && styles.selectedDay]}
                    onPress={() => handleDateChange(i)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
                </TouchableOpacity>
            );

            // Si hemos completado una semana (7 días), agregamos la fila y limpiamos la semana
            if (week.length === 7) {
                days.push(generateWeekRow(week, weekIndex));
                week = []; // Limpiar el array para la próxima semana
                weekIndex++;
            }
        }

        // Si quedaron días sueltos en la última semana, los agregamos
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(<View key={`empty-${week.length}`} style={styles.emptyDay}></View>);
            }
            days.push(generateWeekRow(week, weekIndex));
        }

        return days;
    };


    const formatDate = (date: any) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.input} onPress={toggleCalendar}>
                <Text style={styles.inputText}>{formatDate(date)}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={showCalendar}
                onRequestClose={toggleCalendar}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => changeMonth(-1)}>
                                <PrevIcon style={{ color: '#6b7280' }} />
                            </TouchableOpacity>
                            <Text style={styles.month}>
                                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                            </Text>
                            <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => changeMonth(1)}>
                                <NextIcon style={{ color: '#6b7280' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.calendarHeader}>
                            {daysOfWeek.map(day => (
                                <Text key={day} style={styles.dayHeader}>
                                    {day}
                                </Text>
                            ))}
                        </View>
                        <View style={styles.calendarGrid}>
                            {generateCalendarDays()}
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={toggleCalendar}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display: 'inline-block',
    },
    input: {
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        width: 150,
        textAlign: 'center',
        backgroundColor: '#e0e0e0',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
    },
    month: {
        fontSize: 16,
        fontWeight: '400',
    },
    calendarHeader: {
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 5,
    },
    dayHeader: {
        textAlign: 'center',
        width: 30,
        fontWeight: 'bold',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dayContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    day: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginHorizontal: 5,
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDay: {
        backgroundColor: '#cbd5e1',
        color: '#fff',
    },
    selectedDayText: {
        color: '#fff',
    },
    emptyDay: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#94a3b8',
        marginBottom: 15,
    },
    closeButtonText: {
        color: '#94a3b8',
        fontSize: 16,
    },
});

export default CustomDatePicker;
