import React from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import useTimerStore, { useTimerEffect } from '../stores/TimerStore';
import useSteakStore from '../stores/SteakStore';
import { formatTime } from '../data/Helpers';

const Timer = () => {
    const { duration, remainingTime, timerRunning, timerComplete } = useTimerStore();
    const { steaks } = useSteakStore();

    useTimerEffect();

    return (
        <SafeAreaView style={[steaks && steaks.length > 0 && !timerComplete ? styles.container : styles.noDisplay]}>
            {steaks && steaks.length > 0 && (
                <Text style={styles.longestTime}>
                    Timer: {timerRunning && remainingTime > 0 ? formatTime(remainingTime) : formatTime(duration)}
                </Text>
            )}
        </SafeAreaView>
    );
};

export default Timer;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'grey',
    },
    noDisplay: {
        display: 'none',
    },
    longestTime: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
});
