import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SteakModal = ({ visible, onClose, onSave, editingSteak }) => {
  const [personName, setPersonName] = useState('');
  const [desiredDoneness, setDesiredDoneness] = useState('');
  const [firstSideTime, setFirstSideTime] = useState('');
  const [secondSideTime, setSecondSideTime] = useState('');

  useEffect(() => {
    if (editingSteak) {
      setPersonName(editingSteak.personName);
      setDesiredDoneness(editingSteak.desiredDoneness);
      setFirstSideTime(editingSteak.firstSideTime.toString());
      setSecondSideTime(editingSteak.secondSideTime.toString());
    } else {
      setPersonName('');
      setDesiredDoneness('');
      setFirstSideTime('');
      setSecondSideTime('');
    }
  }, [editingSteak]);

  const handleSave = () => {
    const steak = {
      personName,
      desiredDoneness,
      firstSideTime: Number(firstSideTime),
      secondSideTime: Number(secondSideTime),
    };
    onSave(steak);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingSteak ? 'Edit Steak' : 'Add Steak'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Person's Name"
            value={personName}
            onChangeText={setPersonName}
          />
          <TextInput
            style={styles.input}
            placeholder="Desired Doneness (e.g., Medium Rare)"
            value={desiredDoneness}
            onChangeText={setDesiredDoneness}
          />
          <TextInput
            style={styles.input}
            placeholder="First Side Time (seconds)"
            value={firstSideTime}
            onChangeText={setFirstSideTime}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Second Side Time (seconds)"
            value={secondSideTime}
            onChangeText={setSecondSideTime}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
  },
  saveButton: {
    backgroundColor: '#5cb85c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SteakModal;
