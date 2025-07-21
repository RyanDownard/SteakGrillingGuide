import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface ToggleContentButtonProps {
    expanded: boolean;
    onChange: () => void;
}

const ToggleContentButton: React.FC<ToggleContentButtonProps> = ({ expanded, onChange }) => (
    <TouchableOpacity onPress={onChange} style={styles.toggleContainer}>
        <FontAwesomeIcon icon={expanded ? 'angle-up' : 'angle-down'} size={20} color="#555" />
    </TouchableOpacity>
);

export default ToggleContentButton;

const styles = StyleSheet.create({
    toggleContainer: {
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
});
