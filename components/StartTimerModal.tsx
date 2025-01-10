import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Steak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';


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
            <View style={globalStyles.modalOverlay}>
                <View style={globalStyles.modalContent}>
                    {/* Modal Header */}
                    <View style={globalStyles.modalHeader}>
                        <Text style={globalStyles.modalTitle}>Before You Grill</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={globalStyles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Modal Body */}
                    <Text style={globalStyles.modalText}>
                        You are about to start the timer for your steaks. Be sure your
                        steaks and grill are ready. When ready, place the following steaks
                        on the grill and hit start.
                    </Text>

                    <Text style={globalStyles.modalWarning}>
                        Do not leave your grill unattended while steaks are being cooked.
                        You will be notified when changes need to be made, but you must
                        monitor the grill and steaks at all times.
                    </Text>

                    <Text style={globalStyles.modalWarning}>
                        The notifications and timer are meant to help guide you, but you are
                        responsible for being safe and ensuring your steak is properly
                        cooked.
                    </Text>

                    ({longestTimeSteaks.length > 0 ? (
                        <FlatList
                            data={longestTimeSteaks}
                            keyExtractor={(item: Steak) => item.personName}
                            renderItem={({ item }: { item: Steak }) =>
                                <View style={globalStyles.steakStartDetails}>
                                    <Text>{item.personName}</Text>
                                    <Text>
                                        {item.centerCook} - {item.thickness}"
                                    </Text>
                                </View>}
                        />
                    ) : null})

                    ({longestTimeSteaks.length === 0 ? (
                        <Text>No steaks added yet.</Text>
                    ) : null})

                    {/* Footer Buttons */}
                    <View style={globalStyles.footerButtons}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[globalStyles.button, globalStyles.badButton]}
                        >
                            <Text style={globalStyles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                globalStyles.button,
                                globalStyles.goodButton,
                            ]}
                            onPress={onStart}
                        >
                            <Text style={globalStyles.buttonText}>Start!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default StartTimerModal;
