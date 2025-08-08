import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
        Alert.alert('Reset Times', `Are you sure you want to reset all times for ${cookData.CenterCook}?`,
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
            ]
        );
    };

    return (
        <View style={globalStyles.card}>
            <View style={styles.resetAllContainer}>
                <Text style={styles.settingText}>{steakSetting.CenterCook}</Text>
                <TouchableOpacity disabled={timerRunning} style={styles.resetButton} onPress={() => resetCenterCookDefaults(steakSetting)}>
                    <FontAwesomeIcon icon={faRotateLeft} size={25} color={timerRunning ? '#949799' : '#2ea7f3ff'} />
                </TouchableOpacity>
            </View>
            <ToggleContentButton
                expanded={isExpanded}
                onChange={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded && (
                <Table
                    headers={['Thickness', 'First Side', 'Second Side', 'Edit']}
                    rows={steakSetting.Durations.map((duration: Duration) => {
                        return [
                            `${duration.Thickness}"`,
                            `${formatTime(duration.FirstSideOverride ?? duration.FirstSide)}${duration.FirstSideOverride ? '*' : ''}`,
                            `${formatTime(duration.SecondSideOverride ?? duration.SecondSide)}${duration.SecondSideOverride ? '*' : ''}`,
                            <TouchableOpacity disabled={timerRunning} onPress={() => editSteakSetting(duration)}>
                                <FontAwesomeIcon icon={faPencil} size={20} color={timerRunning ? '#949799' : '#e3cf17'} />
                            </TouchableOpacity>,
                        ];
                    })}
                />
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

    const resetAllDefaults = async () => {
        Alert.alert('Reset All Times', 'Are you sure you want to reset all times to their default values for all cooks and thicknesses?',
            [
                {
                    text: 'Reset',
                    onPress: async () => {
                        await clearAllOverrides();
                    },
                },
                {
                    text: 'Cancel',
                },
            ]
        );
    };

    return (
        <>
            {timerRunning && (
                <View style={globalStyles.timerRunningContainer}>
                    <Text style={globalStyles.timerRunningText}>Timer is running, you cannot edit times</Text>
                </View>
            )}
            <View style={styles.resetAllContainer}>
                <TouchableOpacity disabled={timerRunning} style={[globalStyles.fontAwesomeButton, globalStyles.infoButtonOutline, timerRunning && globalStyles.disabledButton]} onPress={resetAllDefaults}>
                    <Text style={!timerRunning && globalStyles.infoButtonText}>
                        Reset All Defaults
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={settings}
                keyExtractor={(item: CookData) => item.CenterCook}
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
                handleClose={() => setModalVisible(false)} />
        </>
    );
};

export default EditTimes;

const styles = StyleSheet.create({
    settingContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
    },
    settingText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    resetAllContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    resetButton: {
        marginRight: 5,
        marginTop: 5,
    },
});
