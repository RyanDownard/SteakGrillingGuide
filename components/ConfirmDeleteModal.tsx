import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
} from 'react-native';
import { Steak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';

interface ConfirmDeleteModalProps {
  deleteModalVisible: boolean;
  steakToDelete: Steak | null;
  setDeleteModalVisible: () => void;
  handleDelete: (steak: Steak) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ deleteModalVisible, steakToDelete, setDeleteModalVisible, handleDelete }) => {
  return (
    <Modal visible={deleteModalVisible} transparent animationType="fade">
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalContent}>
          <Text style={globalStyles.modalText}>Are you sure you want to delete {steakToDelete?.personName}'s steak?</Text>
          <View style={globalStyles.modalButtons}>
            <Button title="Cancel" onPress={setDeleteModalVisible} />
            <Button title="Delete" onPress={() => handleDelete(steakToDelete!)} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
