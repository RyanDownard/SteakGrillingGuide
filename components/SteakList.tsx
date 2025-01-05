import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Steak } from '../data/SteakData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPencil, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

interface Props {
    steak: Steak;
    onEdit: (steak: Steak) => void;
}

interface ListProps {
    steaks: Steak[];
    onEdit: (steak: Steak) => void;
}

const SteakItem: React.FC<Props> = ({ steak, onEdit }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={styles.card}>
                <Text style={styles.name}>{steak.personName}</Text>
                <Text>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                {expanded && (
                    <View style={styles.details}>
                        <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => onEdit(steak)}>
                                <FontAwesomeIcon icon={faSave} size={24} color={'#029af2'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(steak)}>
                                <FontAwesomeIcon icon={faPencil} size={24} color={'#e3cf17'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => onEdit(steak)}>
                                <FontAwesomeIcon icon={faTrash} size={24} color={'#c70404'} />
                            </TouchableOpacity>
                        </View>
                        <Text>Starts At: {steak.firstSideTime + steak.secondSideTime}</Text>
                        <Text>
                            First/Second: {steak.firstSideTime} / {steak.secondSideTime}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const SteakList: React.FC<ListProps> = ({ steaks, onEdit }) => {
    return (
        <FlatList
            data={steaks}
            keyExtractor={(item) => item.personName}
            renderItem={({ item }) => <SteakItem steak={item} onEdit={onEdit} />}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    name: {
        fontWeight: 'bold',
    },
    details: {
        marginTop: 5,
    },
    buttonsContainer:{
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
});

export default SteakList;
