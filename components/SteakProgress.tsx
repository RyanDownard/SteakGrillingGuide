import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useTimerStore from '../stores/TimerStore';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHourglass, faFire, faRotate } from '@fortawesome/free-solid-svg-icons';

interface Props {
    steak: Steak;
}

const SteakProgress: React.FC<Props> = ({ steak }) => {
    const { timerRunning, remainingTime } = useTimerStore();
    const firstSideReady = remainingTime <= (steak.firstSideTime + steak.secondSideTime);
    const secondSideReady = remainingTime <= steak.secondSideTime;


    return (
        <View style={styles.container}>
            <View style={styles.rowContainer} >
                <View style={styles.stepContainer}>
                    <View style={[styles.iconContainer, styles.activeIconContainer]}>
                        <FontAwesomeIcon icon={faHourglass} size={24} color="#000" />
                    </View>
                </View>
                <View style={timerRunning && firstSideReady ? styles.activeLine : styles.inactiveLine} />
                <View style={styles.stepContainer}>
                    <View style={[styles.iconContainer, timerRunning && firstSideReady ? styles.activeIconContainer : styles.inactiveIconContainer]}>
                        <FontAwesomeIcon icon={faFire} size={24} color={timerRunning && firstSideReady ? '#000' : '#ccc'} />
                    </View>
                </View>
                <View style={timerRunning && secondSideReady ? styles.activeLine : styles.inactiveLine} />
                <View style={styles.stepContainer}>
                    <View style={[styles.iconContainer, timerRunning && secondSideReady ? styles.activeIconContainer : styles.inactiveIconContainer]}>
                        <FontAwesomeIcon icon={faRotate} size={24} color={timerRunning && secondSideReady ? '#000' : '#ccc'} />
                    </View>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>Waiting</Text>
                </View>

                <View style={styles.textSpacing} />

                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>First Side</Text>
                </View>

                <View style={styles.textSpacing} />

                <View style={styles.stepContainer}>
                    <Text style={styles.stepText}>Second Side</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    inactiveLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#ccc',
        paddingHorizontal: 5,
    },
    activeLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#000',
        paddingHorizontal: 5,
    },
    iconContainer: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 25,
        width: 50,
    },
    inactiveIconContainer: {

        borderColor: '#ccc',
    },
    activeIconContainer: {
        borderColor: '#000',
    },
    stepText: {
        flexShrink: 1,
        textAlign: 'center',
    },
    stepContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 50,
    },
    textSpacing: {
        flex: 1,
    },
});

export default SteakProgress;
