import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Steak } from '../data/SteakData';


interface StartTimerModalProps {
    visible: boolean;
    steaks: Steak[]; // Array of steaks
    onClose: () => void;
    onStart: () => void; // Function to start the timer with the longest time
}

const StartTimerModal: React.FC<StartTimerModalProps> = ({
    visible,
    steaks,
    onClose,
    onStart,
}) => {
    const longestTime = Math.max(...steaks.map(o => o.firstSideTime + o.secondSideTime));

    const longestTimeSteaks = steaks.filter(function (entry) { return entry.firstSideTime + entry.secondSideTime === longestTime; });

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
                        <Text style={styles.modalTitle}>Before You Grill</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal Body */}
                    <Text style={styles.modalText}>
                        You are about to start the timer for your steaks. Be sure your
                        steaks and grill are ready. When ready, place the following steaks
                        on the grill and hit start.
                    </Text>

                    <Text style={styles.modalWarning}>
                        Do not leave your grill unattended while steaks are being cooked.
                        You will be notified when changes need to be made, but you must
                        monitor the grill and steaks at all times.
                    </Text>

                    <Text style={styles.modalWarning}>
                        The notifications and timer are meant to help guide you, but you are
                        responsible for being safe and ensuring your steak is properly
                        cooked.
                    </Text>

                    ({longestTimeSteaks.length > 0 ? (
                        <FlatList
                            data={longestTimeSteaks}
                            keyExtractor={(item: Steak) => item.personName}
                            renderItem={({ item }: { item: Steak }) =>
                                <View style={styles.steakDetails}>
                                    <Text>{item.personName}</Text>
                                    <Text>
                                        {item.centerCook} - {item.thickness}"
                                    </Text>
                                </View>}
                        />
                    ) : null})

                    ({longestTimeSteaks.length === 0 ? (
                        <View>No steaks added yet.</View>
                    ) : null})

                    {/* Footer Buttons */}
                    <View style={styles.footerButtons}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.closeButtonStyle]}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.startButtonStyle
                            ]}
                            onPress={onStart}
                        >
                            <Text style={styles.buttonText}>Start!</Text>
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
    closeButton: {
        fontSize: 20,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    modalWarning: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
    },
    steakDetails: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonStyle: {
        backgroundColor: '#ccc',
    },
    startButtonStyle: {
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },

});

export default StartTimerModal;
