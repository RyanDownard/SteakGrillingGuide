import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Steak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import useSteakStore from '../stores/SteakStore';


interface StartTimerModalProps {
    visible: boolean;
    steaks: Steak[];
    onClose: () => void;
    onStart: () => void;
}

const StartTimerModal: React.FC<StartTimerModalProps> = ({
    visible,
    steaks,
    onClose,
    onStart,
}) => {
    const longestTime = Math.max(...steaks.map(o => o.firstSideTime + o.secondSideTime));
    const { checkIfListSteaksHaveOverrides } = useSteakStore();

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
                    <View style={globalStyles.modalHeader}>
                        <Text style={globalStyles.modalTitle}>Before You Grill</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={globalStyles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.longTextContainer}>
                        {checkIfListSteaksHaveOverrides() && (
                            <View style={globalStyles.dangerContainer}>
                                <Text style={globalStyles.textDangerWhite}>
                                    Some steaks have custom cooking times set. You are responsible for the final result and cook.
                                </Text>
                            </View>
                        )}

                        <Text style={globalStyles.modalWarning}>
                            Do not leave your grill unattended while steaks are being cooked.
                        </Text>

                        <Text style={globalStyles.modalWarning}>
                            You will be guided to grilling your steaks, but you must ensure they are cooked properly before serving.
                        </Text>

                        <Text style={globalStyles.modalText}>
                            Be sure your grill is preheated and ready to go. When ready, place the following steak and hit "Start!".
                        </Text>
                    </ScrollView>


                    {longestTimeSteaks.length > 0 && (
                        <FlatList
                            data={longestTimeSteaks}
                            keyExtractor={(item: Steak) => item.personName}
                            renderItem={({ item }: { item: Steak }) =>
                                <View style={styles.steakStartDetails}>
                                    <Text>{item.personName}</Text>
                                    <Text>
                                        {item.centerCook} - {item.thickness}"
                                    </Text>
                                </View>}
                        />
                    )}

                    {longestTimeSteaks.length === 0 && (
                        <Text>No steaks added yet.</Text>
                    )}
                    <View style={globalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                globalStyles.button,
                                globalStyles.goodButton,
                            ]}
                            onPress={onStart}
                        >
                            <Text style={globalStyles.buttonText}>Start!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[globalStyles.button, globalStyles.badButton]}
                        >
                            <Text style={globalStyles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    steakStartDetails: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    longTextContainer: {
        maxHeight: 400,
        paddingBottom: 10,
    },
});

export default StartTimerModal;
