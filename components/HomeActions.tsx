import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTimerStore from '../stores/TimerStore';
import { theme } from '../styles/theme';

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
        backgroundColor: theme.colors.accent,
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: theme.colors.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    startText: {
        color: theme.colors.white,
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: theme.colors.text,
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    addText: {
        color: theme.colors.background,
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
    stopButton: {
        backgroundColor: theme.colors.accentDeep,
        borderRadius: 18,
        paddingVertical: 17,
        alignItems: 'center',
        shadowColor: theme.colors.accentDeep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    stopText: {
        color: theme.colors.white,
        fontFamily: 'DMSans',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeActions;
