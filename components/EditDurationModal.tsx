import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

        const firstSideTotalSeconds = parseInt(firstSideMinutes, 10) * 60 + parseInt(firstSideSeconds, 10);
        const secondSideTotalSeconds = parseInt(secondSideMinutes, 10) * 60 + parseInt(secondSideSeconds, 10);

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
                            text: 'Continue',
                            onPress: () => resolve(true),
                        },
                        {
                            text: 'Cancel',
                            onPress: () => resolve(false),
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
        } else {
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
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.headerAccent} />
                        <View style={styles.modalHeader}>
                            <View style={styles.headerTextWrap}>
                                <Text style={styles.modalTitle}>{centerCook} - {duration.Thickness}"</Text>
                                <Text style={styles.modalSubtitle}>Adjust the cooking time for this steak profile.</Text>
                            </View>
                            <TouchableOpacity onPress={resetAndClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.sectionCard}>
                                <Text style={styles.sideText}>First Side</Text>
                                <View style={styles.sideContainer}>
                                    <View style={styles.settingContainer}>
                                        <Text style={styles.label}>Minutes</Text>
                                        <TextInput
                                            style={[globalStyles.input, styles.fieldInput]}
                                            placeholder="First Side Minutes"
                                            keyboardType="numeric"
                                            placeholderTextColor={'#a78d7a'}
                                            value={firstSideMinutes}
                                            maxLength={2}
                                            onChangeText={(text) => validateMinutesAndSetValue(text, setFirstSideMinutes)}
                                            enterKeyHint={'done'}
                                        />
                                    </View>
                                    <View style={styles.settingContainer}>
                                        <Text style={styles.label}>Seconds</Text>
                                        <TextInput
                                            style={[globalStyles.input, styles.fieldInput]}
                                            placeholder="First Side Seconds"
                                            keyboardType="numeric"
                                            placeholderTextColor={'#a78d7a'}
                                            value={firstSideSeconds}
                                            maxLength={2}
                                            onChangeText={text => validateSecondsAndSetValue(text, setFirstSideSeconds)}
                                            enterKeyHint={'done'}
                                        />
                                    </View>
                                </View>

                                {!isNaN(parseInt(firstSideMinutes, 10)) && !isNaN(parseInt(firstSideSeconds, 10)) ? (
                                    <Text style={styles.totalText}>{formatTime((parseInt(firstSideMinutes, 10) * 60) + parseInt(firstSideSeconds, 10))}</Text>
                                ) : (
                                    <Text style={styles.totalText}>Invalid Time</Text>
                                )}
                            </View>

                            <View style={styles.sectionCard}>
                                <Text style={styles.sideText}>Second Side</Text>
                                <View style={styles.sideContainer}>
                                    <View style={styles.settingContainer}>
                                        <Text style={styles.label}>Minutes</Text>
                                        <TextInput
                                            style={[globalStyles.input, styles.fieldInput]}
                                            placeholder="Second Side Minutes"
                                            keyboardType="numeric"
                                            placeholderTextColor={'#a78d7a'}
                                            value={secondSideMinutes}
                                            onChangeText={(text) => validateMinutesAndSetValue(text, setSecondSideMinutes)}
                                            maxLength={2}
                                            enterKeyHint={'done'}
                                        />
                                    </View>
                                    <View style={styles.settingContainer}>
                                        <Text style={styles.label}>Seconds</Text>
                                        <TextInput
                                            style={[globalStyles.input, styles.fieldInput]}
                                            placeholder="Second Side Seconds"
                                            keyboardType="numeric"
                                            maxLength={2}
                                            placeholderTextColor={'#a78d7a'}
                                            value={secondSideSeconds}
                                            onChangeText={text => validateSecondsAndSetValue(text, setSecondSideSeconds)}
                                            enterKeyHint={'done'}
                                        />
                                    </View>
                                </View>

                                {!isNaN(parseInt(secondSideMinutes, 10)) && !isNaN(parseInt(secondSideSeconds, 10)) ? (
                                    <Text style={styles.totalText}>{formatTime((parseInt(secondSideMinutes, 10) * 60) + parseInt(secondSideSeconds, 10))}</Text>
                                ) : (
                                    <Text style={styles.totalText}>Invalid Time</Text>
                                )}
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={saveAndClose}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={resetToDefault}>
                                    <FontAwesomeIcon icon={faRotateLeft} size={18} color={'#fff'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.tertiaryButton]} onPress={resetAndClose}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default EditDurationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(46, 30, 20, 0.65)',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    keyboardContainer: {
        width: '100%',
        maxWidth: 480,
    },
    modalContent: {
        width: '100%',
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
        marginBottom: 10,
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
    scrollContent: {
        paddingBottom: 8,
    },
    sectionCard: {
        backgroundColor: '#fffdf9',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#efe2d4',
    },
    sideText: {
        fontSize: 15,
        marginBottom: 8,
        fontWeight: '700',
        color: '#6d4f3b',
    },
    sideContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    settingContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6d4f3b',
        marginBottom: 6,
    },
    fieldInput: {
        backgroundColor: '#fffdf9',
        borderColor: '#e2d2c0',
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        marginBottom: 0,
    },
    totalText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: '#8a4f2e',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
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
    tertiaryButton: {
        backgroundColor: '#a68a7d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});
