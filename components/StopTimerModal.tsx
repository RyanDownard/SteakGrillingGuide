import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { theme } from '../styles/theme';

interface StopTimerModalProps {
    visible: boolean;
    onClose: () => void;
    onStop: () => void;
}

const StopTimerModal: React.FC<StopTimerModalProps> = ({ visible, onClose, onStop }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.headerAccent} />
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTextWrap}>
                            <Text style={styles.modalTitle}>Stop Timer</Text>
                            <Text style={styles.modalSubtitle}>This will pause the active cook cycle.</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.noticeBox}>
                        <Text style={styles.noticeText}>Are you sure you want to stop the timer?</Text>
                        <Text style={styles.supportText}>
                            Stopping the timer cannot be undone. If you start again, the timer will restart from the longest steak time, and you’ll need to monitor the cook yourself.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onStop}>
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.overlay,
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: theme.colors.background,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 7,
    },
    headerAccent: {
        height: 4,
        borderRadius: 999,
        backgroundColor: theme.colors.accent,
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerTextWrap: {
        flex: 1,
        paddingRight: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        fontFamily: 'Avenir-Book',
    },
    modalSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    closeButton: {
        width: 36,
        height: 36,
        backgroundColor: theme.colors.cardMuted,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    noticeBox: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#efe2d4',
        padding: 14,
        marginBottom: 14,
    },
    noticeText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6d4f3b',
        marginBottom: 8,
    },
    supportText: {
        fontSize: 14,
        color: '#8b6a56',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.accent,
    },
    secondaryButton: {
        backgroundColor: '#8d6b56',
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default StopTimerModal;
