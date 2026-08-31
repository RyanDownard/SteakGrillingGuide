import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import useTimerStore, { useTimerEffect } from '../stores/TimerStore';
import useSteakStore from '../stores/SteakStore';
import { formatTime } from '../data/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { theme } from '../styles/theme';

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
                        <FontAwesomeIcon icon={faCircleInfo} size={16} color={theme.colors.info} />
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
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.borderSoft,
        shadowColor: theme.colors.black,
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
        color: theme.colors.textSoft,
        fontFamily: theme.typography.body,
    },
    infoButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.infoSoft,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    time: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
        fontFamily: theme.typography.mono,
        marginTop: 2,
    },
});
