import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useTimerStore from '../stores/TimerStore';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHourglass, faFire, faRotate, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-native-progress';

interface Props {
    steak: Steak;
}

const SteakProgress: React.FC<Props> = ({ steak }) => {
    const { timerRunning, remainingTime, duration } = useTimerStore();
    const totalTime = steak.firstSideTime + steak.secondSideTime;
    const firstSideReady = remainingTime <= totalTime;
    const secondSideReady = remainingTime <= steak.secondSideTime;

    // Derive per-node state: 'active' | 'past' | 'future'
    const waitingState = !timerRunning || !firstSideReady ? 'active' : 'past';
    const side1State   = timerRunning && firstSideReady && !secondSideReady ? 'active'
                       : timerRunning && secondSideReady ? 'past' : 'future';
    const side2State   = timerRunning && secondSideReady ? 'active' : 'future';

    const nodeStyle = (s: 'active' | 'past' | 'future') => ({
        backgroundColor: s === 'active' ? '#c07040' : s === 'past' ? '#e8c8b0' : '#f0e8df',
        borderColor:     s === 'active' ? '#a05830' : s === 'past' ? '#d4a880' : '#e0d0c4',
    });

    const iconColor = (s: 'active' | 'past' | 'future') =>
        s === 'active' ? '#fff' : s === 'past' ? '#a05830' : '#ccc';

    const getWaitingProgress = () => {
        if (!timerRunning) {
            return 0;
        }

        const totalWaitTime = Math.max(0, duration - totalTime);

        if (remainingTime <= totalTime) {
            return 1;
        }

        if (totalWaitTime <= 0) {
            return 0;
        }

        return Math.max(0, Math.min(1, 1 - ((remainingTime - totalTime) / totalWaitTime)));
    };

    const getFlipProgress = () => {
        if (!timerRunning) {
            return 0;
        }

        if (remainingTime <= steak.secondSideTime) {
            return 1;
        }

        if (remainingTime >= totalTime) {
            return 0;
        }

        return Math.max(0, Math.min(1, (totalTime - remainingTime) / steak.firstSideTime));
    };

    const waitingConnectorProgress = getWaitingProgress();
    const flipConnectorProgress = getFlipProgress();

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                {/* Waiting node */}
                <View style={styles.stepContainer}>
                    <View style={[styles.shadowWrap, waitingState === 'active' && styles.activeShadow]}>
                        <View style={[styles.iconContainer, nodeStyle(waitingState)]}>
                            {waitingState === 'past'
                                ? <FontAwesomeIcon icon={faCheck} size={12} color="#a05830" />
                                : <FontAwesomeIcon icon={faHourglass} size={12} color={iconColor(waitingState)} />}
                        </View>
                    </View>
                </View>

                <View style={styles.connectorTrack}>
                    <Bar
                        progress={waitingConnectorProgress}
                        color="#d4a880"
                        unfilledColor="transparent"
                        borderWidth={0}
                        height={2}
                        width={null}
                        style={styles.connectorBar}
                    />
                </View>

                {/* Side 1 node */}
                <View style={styles.stepContainer}>
                    <View style={[styles.shadowWrap, side1State === 'active' && styles.activeShadow]}>
                        <View style={[styles.iconContainer, nodeStyle(side1State)]}>
                            {side1State === 'past'
                                ? <FontAwesomeIcon icon={faCheck} size={12} color="#a05830" />
                                : <FontAwesomeIcon icon={faFire} size={12} color={iconColor(side1State)} />}
                        </View>
                    </View>
                </View>

                <View style={styles.connectorTrack}>
                    <Bar
                        progress={flipConnectorProgress}
                        color="#d4a880"
                        unfilledColor="transparent"
                        borderWidth={0}
                        height={2}
                        width={null}
                        style={styles.connectorBar}
                    />
                </View>

                {/* Side 2 node */}
                <View style={styles.stepContainer}>
                    <View style={[styles.shadowWrap, side2State === 'active' && styles.activeShadow]}>
                        <View style={[styles.iconContainer, nodeStyle(side2State)]}>
                            <FontAwesomeIcon icon={faRotate} size={12} color={iconColor(side2State)} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Labels */}
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
        paddingHorizontal: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    iconContainer: {
        width: 26,
        height: 26,
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Shadow wrapper replicates the box-shadow glow on the active node
    shadowWrap: {
        borderRadius: 25,
        padding: 4,
        backgroundColor: 'transparent',
    },
    activeShadow: {
        backgroundColor: 'rgba(192, 112, 64, 0.18)',
    },
    stepContainer: {
        alignItems: 'center',
        width: 75,
    },
    stepText: {
        flexShrink: 1,
        textAlign: 'center',
        fontSize: 12,
        color: '#a08070',
        fontFamily: 'DMSans',
    },
    textSpacing: {
        flex: 1,
    },
    connectorTrack: {
        flex: 1,
        height: 2,
        marginHorizontal: 2,
        borderRadius: 2,
        backgroundColor: '#f0e0d4',
        overflow: 'hidden',
    },
    connectorBar: {
        flex: 1,
        height: 2,
        borderRadius: 2,
    },
});

export default SteakProgress;
