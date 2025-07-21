import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import steakSettings from '../data/SteakSettings.json';
import { CookData, Duration } from '../data/SteakData';
import ToggleContentButton from '../components/ToggleContentButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import globalStyles from '../styles/globalStyles';
import Table from '../components/Table';
import { formatTime } from '../data/Helpers';
import EditDurationModal from '../components/EditDurationModal';

interface SteakSettingProps {
    steakSetting: CookData;
    setCenterCook: (centerCook: string) => void;
    setDuration: (duration: Duration) => void;
    setModalVisible: (visible: boolean) => void;
}

const SteakSetting: React.FC<SteakSettingProps> = ({steakSetting, setCenterCook, setDuration, setModalVisible}) => {
    const [isExpanded, setIsExpanded] = useState(false);


    const editSteakSetting = (duration: Duration) => {
        console.log(duration);
        setCenterCook(steakSetting.CenterCook);
        setDuration(duration);
        setModalVisible(true);
    };

    return (
        <View style={globalStyles.card}>
            <Text style={styles.settingText}>{steakSetting.CenterCook}</Text>
            <ToggleContentButton
                expanded={isExpanded}
                onChange={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded && (
                <Table
                    headers={['Thickness', 'First Side', 'Second Side', 'Edit']}
                    rows={steakSetting.Durations.map((duration: Duration) => [
                        `${duration.Thickness}"`,
                        formatTime(duration.FirstSide),
                        formatTime(duration.SecondSide),
                        <TouchableOpacity onPress={() => editSteakSetting(duration)}>
                            <FontAwesomeIcon icon={faPencil} size={20} color={'#e3cf17'} />
                        </TouchableOpacity>,
                    ])} />
            )}
        </View>
    );
}

const EditTimes = () => {
    const [editingDuration, setEditingDuration] = useState<Duration | null>(null);
    const [editingCenterCook, setEditingCenterCook] = useState('');
    const [modalVisable, setModalVisible] = useState(false);

    return (
        <>
            <FlatList
                data={steakSettings}
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
});
