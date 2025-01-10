import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Steak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (steak: Steak) => void;
  editingSteak?: Steak | null;
}

const SteakModal: React.FC<Props> = ({ visible, onClose, onSave, editingSteak }) => {
  const [personName, setPersonName] = useState('');
  const [centerCook, setCenterCook] = useState('');
  const [thickness, setThickness] = useState('');


  const centerCookOptions = [
    { label: 'Rare', value: 'Rare' },
    { label: 'Medium Rare', value: 'Medium Rare' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Medium Well', value: 'Medium Well' },
    { label: 'Well Done', value: 'Well Done' },
  ];

  const thicknessOptions = [
    { label: '0.5', value: '0.5' },
    { label: '0.75', value: '0.75' },
    { label: '1.0', value: '1.0' },
    { label: '1.25', value: '1.25' },
    { label: '1.5', value: '1.5' },
    { label: '1.75', value: '1.75' },
    { label: '2.0', value: '2.0' },
  ];

  useEffect(() => {
    if (editingSteak) {
      setPersonName(editingSteak.personName);
      setCenterCook(editingSteak.centerCook);
      setThickness(editingSteak.thickness.toString());
    } else {
      setPersonName('');
      setCenterCook('');
      setThickness('');
    }
  }, [editingSteak]);

  const handleSave = () => {
    if (personName.length === 0 || centerCook.length === 0 || thickness === '') {
      Alert.alert('Name, center cook, and thickness must have a value before saving.');
      return;
    }

    var thicknessNumber = Number(thickness);
    const steak = new Steak(personName, centerCook, thicknessNumber);

    onSave(steak);
    onClose();
    setPersonName('');
    setThickness('');
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
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>
              {editingSteak ? 'Edit Steak' : 'Add Steak'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={globalStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={globalStyles.label}>Person Name:</Text>
          <TextInput
            ref={personNameInputRef}
            style={globalStyles.input}
            placeholder="Person Name"
            value={personName}
            onChangeText={setPersonName}
            enterKeyHint={'done'}
          />

          <Text style={globalStyles.label}>Center Cook:</Text>
          <Dropdown
            style={globalStyles.dropdown}
            placeholderStyle={globalStyles.placeholderStyle}
            selectedTextStyle={globalStyles.selectedTextStyle}
            data={centerCookOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Center Cook"
            value={centerCook}
            onFocus={handleDismissKeyboard}
            onChange={(item) => setCenterCook(item.value)}
          />

          <Text style={globalStyles.label}>Thickness:</Text>
          <Dropdown
            style={globalStyles.dropdown}
            placeholderStyle={globalStyles.placeholderStyle}
            selectedTextStyle={globalStyles.selectedTextStyle}
            data={thicknessOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Thickness"
            value={thickness}
            onFocus={handleDismissKeyboard}
            onChange={(item) => setThickness(item.value)}
          />


          <View style={globalStyles.buttonContainer}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={globalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.saveButton]}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SteakModal;
