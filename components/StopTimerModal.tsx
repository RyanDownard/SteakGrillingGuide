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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Stop Timer</Text>
                    </View>

                    {/* Modal Body */}
                    <Text style={styles.modalSubtitle}>
                        Are you sure you want to stop the timer?
                    </Text>

                    <Text style={[styles.modalSubtitle, styles.modalWarning]}>
                        Stopping the timer cannot be undone, if you hit start again the timer will start from the longest steak time.
                        If you have steaks on the grill, you will need to monitor and maintain them until done on your own.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.goodButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.badButton]}
                            onPress={onStop}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    modalBody: {
        marginBottom: 20,
    },
    modalFooter: {
        alignSelf: 'flex-end',
        marginTop: 10,
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
      },
      badButton: {
        backgroundColor: '#d9534f',
      },
      goodButton: {
        backgroundColor: '#5cb85c',
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      modalWarning: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
    },
});

export default StopTimerModal;
