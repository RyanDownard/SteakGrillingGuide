import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Steak } from '../data/SteakData';

interface Props {
    steak: Steak;
}

interface ListProps{
    steaks: Steak[];
}

const SteakItem: React.FC<Props> = ({ steak }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View style={styles.card}>
                <Text style={styles.name}>{steak.personName}</Text>
                <Text>{`${steak.centerCook} - ${steak.thickness}"`}</Text>
                {expanded && (
                    <View style={styles.details}>
                        <Text>Starts At: {steak.totalCookingTime()}</Text>
                        <Text>
                            First/Second: {steak.firstSideTime} / {steak.secondSideTime}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const SteakList: React.FC<ListProps> = ({ steaks }) => {
    return (
        <FlatList
            data={steaks}
            keyExtractor={(item) => item.personName}
            renderItem={({ item }) => <SteakItem steak={item} />}
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
});

export default SteakList;
