import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActionSheetIOS } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../data/Helpers';

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

    return (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={styles.card}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{steak.personName}</Text>
                    <Text style={styles.steakDetails}>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                </View>

                {expanded ? (
                    <View style={styles.details}>
                        <View style={styles.buttonsContainer}>
                            {/* <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => onEdit(steak)}>
                                <FontAwesomeIcon icon={faSave} size={24} color={'#029af2'} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={[styles.button, styles.editButton, actionsDisabled && styles.disabledButton]} onPress={() => onEdit(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faPencil} size={24} color={actionsDisabled ? '#949799' : '#e3cf17'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.deleteButton, actionsDisabled && styles.disabledButton]} onPress={() => onDelete(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faTrash} size={24} color={actionsDisabled ? '#949799' : '#c70404'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeader}>Starts At</Text>
                                <Text style={styles.tableHeader}>Flips At</Text>
                            </View>

                            {/* Table Row */}
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>{formatTime(steak.totalCookingTime())}</Text>
                                <Text style={styles.tableCell}>{formatTime(steak.secondSideTime)}</Text>
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

const styles = StyleSheet.create({
    card: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        shadowRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 5 },
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    steakDetails: {
        fontSize: 16,
    },
    details: {
        marginTop: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    tableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        textAlign: 'center',
        padding: 15,
    },
    tableText: {
        flex: 1,
        borderColor: '#000',
        borderWidth: 1,
        textAlign: 'center',
        width: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        borderColor: 'black',
        alignContent: 'center',
        borderWidth: 2,
        width: 20,
        margin: 5,
        borderRadius: 5,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        alignItems: 'center',
    },
    editButton: {
        borderColor: '#e3cf17',
    },
    deleteButton: {
        borderColor: '#c70404',
    },
    saveButton: {
        borderColor: '#029af2',
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
    disabledButton: {
        opacity: 0.5,
        borderColor: '#949799',
    },
});

export default SteakList;
