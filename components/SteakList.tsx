import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../data/Helpers';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useTimerStore from '../stores/TimerStore';
import * as Progress from 'react-native-progress';

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
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={globalStyles.card}>
                <View style={globalStyles.infoContainer}>
                    <Text style={globalStyles.name}>{steak.personName}</Text>
                    <Text style={globalStyles.steakCookDetails}>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                    {timerRunning && (
                        <Progress.Circle progress={progress} color={steak.isPlaced ? '#017a40' : '#fcca03'} size={23} thickness={2} />
                    )}
                </View>

                {expanded ? (
                    <View style={globalStyles.details}>
                        <View style={globalStyles.buttonsContainer}>
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
                        <View style={globalStyles.table}>
                            <View style={globalStyles.tableRow}>
                                <Text style={globalStyles.tableHeader}>Starts At</Text>
                                <Text style={globalStyles.tableHeader}>Flips At</Text>
                            </View>
                            <View style={globalStyles.tableRow}>
                                <Text style={globalStyles.tableCell}>{formatTime(steak.firstSideTime + steak.secondSideTime)}</Text>
                                <Text style={globalStyles.tableCell}>{formatTime(steak.secondSideTime)}</Text>
                            </View>
                        </View>

                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
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

export default SteakList;
