import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
    return (
        <View style={styles.table}>
            <View style={styles.tableRowHeader}>
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
        borderColor: '#f0e8df',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fffdfb',
    },
    tableRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#fbf4ec',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3e8de',
        backgroundColor: '#fffdfb',
    },
    tableHeader: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'DMSans-Regular',
        color: '#7a6d62',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    tableCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        textAlign: 'center',
        color: '#2a1a0e',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
    },
});
