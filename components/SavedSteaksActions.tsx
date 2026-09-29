import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

interface Props {
    onAddSavedSteak: () => void;
    disabled?: boolean;
}

const SavedSteaksActions: React.FC<Props> = ({ onAddSavedSteak, disabled = false }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { bottom: insets.bottom - 20 }]} pointerEvents="box-none">
            <TouchableOpacity
                style={[styles.addButton, disabled && styles.disabledButton]}
                onPress={onAddSavedSteak}
                disabled={disabled}
            >
                <Text style={styles.addText}>＋ Add Saved Steak</Text>
            </TouchableOpacity>
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
    disabledButton: {
        opacity: 0.45,
    },
});

export default SavedSteaksActions;
