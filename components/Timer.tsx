import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import useTimerStore, { useTimerEffect } from '../stores/TimerStore';
import useSteakStore from '../stores/SteakStore';
import { formatTime } from '../data/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface TimerProps {
    onInfoPress?: () => void;
}

const Timer: React.FC<TimerProps> = ({ onInfoPress }) => {
    const { duration, remainingTime, timerRunning, timerComplete } = useTimerStore();
    const { steaks } = useSteakStore();

    useTimerEffect();

    if (!steaks || steaks.length === 0 || timerComplete) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>Current Grill Timer</Text>
                {onInfoPress && (
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={onInfoPress}
                        accessibilityRole="button"
                        accessibilityLabel="Show grilling info"
                    >
                        <FontAwesomeIcon icon={faCircleInfo} size={16} color="#0f766e" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.time}>
                {timerRunning && remainingTime > 0 ? formatTime(remainingTime) : formatTime(duration)}
            </Text>
        </View>
    );
};

export default Timer;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 10,
        marginBottom: 8,
        paddingVertical: 5,
        paddingHorizontal: 14,
        backgroundColor: '#fff7f0',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f0d8c3',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 32,
    },
    label: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: '#a08070',
        fontFamily: 'DMSans-Regular',
    },
    infoButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffdf9',
        borderWidth: 1,
        borderColor: '#d1fae5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    time: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2a1a0e',
        fontFamily: 'CourierPrime-Regular',
        marginTop: 2,
    },
});
