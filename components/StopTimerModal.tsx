import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

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
        backgroundColor: 'rgba(46, 30, 20, 0.65)',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#fdf8f4',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ecdccc',
        shadowColor: '#5a3d2a',
        shadowOpacity: 0.16,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 7,
    },
    headerAccent: {
        height: 4,
        borderRadius: 999,
        backgroundColor: '#c97a45',
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
        color: '#2a1a0e',
        fontFamily: 'Avenir-Book',
    },
    modalSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: '#8b6a56',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f6ebdf',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#8b6a56',
        fontWeight: '600',
    },
    noticeBox: {
        backgroundColor: '#fffdf9',
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
        backgroundColor: '#c97a45',
    },
    secondaryButton: {
        backgroundColor: '#8d6b56',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default StopTimerModal;
