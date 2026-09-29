import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { CookData } from '../data/SteakData';
import { formatTime } from '../data/Helpers';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useTimerStore from '../stores/TimerStore';
import SteakProgress from './SteakProgress';
import { Menu, IconButton } from 'react-native-paper';
import useSteakStore from '../stores/SteakStore';
import { theme } from '../styles/theme';

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
    const { addSavedSteak, removeSavedSteak } = useSavedSteaksStore();
    const { timerRunning, remainingTime, duration } = useTimerStore();
    const { settings, removeAnySavedSteakInfo } = useSteakStore();

    const backgroundColor = settings.find((data: CookData) => data.CenterCook === steak.centerCook)?.BackgroundColor;
    const textColor = settings.find((data: CookData) => data.CenterCook === steak.centerCook)?.TextColor;

    const menuIcon = ({ color, size }: { color: string; size: number }) => (
        <FontAwesomeIcon icon={faEllipsisVertical} size={size} color={color} />
    );

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleToggleFavorite = async () => {
        if (steak.savedSteak) {
            const savedSteakId = steak.savedSteak.id;
            await removeSavedSteak(savedSteakId);
            steak.savedSteak = null;
            removeAnySavedSteakInfo(savedSteakId);
            return;
        }

        await addSavedSteak(steak);
    };

    const handleEditSteak = (steakToEdit: Steak) => {
        onEdit(steakToEdit);
        closeMenu();
    };

    const handleDeleteSteak = (steakToDelete: Steak) => {
        onDelete(steakToDelete);
        closeMenu();
    };

    const borderAnimation = useRef(new Animated.Value(0)).current;
    const totalTime = steak.firstSideTime + steak.secondSideTime;
    const isPlaceUrgent = timerRunning && remainingTime <= totalTime + 20 && remainingTime > totalTime;
    const isFlipUrgent = timerRunning && remainingTime <= steak.secondSideTime + 20 && remainingTime > steak.secondSideTime;
    const isSide1Active = steak.isPlaced && !steak.isFlipped;
    const isSide2Active = steak.isFlipped;
    const steakStateIndex = isSide2Active  ? 3 : isSide1Active ? 2 : (isPlaceUrgent || isFlipUrgent) ? 1 : 0;

    const animatedBorderColor = borderAnimation.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: ['#f0e8df', '#f46421', '#e8c090', '#ba581b'],
    });

    const animatedBorderWidth = borderAnimation.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [1, 2.5, 1.5, 1.5],
    });

    useEffect(() => {
        Animated.timing(borderAnimation, {
            toValue: steakStateIndex,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [borderAnimation, steakStateIndex]);

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
        <Animated.View style={[styles.steakContainer, { borderColor: animatedBorderColor, borderWidth: animatedBorderWidth }]}>
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
                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={handleToggleFavorite}
                            accessibilityRole="button"
                            accessibilityLabel={steak.savedSteak ? 'Remove favorite' : 'Add favorite'}
                        >
                            <FontAwesomeIcon
                                icon={steak.savedSteak ? faStar : faStarRegular}
                                size={24}
                                color={steak.savedSteak ? '#f9de2e' : '#c1a78d'}
                            />
                        </TouchableOpacity>
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
                            <Menu.Item onPress={() => handleDeleteSteak(steak)} disabled={actionsDisabled} title="Remove" />
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
        </Animated.View>
    );
};

const SteakList: React.FC<ListProps> = ({ steaks, onEdit, onDelete, actionsDisabled, bottomPadding = 120 }) => {
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No steaks added yet.</Text>
            <Text style={styles.emptyStateSubtitle}>Add your first steak to start the grill timer.</Text>
        </View>
    );

    return (
        <FlatList
            data={steaks}
            style={styles.list}
            contentContainerStyle={[styles.listContentContainer, { paddingBottom: bottomPadding }, steaks.length === 0 && styles.emptyListContent]}
            keyExtractor={(item) => item.personName}
            ListEmptyComponent={renderEmptyState}
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
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 24,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#7a6d62',
        textAlign: 'center',
        lineHeight: 22,
    },
    steakContainer: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f0e8df',
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.black,
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
        color: theme.colors.text,
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
    favoriteButton: {
        marginTop: 10,
        marginRight: 8,
        padding: 4,
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
        backgroundColor: theme.colors.background,
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
        color: theme.colors.textSoft,
        letterSpacing: 0.08,
        textTransform: 'uppercase',
    },
    timeText: {
        fontSize: 20,
        fontFamily: 'CourierPrime-Regular',
        fontWeight: 700,
        color: theme.colors.text,
    },
    detailsItemPadding: {
        paddingHorizontal: 3,
        paddingVertical: 5,
    },
});

export default SteakList;
