import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
} from 'react-native';
import globalStyles from '../styles/globalStyles';

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
            <View style={globalStyles.modalOverlay}>
                <View style={globalStyles.modalContent}>
                    <View style={globalStyles.modalHeader}>
                        <Text style={globalStyles.modalTitle}>Stop Timer</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={globalStyles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={globalStyles.modalSubtitle}>
                        Are you sure you want to stop the timer?
                    </Text>

                    <Text style={[globalStyles.modalSubtitle, globalStyles.modalWarning]}>
                        Stopping the timer cannot be undone, if you hit start again the timer will start from the longest steak time.
                        If you have steaks on the grill, you will need to monitor and maintain them until done on your own.
                    </Text>

                    <View style={globalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[globalStyles.button, globalStyles.badButton]}
                            onPress={onStop}
                        >
                            <Text style={globalStyles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[globalStyles.button, globalStyles.goodButton]}
                            onPress={onClose}
                        >
                            <Text style={globalStyles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StopTimerModal;
