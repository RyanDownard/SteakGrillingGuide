import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { CookData, Duration } from '../data/SteakData';
import ToggleContentButton from '../components/ToggleContentButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import globalStyles from '../styles/globalStyles';
import Table from '../components/Table';
import { formatTime } from '../data/Helpers';
import EditDurationModal from '../components/EditDurationModal';
import useSteakStore from '../stores/SteakStore';
import useTimerStore from '../stores/TimerStore';
import useToastStore from '../stores/ToastStore';
import Timer from '../components/Timer';

interface SteakSettingProps {
    steakSetting: CookData;
    setCenterCook: (centerCook: string) => void;
    setDuration: (duration: Duration) => void;
    setModalVisible: (visible: boolean) => void;
}

const SteakSetting: React.FC<SteakSettingProps> = ({ steakSetting, setCenterCook, setDuration, setModalVisible }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { removeOverride } = useSteakStore();
    const { timerRunning } = useTimerStore();

    const editSteakSetting = (duration: Duration) => {
        setCenterCook(steakSetting.CenterCook);
        setDuration(duration);
        setModalVisible(true);
    };

    const resetCenterCookDefaults = async (cookData: CookData) => {
        Alert.alert(
            'Reset Times',
            `Are you sure you want to reset all times for ${cookData.CenterCook}?`,
            [
                {
                    text: 'Reset',
                    onPress: async () => {
                        cookData.Durations.forEach(async (duration: Duration) => {
                            await removeOverride(cookData.CenterCook, duration.Thickness);
                        });
                    },
                },
                {
                    text: 'Cancel',
                },
            ],
        );
    };

    return (
        <View style={[globalStyles.card, styles.settingCard]}>
            <View style={styles.settingHeader}>
                <View style={styles.settingTitleWrap}>
                    <Text style={styles.settingTitle}>{steakSetting.CenterCook}</Text>
                    <Text style={styles.settingSubtitle}>Adjust default cook times for this doneness.</Text>
                </View>
                <TouchableOpacity
                    disabled={timerRunning}
                    style={[styles.resetButton, timerRunning && styles.resetButtonDisabled]}
                    onPress={() => resetCenterCookDefaults(steakSetting)}
                >
                    <FontAwesomeIcon icon={faRotateLeft} size={18} color={timerRunning ? '#949799' : '#2ea7f3ff'} />
                </TouchableOpacity>
            </View>

            <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{isExpanded ? 'Hide timings' : 'View timings'}</Text>
                <ToggleContentButton
                    expanded={isExpanded}
                    onChange={() => setIsExpanded(!isExpanded)}
                />
            </View>

            {isExpanded && (
                <View style={styles.tableWrapper}>
                    <Table
                        headers={['Thickness', 'First Side', 'Second Side', 'Edit']}
                        rows={steakSetting.Durations.map((duration: Duration) => {
                            return [
                                `${duration.Thickness}"`,
                                `${formatTime(duration.FirstSideOverride ?? duration.FirstSide)}${duration.FirstSideOverride ? '*' : ''}`,
                                `${formatTime(duration.SecondSideOverride ?? duration.SecondSide)}${duration.SecondSideOverride ? '*' : ''}`,
                                <TouchableOpacity key={`${steakSetting.CenterCook}-${duration.Thickness}`} disabled={timerRunning} onPress={() => editSteakSetting(duration)}>
                                    <FontAwesomeIcon icon={faPencil} size={18} color={timerRunning ? '#949799' : '#e3cf17'} />
                                </TouchableOpacity>,
                            ];
                        })}
                    />
                    <Text style={styles.tableHint}>Values marked with * are custom overrides.</Text>
                </View>
            )}
        </View>
    );
};

const EditTimes = () => {
    const [editingDuration, setEditingDuration] = useState<Duration | null>(null);
    const [editingCenterCook, setEditingCenterCook] = useState('');
    const [modalVisable, setModalVisible] = useState(false);

    const { timerRunning } = useTimerStore();
    const { clearAllOverrides, settings } = useSteakStore();
    const { showToast } = useToastStore();

    const resetAllDefaults = async () => {
        Alert.alert(
            'Reset All Times',
            'Are you sure you want to reset all times to their default values for all cooks and thicknesses?',
            [
                {
                    text: 'Reset',
                    onPress: async () => {
                        await clearAllOverrides();
                        showToast('All custom times reset to defaults.');
                    },
                },
                {
                    text: 'Cancel',
                },
            ],
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Timer />
            {timerRunning && (
                <View style={globalStyles.dangerContainer}>
                    <Text style={globalStyles.textDangerWhite}>Timer is running, you cannot edit times</Text>
                </View>
            )}

            <View style={styles.headerSection}>
                <Text style={styles.pageTitle}>Edit Default Times</Text>
                <Text style={styles.pageDescription}>
                    Fine-tune each doneness so your favorite steaks are ready the way you like.
                </Text>
                <TouchableOpacity
                    disabled={timerRunning}
                    style={[styles.resetAllButton, timerRunning && styles.resetAllButtonDisabled]}
                    onPress={resetAllDefaults}
                >
                    <Text style={[styles.resetAllText, timerRunning && styles.resetAllTextDisabled]}>
                        Reset All Defaults
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={settings}
                keyExtractor={(item: CookData) => item.CenterCook}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <SteakSetting
                        steakSetting={item}
                        setCenterCook={setEditingCenterCook}
                        setDuration={setEditingDuration}
                        setModalVisible={setModalVisible}
                    />
                )}
            />

            <EditDurationModal
                visible={modalVisable}
                centerCook={editingCenterCook}
                duration={editingDuration}
                handleClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default EditTimes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf8f4',
    },
    headerSection: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 8,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: '700',
        fontFamily: 'CormorantGaramond-Bold',
        color: '#2a1a0e',
        marginBottom: 4,
    },
    pageDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#7a6d62',
        fontFamily: 'DMSans-Regular',
        marginBottom: 12,
    },
    resetAllButton: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: '#2ea7f3ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#f4fbff',
    },
    resetAllButtonDisabled: {
        borderColor: '#d5dce0',
        backgroundColor: '#f4f5f6',
    },
    resetAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2ea7f3ff',
        fontFamily: 'DMSans-Regular',
    },
    resetAllTextDisabled: {
        color: '#9aa3a8',
    },
    listContent: {
        paddingBottom: 24,
        paddingHorizontal: 4,
    },
    settingCard: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0e8df',
        padding: 14,
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    settingTitleWrap: {
        flex: 1,
        paddingRight: 8,
    },
    settingTitle: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'CormorantGaramond-Bold',
        color: '#2a1a0e',
    },
    settingSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: '#a08070',
        fontFamily: 'DMSans-Regular',
    },
    resetButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f9ff',
        borderWidth: 1,
        borderColor: '#d9ecfb',
    },
    resetButtonDisabled: {
        backgroundColor: '#f4f5f6',
        borderColor: '#e2e6e8',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6,
    },
    toggleLabel: {
        fontSize: 13,
        color: '#7a6d62',
        fontFamily: 'DMSans-Regular',
    },
    tableWrapper: {
        marginTop: 10,
    },
    tableHint: {
        marginTop: 8,
        fontSize: 12,
        color: '#a08070',
        fontFamily: 'DMSans-Regular',
    },
});
