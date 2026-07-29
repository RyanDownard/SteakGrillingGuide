import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { SavedSteak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import EditSavedSteakModal from '../components/EditSavedSteakModal';
import useSteakStore from '../stores/SteakStore';
import useTimerStore from '../stores/TimerStore';
import useToastStore from '../stores/ToastStore';
import Timer from '../components/Timer';
import SavedSteaksActions from '../components/SavedSteaksActions';
import { Menu, IconButton } from 'react-native-paper';

const SavedSteaks = () => {
    const { removeAnySavedSteakInfo } = useSteakStore();
    const { timerRunning } = useTimerStore();
    const { savedSteaks, removeSavedSteak } = useSavedSteaksStore();
    const { showToast } = useToastStore();
    const [editingSteak, setEditingSteak] = useState<SavedSteak | null>(null);
    const [editSavedSteakModalVisible, setEditSavedSteakmodalVisible] = useState(false);
    const [activeMenuSteakId, setActiveMenuSteakId] = useState<number | null>(null);

    const menuIcon = ({ color, size }: { color: string; size: number }) => (
        <FontAwesomeIcon icon={faEllipsisVertical} size={size} color={color} />
    );

    const handleEditSteak = (steak: SavedSteak) => {
        setEditingSteak(steak);
        setEditSavedSteakmodalVisible(true);
        setActiveMenuSteakId(null);
    };

    const handleDeleteSteak = (steak: SavedSteak) => {
        Alert.alert(
            'Delete Saved Steak?',
            `Are you sure you want to delete saved steak for ${steak.personName}?`,
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        removeSavedSteak(steak.id);
                        removeAnySavedSteakInfo(steak.id);
                        setActiveMenuSteakId(null);
                        showToast('Saved steak deleted.');
                    },
                },
                {
                    text: 'No',
                },
            ],
            { cancelable: false },
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>No saved steaks yet.</Text>
            <Text style={styles.emptyStateSubtitle}>Save your favorite steak preferences while you grill.</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Timer />
            {timerRunning && (
                <View style={globalStyles.dangerContainer}>
                    <Text style={globalStyles.textDangerWhite}>Timer is running, you cannot edit saved steaks.</Text>
                </View>
            )}

            <FlatList
                data={savedSteaks}
                keyExtractor={(item: SavedSteak) => item.id.toString()}
                contentContainerStyle={[styles.listContentContainer, savedSteaks.length === 0 && styles.emptyListContent]}
                ListEmptyComponent={renderEmptyState}
                renderItem={({ item }) => {
                    const isMenuOpen = activeMenuSteakId === item.id;

                    return (
                        <View style={[globalStyles.card, styles.cardContainer]}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.savedSteakName}>{item.personName}</Text>
                                <Text style={styles.savedSteakCook}>{item.centerCook}</Text>
                            </View>
                            <Menu
                                visible={isMenuOpen}
                                onDismiss={() => setActiveMenuSteakId(null)}
                                anchor={
                                    <IconButton
                                        icon={menuIcon}
                                        onPress={() => setActiveMenuSteakId(isMenuOpen ? null : item.id)}
                                        disabled={timerRunning}
                                        style={styles.menuAnchor}
                                    />
                                }
                            >
                                <Menu.Item
                                    onPress={() => handleEditSteak(item)}
                                    title="Edit"
                                    disabled={timerRunning}
                                />
                                <Menu.Item
                                    onPress={() => handleDeleteSteak(item)}
                                    title="Delete"
                                    disabled={timerRunning}
                                />
                            </Menu>
                        </View>
                    );
                }}
            />

            <EditSavedSteakModal
                onClose={() => {
                    setEditSavedSteakmodalVisible(false);
                    setEditingSteak(null);
                }}
                visible={editSavedSteakModalVisible}
                editingSteak={editingSteak}
            />

            <SavedSteaksActions onAddSavedSteak={() => setEditSavedSteakmodalVisible(true)} disabled={timerRunning} />
        </SafeAreaView>
    );
};

export default SavedSteaks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf8f4',
    },
    listContentContainer: {
        paddingTop: 12,
        paddingBottom: 24,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f0e8df',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    infoContainer: {
        flex: 1,
        paddingRight: 10,
    },
    savedSteakName: {
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'CormorantGaramond-Bold',
        color: '#2a1a0e',
        marginBottom: 4,
    },
    savedSteakCook: {
        fontSize: 14,
        fontFamily: 'DMSans-Regular',
        color: '#a08070',
    },
    menuAnchor: {
        marginRight: -8,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2a1a0e',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#7a6d62',
        textAlign: 'center',
        lineHeight: 22,
    },
});
