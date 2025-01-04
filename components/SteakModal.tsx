import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Steak } from '../data/SteakData';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (steak: Steak) => void;
  editingSteak?: Steak | null;
}

const SteakModal: React.FC<Props> = ({ visible, onClose, onSave, editingSteak }) => {
  const [personName, setPersonName] = useState('');
  const [centerCook, setCenterCook] = useState('');
  const [thickness, setThickness] = useState(0);


  const centerCookOptions = [
    { label: 'Rare', value: 'Rare' },
    { label: 'Medium Rare', value: 'Medium Rare' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Medium Well', value: 'Medium Well' },
    { label: 'Well Done', value: 'Well Done' },
  ];

  const thicknessOptions = [
    { label: '0.5', value: 0.5 },
    { label: '0.75', value: 0.75 },
    { label: '1.0', value: 1.0 },
    { label: '1.25', value: 1.25 },
    { label: '1.5', value: 1.5 },
    { label: '1.75', value: 1.75 },
    { label: '2.0', value: 2.0 },
  ];

  useEffect(() => {
    if (editingSteak) {
      setPersonName(editingSteak.personName);
      setCenterCook(editingSteak.centerCook);
      setThickness(editingSteak.thickness);
    } else {
      setPersonName('');
      setCenterCook('');
      setThickness(0);
    }
  }, [editingSteak]);

  const handleSave = () => {
    if (personName.length === 0 || centerCook.length === 0 || thickness === 0) {
      Alert.alert('Name, center cook, and thickness must have a value before saving.')
      return;
    }

    var thicknessNumber = Number(thickness);
    const steak: Steak = {
      personName,
      centerCook,
      thickness: thicknessNumber,
      firstSideTime: 0,
      secondSideTime: 0,
      totalCookingTime: function (): number {
        throw new Error('Function not implemented.');
      },
      description: function (): string {
        throw new Error('Function not implemented.');
      },
    };

    onSave(steak);
    onClose();
    setPersonName('');
    setThickness(0);
    setCenterCook('');
  };

  const personNameInputRef = useRef<TextInput>(null);

  const handleDismissKeyboard = () => {
    // Call .blur() on all TextInputs to dismiss the keyboard
    personNameInputRef.current?.blur();

    // Alternatively, you can use this to dismiss the keyboard globally:
    Keyboard.dismiss();
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
            ref={personNameInputRef}
            style={styles.input}
            placeholder="Person's Name"
            value={personName}
            onChangeText={setPersonName}
            enterKeyHint={'done'}
          />

          <Text style={styles.label}>Center Cook:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={centerCookOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Center Cook"
            value={centerCook}
            onFocus={handleDismissKeyboard}
            onChange={(item) => setCenterCook(item.value)}
          />

          <Text style={styles.label}>Thickness:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={thicknessOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Thickness"
            value={thickness}
            onFocus={handleDismissKeyboard}
            onChange={(item) => setThickness(item.value)}
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
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
