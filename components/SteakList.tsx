import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { formatTime } from '../data/Helpers';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useTimerStore from '../stores/TimerStore';
import * as Progress from 'react-native-progress';
import SteakProgress from './SteakProgress';
import { Menu, IconButton } from 'react-native-paper';

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
    const [progress, setProgress] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const { addSavedSteak } = useSavedSteaksStore();
    const { timerRunning, remainingTime, duration } = useTimerStore();

    const menuIcon = ({ color, size }: { color: string; size: number }) => (
        <FontAwesomeIcon icon={faEllipsisVertical} size={size} color={color} />
    );

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleSaveSteakToDevice = (steakToSave: Steak) => {
        addSavedSteak(steakToSave);
        closeMenu();
    };

    const handleEditSteak = (steakToEdit: Steak) => {
        onEdit(steakToEdit);
        closeMenu();
    };

    const handleDeleteSteak = (steakToDelete: Steak) => {
        onDelete(steakToDelete);
        closeMenu();
    };

    useEffect(() => {
        if (timerRunning) {
            if (remainingTime > steak.firstSideTime + steak.secondSideTime) {
                const totalWaitTime = duration - (steak.firstSideTime + steak.secondSideTime);
                setProgress((remainingTime - steak.firstSideTime - steak.secondSideTime) / totalWaitTime);
            }
            else if (remainingTime > steak.secondSideTime) {
                const interRemaining = remainingTime - steak.secondSideTime;
                setProgress(interRemaining / steak.firstSideTime);
            }
            else {
                setProgress(remainingTime / steak.secondSideTime);
            }
        } else {
            setProgress(0);
        }
    }, [remainingTime, timerRunning, duration, steak.firstSideTime, steak.secondSideTime]);

    return (
        <View style={styles.steakContainer}>
            <View style={styles.infoContainer}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{steak.personName}</Text>
                    <Text style={styles.steakCookDetails}>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                </View>
                <View style={styles.menuContainer}>
                    {steak.savedSteak && <FontAwesomeIcon style={ styles.savedIcon } icon={faCheckCircle} size={24} color={'green'} />}
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchorPosition="top"
                        anchor={
                            <IconButton
                                icon={menuIcon}
                                onPress={() => openMenu()}
                            />}
                    >
                        <Menu.Item onPress={() => handleEditSteak(steak)} disabled={actionsDisabled} title="Edit" />
                        {(steak.savedSteak == null || steak.savedSteak === undefined) && <Menu.Item onPress={() => handleSaveSteakToDevice(steak)} title="Save" />}
                        <Menu.Item onPress={() => handleDeleteSteak(steak)} disabled={actionsDisabled} title="Delete" />
                    </Menu>
                </View>
            </View>
            <SteakProgress steak={steak} />
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
    steakContainer: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
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
    detailsContainer: {
        flex: 1,
    },
    details: {
        marginTop: 5,
        marginBottom: 5,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    savedIcon: {
        marginTop: 12,
        marginRight: 10,
    },
});

export default SteakList;
