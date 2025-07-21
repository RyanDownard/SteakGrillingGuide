import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../data/Helpers';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useTimerStore from '../stores/TimerStore';
import * as Progress from 'react-native-progress';
import ToggleContentButton from './ToggleContentButton';
import Table from './Table';

interface Props {
    steak: Steak;
    onEdit: (steak: Steak) => void;
    onDelete: (steak: Steak) => void;
    actionsDisabled: boolean;
}

interface ListProps {
    steaks: Steak[];
    onEdit: (steak: Steak) => void;
    onDelete: (steak: Steak) => void;
    actionsDisabled: boolean;
}

const SteakItem: React.FC<Props> = ({ steak, onEdit, onDelete, actionsDisabled }) => {
    const [expanded, setExpanded] = useState(false);
    const [progress, setProgress] = useState(0);
    const { addSavedSteak } = useSavedSteaksStore();
    const { timerRunning, remainingTime, duration } = useTimerStore();

    const handleSaveSteakToDevice = (steakToSave: Steak) => {
        addSavedSteak(steakToSave);
    };

    useEffect(() => {
        if (timerRunning) {
            if(remainingTime > steak.firstSideTime + steak.secondSideTime){
                const totalWaitTime = duration - (steak.firstSideTime + steak.secondSideTime);
                setProgress((remainingTime - steak.firstSideTime - steak.secondSideTime) / totalWaitTime);
            }
            else if(remainingTime > steak.secondSideTime){
                const interRemaining = remainingTime - steak.secondSideTime;
                setProgress(interRemaining / steak.firstSideTime);
            }
            else{
                setProgress(remainingTime / steak.secondSideTime);
            }
        } else {
            setProgress(0);
        }
    }, [remainingTime, timerRunning, duration, steak.firstSideTime, steak.secondSideTime]);

    return (
        <View>
            <View style={globalStyles.card}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{steak.personName}</Text>
                    <Text style={styles.steakCookDetails}>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                    {timerRunning && (
                        <Progress.Circle progress={progress} color={steak.isPlaced ? '#017a40' : '#fcca03'} size={23} thickness={2} />
                    )}
                </View>
                <ToggleContentButton expanded={expanded} onChange={() => setExpanded(!expanded)} />
                {expanded ? (
                    <View style={styles.details}>
                        <View style={styles.buttonsContainer}>
                            {(steak.savedSteak === null || steak.savedSteak === undefined ? (
                                <TouchableOpacity style={[globalStyles.actionButton, globalStyles.infoButtonOutline]} onPress={() => handleSaveSteakToDevice(steak)}>
                                    <FontAwesomeIcon icon={faSave} size={24} color={'#029af2'} />
                                </TouchableOpacity>
                            ) : null)}
                            <TouchableOpacity style={[globalStyles.actionButton, globalStyles.editButton, actionsDisabled && globalStyles.disabledButton]} onPress={() => onEdit(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faPencil} size={24} color={actionsDisabled ? '#949799' : '#e3cf17'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[globalStyles.actionButton, globalStyles.deleteButton, actionsDisabled && globalStyles.disabledButton]} onPress={() => onDelete(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faTrash} size={24} color={actionsDisabled ? '#949799' : '#c70404'} />
                            </TouchableOpacity>
                        </View>
                        <Table
                            headers={['Starts At', 'Flips At']}
                            rows={[
                                [formatTime(steak.firstSideTime + steak.secondSideTime), formatTime(steak.secondSideTime)],
                            ]} />
                    </View>
                ) : null}
            </View>
        </View>
    );
};

const SteakList: React.FC<ListProps> = ({ steaks, onEdit, onDelete, actionsDisabled }) => {
    return (
        <FlatList
            data={steaks}
            keyExtractor={(item) => item.personName}
            renderItem={({ item }) => <SteakItem steak={item} onEdit={onEdit} onDelete={onDelete} actionsDisabled={actionsDisabled} />}
        />
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginRight: 10,
        marginLeft: 10,
        flexWrap: 'wrap',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 5,
    },
    steakCookDetails: {
        fontSize: 16,
        marginVertical: 5,
    },
    details: {
        marginTop: 5,
        marginBottom: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: '#555',
    },
});

export default SteakList;
