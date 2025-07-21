import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
    return (
        <View style={styles.table}>
            <View style={styles.tableRow}>
                {headers.map((header: string, index: number) => (
                    <Text key={index} style={styles.tableHeader}>{header}</Text>
                ))}
            </View>
            {rows.map((row: (string | React.ReactNode)[], rowIndex: number) => (
                <View key={rowIndex} style={styles.tableRow}>
                    {row.map((cell: string | React.ReactNode, cellIndex: number) => (
                        <View key={cellIndex} style={styles.tableCell}>
                            {typeof cell === 'string' ? (
                                <Text style={styles.cellText}>{cell}</Text>
                            ) : (
                                cell
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default Table;

const styles = StyleSheet.create({
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        textAlign: 'center',
        color: '#555',
    },
});
