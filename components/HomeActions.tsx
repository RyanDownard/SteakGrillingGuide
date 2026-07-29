import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTimerStore from '../stores/TimerStore';

interface Props {
    hasSteak: boolean;
    onAddSteak: () => void;
    onStartCook: () => void;
    onStopCook: () => void;
}

const HomeActions: React.FC<Props> = ({ hasSteak, onAddSteak, onStartCook, onStopCook }) => {
    const insets = useSafeAreaInsets();
    const { timerRunning } = useTimerStore();

    return (
        <View
            style={[styles.wrapper, { bottom: insets.bottom - 20 }]}
            pointerEvents="box-none"
        >
            {timerRunning ? (
                <TouchableOpacity style={styles.stopButton} onPress={onStopCook}>
                    <Text style={styles.stopText}>⏹ Stop Cook</Text>
                </TouchableOpacity>
            ) : (
                <>
                    {hasSteak && (
                        <TouchableOpacity style={styles.startButton} onPress={onStartCook}>
                            <Text style={styles.startText}>🔥 Start Cook</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.addButton} onPress={onAddSteak}>
                        <Text style={styles.addText}>＋ Add Steak</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 24,
        right: 24,
        gap: 10,
    },
    startButton: {
        backgroundColor: '#c07040',
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: '#c07040',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    startText: {
        color: '#fff',
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#2a1a0e',
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: '#2a1a0e',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    addText: {
        color: '#fdf8f4',
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
    stopButton: {
        backgroundColor: '#7a2e1a',
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: '#7a2e1a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    stopText: {
        color: '#fff',
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeActions;
