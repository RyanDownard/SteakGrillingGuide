import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Duration } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import { formatTime } from '../data/Helpers';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import useSteakStore from '../stores/SteakStore';

interface EditDurationModalProps {
    visible: boolean;
    centerCook: string;
    duration: Duration | null;
    handleClose: () => void;
}

const EditDurationModal: React.FC<EditDurationModalProps> = ({ visible, centerCook, duration, handleClose }) => {
    const [firstSideMinutes, setFirstSideMinutes] = useState('');
    const [firstSideSeconds, setFirstSideSeconds] = useState('');
    const [secondSideMinutes, setSecondSideMinutes] = useState('');
    const [secondSideSeconds, setSecondSideSeconds] = useState('');

    const { setOverride, removeOverride, checkIfSteakIsInList } = useSteakStore();

    useEffect(() => {
        if (visible && duration) {
            setFirstSideMinutes(Math.floor((duration?.FirstSideOverride ?? duration.FirstSide) / 60).toString());
            setFirstSideSeconds(((duration?.FirstSideOverride ?? duration.FirstSide) % 60).toString());
            setSecondSideMinutes(Math.floor((duration?.SecondSideOverride ?? duration.SecondSide) / 60).toString());
            setSecondSideSeconds(((duration?.SecondSideOverride ?? duration.SecondSide) % 60).toString());
        }
    }, [visible, duration, centerCook]);

    const validateMinutesAndSetValue = (text: string, setMethod: (value: string) => void) => {
        if (text.includes('.')) {
            Alert.alert('Invalid input', 'Please enter a whole number without decimals');
            return;
        }

        if (isNaN(Number(text))) {
            Alert.alert('Invalid input', 'All values must be a number');
            return;
        }

        if (parseInt(text, 10) < 0 || parseInt(text, 10) > 20) {
            Alert.alert('Invalid input', 'Minutes must be between 0 and 20');
            return;
        }

        setMethod(text);
    };

    const validateSecondsAndSetValue = (text: string, setMethod: (value: string) => void) => {
        if (text.includes('.')) {
            Alert.alert('Invalid input', 'Please enter a whole number without decimals');
            return;
        }

        if (isNaN(Number(text))) {
            Alert.alert('Invalid input', 'All values must be a number');
            return;
        }

        if (parseInt(text, 10) < 0 || parseInt(text, 10) >= 60) {
            Alert.alert('Invalid input', 'Seconds must be between 0 and 59');
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

    const resetToDefault = () => {
        if (!duration) { return; }

        setFirstSideMinutes(Math.floor(duration.FirstSide / 60).toString());
        setFirstSideSeconds((duration.FirstSide % 60).toString());
        setSecondSideMinutes(Math.floor(duration.SecondSide / 60).toString());
        setSecondSideSeconds((duration.SecondSide % 60).toString());
    };

    const saveAndClose = async () => {
        if (!firstSideMinutes || !firstSideSeconds || !secondSideMinutes || !secondSideSeconds) {
            Alert.alert('Incomplete data', 'Please fill in all fields before saving.');
            return;
        }

        let firstSideTotalSeconds = parseInt(firstSideMinutes, 10) * 60 + parseInt(firstSideSeconds, 10);
        let secondSideTotalSeconds = parseInt(secondSideMinutes, 10) * 60 + parseInt(secondSideSeconds, 10);

        if (firstSideTotalSeconds <= 0 || firstSideTotalSeconds > 1200) {
            Alert.alert('Invalid time', 'First side must be between 1 and 20 minutes.');
            return;
        }

        if (secondSideTotalSeconds <= 0 || secondSideTotalSeconds > 1200) {
            Alert.alert('Invalid time', 'Second side must be between 1 and 20 minutes.');
            return;
        }

        if (checkIfSteakIsInList(centerCook, duration!.Thickness)) {
            const userConfirmed = await new Promise<boolean>((resolve) => {
                Alert.alert(
                    'Settings In Use',
                    `A steak with ${centerCook} and ${duration!.Thickness}" has already been added to your list and it's times will be updated, do you want to continue?`,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => resolve(false),
                            style: 'cancel',
                        },
                        {
                            text: 'Continue',
                            onPress: () => resolve(true),
                        },
                    ]
                );
            });
            if (!userConfirmed) {
                return;
            }
        }

        if (duration?.FirstSide === firstSideTotalSeconds && duration.SecondSide === secondSideTotalSeconds) {
            removeOverride(centerCook, duration!.Thickness);
        }
        else {
            const override = {
                FirstSideOverride: firstSideTotalSeconds !== duration?.FirstSide ? firstSideTotalSeconds : undefined,
                SecondSideOverride: secondSideTotalSeconds !== duration?.SecondSide ? secondSideTotalSeconds : undefined,
            };

            setOverride(centerCook, duration!.Thickness, override);
        }

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
                                onChangeText={(text) => validateMinutesAndSetValue(text, setFirstSideMinutes)}
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
                                onChangeText={text => validateSecondsAndSetValue(text, setFirstSideSeconds)}
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
                                onChangeText={(text) => validateMinutesAndSetValue(text, setSecondSideMinutes)}
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
                                onChangeText={text => validateSecondsAndSetValue(text, setSecondSideSeconds)}
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

                    <View style={globalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[globalStyles.button, globalStyles.saveButton]}
                            onPress={saveAndClose}
                        >
                            <Text style={globalStyles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetButton} onPress={resetToDefault}>
                            <FontAwesomeIcon icon={faRotateLeft} size={25} color={'#2ea7f3ff'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[globalStyles.button, globalStyles.cancelButton]}
                            onPress={resetAndClose}
                        >
                            <Text style={globalStyles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
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
    },
    resetButton: {
        marginTop: 5,
    },
});
