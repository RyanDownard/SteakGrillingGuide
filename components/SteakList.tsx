import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faStar } from '@fortawesome/free-solid-svg-icons';
import { CookData } from '../data/SteakData';
import { formatTime } from '../data/Helpers';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useTimerStore from '../stores/TimerStore';
import SteakProgress from './SteakProgress';
import { Menu, IconButton } from 'react-native-paper';
import useSteakStore from '../stores/SteakStore';

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
    bottomPadding?: number;
}

const SteakItem: React.FC<Props> = ({ steak, onEdit, onDelete, actionsDisabled }) => {
    const [, setProgress] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false);
    const { addSavedSteak } = useSavedSteaksStore();
    const { timerRunning, remainingTime, duration } = useTimerStore();
    const { settings } = useSteakStore();

    const backgroundColor = settings.find((data: CookData) => data.CenterCook === steak.centerCook)?.BackgroundColor;
    const textColor = settings.find((data: CookData) => data.CenterCook === steak.centerCook)?.TextColor;

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
                    <View style={styles.steakCookDetails}>
                        <View style={[styles.cookDetails, { backgroundColor: backgroundColor }]}>
                            <Text style={[styles.cookText, { color: textColor }]}>
                                {steak.centerCook}
                            </Text>

                        </View>
                        <Text style={[styles.cookText, styles.detailsItemPadding]}>
                            •
                        </Text>
                        <Text style={[styles.cookText, styles.detailsItemPadding]}>
                            {`${steak.thickness}"`}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.menuContainer}>
                        {steak.savedSteak && <FontAwesomeIcon style={styles.savedIcon} icon={faStar} size={24} color={'#f9de2e'} />}
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
            </View>
            <SteakProgress steak={steak} />
            <View style={styles.timesContainer}>
                <View style={styles.timesBackgroundContainer}>
                    <View style={styles.startTimeInfo}>
                        <Text style={styles.timeDescriptionText}>
                            Place At:
                        </Text>
                        <Text style={styles.timeText}>
                            {formatTime(steak.firstSideTime + steak.secondSideTime)}
                        </Text>
                    </View>
                    <View style={styles.flipTimeInfo}>
                        <Text style={styles.timeDescriptionText}>
                            Flip At:
                        </Text>
                        <Text style={styles.timeText}>
                            {formatTime(steak.secondSideTime)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const SteakList: React.FC<ListProps> = ({ steaks, onEdit, onDelete, actionsDisabled, bottomPadding = 120 }) => {
    return (
        <FlatList
            data={steaks}
            style={styles.list}
            contentContainerStyle={[styles.listContentContainer, { paddingBottom: bottomPadding }]}
            keyExtractor={(item) => item.personName}
            renderItem={({ item }) => <SteakItem steak={item} onEdit={onEdit} onDelete={onDelete} actionsDisabled={actionsDisabled} />}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContentContainer: {
        paddingBottom: 160,
    },
    steakContainer: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f0e8df',
        backgroundColor: '#ffffff',
        shadowColor: 'black',
        marginHorizontal: 15,
        marginVertical: 7,
        padding: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    name: {
        fontWeight: 700,
        fontSize: 26,
        marginVertical: 8,
        fontFamily: 'CormorantGaramond-Bold',
        color: '#2a1a0e',
    },
    steakCookDetails: {
        flexDirection: 'row',
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
    cookDetails: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        fontFamily: 'DMSans',
        fontSize: 10,
        fontWeight: '500',
        overflow: 'hidden',
        alignSelf: 'flex-start',
    },
    cookText: {
        fontSize: 14,
        fontWeight: '500',
    },
    timesContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
    },
    timesBackgroundContainer: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e8d8cc',
        backgroundColor: '#fdf8f4',
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    startTimeInfo: {
        flex: 1,
        alignItems: 'center',
        borderColor: '#e8d8cc',
        borderRightWidth: 0.5,
        height: 70,
        justifyContent: 'center',
    },
    flipTimeInfo: {
        flex: 1,
        alignItems: 'center',
        borderColor: '#e8d8cc',
        borderLeftWidth: 0.5,
        height: 70,
        justifyContent: 'center',
    },
    timeDescriptionText: {
        fontSize: 12,
        marginBottom: 3,
        fontFamily: 'DMSans-Regular',
        color: '#a08070',
        letterSpacing: 0.08,
        textTransform: 'uppercase',
    },
    timeText: {
        fontSize: 20,
        fontFamily: 'CourierPrime-Regular',
        fontWeight: 700,
        color: '#2a1a0e',
    },
    detailsItemPadding: {
        paddingHorizontal: 3,
        paddingVertical: 5,
    },
});

export default SteakList;
