import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../data/Helpers';
import globalStyles from '../styles/globalStyles';

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
            <View style={globalStyles.card}>
                <View style={globalStyles.infoContainer}>
                    <Text style={globalStyles.name}>{steak.personName}</Text>
                    <Text style={globalStyles.steakCookDetails}>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                </View>

                {expanded ? (
                    <View style={globalStyles.details}>
                        <View style={globalStyles.buttonsContainer}>
                            {/* <TouchableOpacity style={[globalStyles.button, globalStyles.saveButton]} onPress={() => onEdit(steak)}>
                                <FontAwesomeIcon icon={faSave} size={24} color={'#029af2'} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={[globalStyles.actionButton, globalStyles.editButton, actionsDisabled && globalStyles.disabledButton]} onPress={() => onEdit(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faPencil} size={24} color={actionsDisabled ? '#949799' : '#e3cf17'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[globalStyles.actionButton, globalStyles.deleteButton, actionsDisabled && globalStyles.disabledButton]} onPress={() => onDelete(steak)} disabled={actionsDisabled}>
                                <FontAwesomeIcon icon={faTrash} size={24} color={actionsDisabled ? '#949799' : '#c70404'} />
                            </TouchableOpacity>
                        </View>
                        <View style={globalStyles.table}>
                            {/* Table Header */}
                            <View style={globalStyles.tableRow}>
                                <Text style={globalStyles.tableHeader}>Starts At</Text>
                                <Text style={globalStyles.tableHeader}>Flips At</Text>
                            </View>

                            {/* Table Row */}
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
