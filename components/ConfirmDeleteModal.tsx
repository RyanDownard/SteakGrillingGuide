import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import { Steak } from '../data/SteakData';

interface ConfirmDeleteModalProps {
  deleteModalVisible: boolean;
  steakToDelete: Steak | null;
  setDeleteModalVisible: (visible: boolean) => void;
  handleDelete: (steak: Steak) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ deleteModalVisible, steakToDelete, setDeleteModalVisible, handleDelete }) => {
  return (
    <Modal visible={deleteModalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure you want to delete {steakToDelete?.personName}'s steak?</Text>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
            <Button title="Delete" onPress={() => handleDelete(steakToDelete!)} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ConfirmDeleteModal;
