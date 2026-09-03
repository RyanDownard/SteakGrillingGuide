import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import useTimerStore, { useTimerEffect } from '../stores/TimerStore';
import useSteakStore from '../stores/SteakStore';
import { formatTime } from '../data/Helpers';
import { theme } from '../styles/theme';

const Timer = () => {
    const { duration, remainingTime, timerRunning, timerComplete } = useTimerStore();
    const { steaks } = useSteakStore();

    useTimerEffect();

    if (!steaks || steaks.length === 0 || timerComplete) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Current Grill Timer</Text>
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
    label: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: theme.colors.textSoft,
        fontFamily: theme.typography.body,
    },
    time: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
        fontFamily: theme.typography.mono,
        marginTop: 2,
    },
});
