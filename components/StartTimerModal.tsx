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
import useSteakStore from '../stores/SteakStore';
import { theme } from '../styles/theme';

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
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.headerAccent} />
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTextWrap}>
                            <Text style={styles.modalTitle}>Before You Grill</Text>
                            <Text style={styles.modalSubtitle}>You’re about to start the cook cycle.</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.longTextContainer} showsVerticalScrollIndicator={false}>
                        {checkIfListSteaksHaveOverrides() && (
                            <View style={styles.warningBox}>
                                <Text style={styles.warningText}>
                                    Some steaks have custom cooking times set. You are responsible for the final result and cook.
                                </Text>
                            </View>
                        )}

                        <Text style={styles.bodyText}>
                            Do not leave your grill unattended while steaks are being cooked.
                        </Text>

                        <Text style={styles.bodyText}>
                            You will be guided through the grilling steps, but you must ensure they are cooked properly before serving.
                        </Text>

                        <Text style={styles.bodyText}>
                            Be sure your grill is preheated and ready to go. When ready, place the following steak and hit “Start!”.
                        </Text>
                    </ScrollView>

                    {longestTimeSteaks.length > 0 && (
                        <FlatList
                            data={longestTimeSteaks}
                            keyExtractor={(item: Steak) => `${item.personName}-${item.centerCook}`}
                            scrollEnabled={false}
                            renderItem={({ item }: { item: Steak }) => (
                                <View style={styles.steakStartDetails}>
                                    <Text style={styles.steakName}>{item.personName}</Text>
                                    <Text style={styles.steakMeta}>{item.centerCook} - {item.thickness}"</Text>
                                </View>
                            )}
                        />
                    )}

                    {longestTimeSteaks.length === 0 && (
                        <Text style={styles.emptyState}>No steaks added yet.</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onStart}>
                            <Text style={styles.buttonText}>Start!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={[styles.actionButton, styles.secondaryButton]}>
                            <Text style={styles.buttonText}>Close</Text>
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
        marginBottom: 10,
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
        borderRadius: 18,
        backgroundColor: theme.colors.cardMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    longTextContainer: {
        maxHeight: 300,
        paddingBottom: 8,
    },
    warningBox: {
        backgroundColor: '#fff2e6',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.accentSoft,
    },
    warningText: {
        fontSize: 14,
        color: '#8a4f2e',
        lineHeight: 20,
    },
    bodyText: {
        fontSize: 14,
        color: '#6d4f3b',
        lineHeight: 20,
        marginBottom: 8,
    },
    steakStartDetails: {
        marginTop: 10,
        padding: 12,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#efe2d4',
    },
    steakName: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text,
    },
    steakMeta: {
        marginTop: 4,
        fontSize: 13,
        color: theme.colors.textMuted,
    },
    emptyState: {
        marginTop: 10,
        textAlign: 'center',
        color: '#8b6a56',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
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

export default StartTimerModal;
