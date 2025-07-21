import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Duration } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import { formatTime } from '../data/Helpers';


interface EditDurationModalProps {
    visible: boolean;
    centerCook: string;
    duration: Duration | null;
    handleClose: () => void;
}

const EditDurationModal: React.FC<EditDurationModalProps> = ({ visible, centerCook, duration, handleClose }) => {
    const [firstSideMinutes, setFirstSideMinutes] = useState(duration ? (duration.FirstSide / 60).toString() : '');
    const [firstSideSeconds, setFirstSideSeconds] = useState(duration ? (duration.FirstSide % 60).toString() : '');
    const [secondSideMinutes, setSecondSideMinutes] = useState(duration ? (duration.SecondSide / 60).toString() : '');
    const [secondSideSeconds, setSecondSideSeconds] = useState(duration ? (duration.SecondSide % 60).toString() : '');

    useEffect(() => {
        if (visible && duration) {
            setFirstSideMinutes((duration.FirstSide / 60).toString());
            setFirstSideSeconds((duration.FirstSide % 60).toString());
            setSecondSideMinutes((duration.SecondSide / 60).toString());
            setSecondSideSeconds((duration.SecondSide % 60).toString());
        }
    }, [visible, duration]);

    const validateAndSetValue = (text: string, setMethod: (value: string) => void) => {
        if (text.includes('.')) {
            Alert.alert('Invalid input', 'Please enter a whole number without decimals');
            return;
        }

        if (isNaN(Number(text))) {
            Alert.alert('Invalid input', 'All values must be a number');
            return;
        }

        setMethod(text);
    };

    const resetAndClose = () => {
        setFirstSideMinutes('');
        setFirstSideSeconds('');
        setSecondSideMinutes('');
        setSecondSideSeconds('');
        handleClose();
    };

    const saveAndClose = () => {
        if (!firstSideMinutes || !firstSideSeconds || !secondSideMinutes || !secondSideSeconds) {
            Alert.alert('Incomplete data', 'Please fill in all fields before saving.');
            return;
        }

        let firstSideTotalSeconds = parseInt(firstSideMinutes) * 60 + parseInt(firstSideSeconds);
        let secondSideTotalSeconds = parseInt(secondSideMinutes) * 60 + parseInt(secondSideSeconds);

        if (firstSideTotalSeconds <= 0 || firstSideTotalSeconds > 1200) {
            Alert.alert('Invalid time', 'First side must be between 1 and 20 minutes.');
            return;
        }

        if (secondSideTotalSeconds <= 0 || secondSideTotalSeconds > 1200) {
            Alert.alert('Invalid time', 'Second side must be between 1 and 20 minutes.');
            return;
        }

        const newDuration: Duration = {
            Thickness: duration ? duration.Thickness : 0,
            FirstSide: parseInt(firstSideMinutes) * 60 + parseInt(firstSideSeconds),
            SecondSide: parseInt(secondSideMinutes) * 60 + parseInt(secondSideSeconds),
        };

        resetAndClose();
    };

    if (!duration) { return null; }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            presentationStyle={'overFullScreen'}
        >
            <View style={globalStyles.modalOverlay}>
                <View style={globalStyles.modalContent}>
                    <View style={globalStyles.modalHeader}>
                        <Text style={globalStyles.modalTitle}>
                            {centerCook} - {duration.Thickness}"
                        </Text>
                        <TouchableOpacity onPress={resetAndClose}>
                            <Text style={globalStyles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={globalStyles.modalBody}>
                        <Text style={styles.sideText}>First Side</Text>
                        <View style={styles.sideContainer}>
                            <View style={styles.settingContainer}>
                                <Text style={[globalStyles.label]}>Minutes:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="First Side Minutes"
                                    keyboardType="numeric"
                                    placeholderTextColor={'#aaa'}
                                    value={firstSideMinutes}
                                    maxLength={2}
                                    onChangeText={(text) => validateAndSetValue(text, setFirstSideMinutes)}
                                    enterKeyHint={'done'}
                                />
                            </View>
                            <View style={styles.settingContainer}>
                                <Text style={globalStyles.label}>Seconds:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="First Side Seconds"
                                    keyboardType="numeric"
                                    placeholderTextColor={'#aaa'}
                                    value={firstSideSeconds}
                                    maxLength={2}
                                    onChangeText={text => validateAndSetValue(text, setFirstSideSeconds)}
                                    enterKeyHint={'done'}
                                />
                            </View>
                        </View>

                        {!isNaN(parseInt(firstSideMinutes, 10)) && !isNaN(parseInt(firstSideSeconds, 10)) ?
                            <Text style={styles.totalText}>
                                {formatTime((parseInt(firstSideMinutes, 10) * 60) + parseInt(firstSideSeconds, 10))}
                            </Text>
                            :
                            <Text style={styles.totalText}>
                                Invalid Time
                            </Text>
                        }

                        <Text style={styles.sideText}>Second Side</Text>
                        <View style={styles.sideContainer}>
                            <View style={styles.settingContainer}>
                                <Text style={[globalStyles.label]}>Minutes:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="Second Side Minutes"
                                    keyboardType="numeric"
                                    placeholderTextColor={'#aaa'}
                                    value={secondSideMinutes}
                                    onChangeText={(text) => validateAndSetValue(text, setSecondSideMinutes)}
                                    maxLength={2}
                                    enterKeyHint={'done'}
                                />
                            </View>
                            <View style={styles.settingContainer}>
                                <Text style={globalStyles.label}>Seconds:</Text>
                                <TextInput
                                    style={globalStyles.input}
                                    placeholder="Second Side Seconds"
                                    keyboardType="numeric"
                                    maxLength={2}
                                    placeholderTextColor={'#aaa'}
                                    value={secondSideSeconds}
                                    onChangeText={text => validateAndSetValue(text, setSecondSideSeconds)}
                                    enterKeyHint={'done'}
                                />
                            </View>
                        </View>

                        {!isNaN(parseInt(secondSideMinutes, 10)) && !isNaN(parseInt(secondSideSeconds, 10)) ?
                            <Text style={styles.totalText}>
                                {formatTime((parseInt(secondSideMinutes, 10) * 60) + parseInt(secondSideSeconds, 10))}
                            </Text>
                            :
                            <Text style={styles.totalText}>
                                Invalid Time
                            </Text>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditDurationModal;

const styles = StyleSheet.create({
    sideText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    sideContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 25,
    },
    settingContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    totalContainer: {
        justifyContent: 'center',
        marginBottom: 10,
    },
    totalText: {
        fontSize: 16,
        textAlign: 'center',
    }
});
