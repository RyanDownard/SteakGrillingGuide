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
import { SavedSteak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useSteakStore from '../stores/SteakStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  editingSteak: SavedSteak | null;
}

const EditSavedSteakModal: React.FC<Props> = ({ visible, onClose, editingSteak }) => {
  const [personName, setPersonName] = useState('');
  const [centerCook, setCenterCook] = useState('');
  const { updateSavedSteak } = useSavedSteaksStore();
  const { updateSteaksWithSavedId } = useSteakStore();


  const centerCookOptions = [
    { label: 'Rare', value: 'Rare' },
    { label: 'Medium Rare', value: 'Medium Rare' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Medium Well', value: 'Medium Well' },
    { label: 'Well Done', value: 'Well Done' },
  ];

  useEffect(() => {
    if (editingSteak) {
      setPersonName(editingSteak.personName);
      setCenterCook(editingSteak.centerCook);
    }
    else {
      setPersonName('');
      setCenterCook('');
    }

  }, [editingSteak]);

  const handleSave = () => {
    if (personName.length === 0 || centerCook.length === 0) {
      Alert.alert('Name, center cook, and thickness must have a value before saving.');
      return;
    }

    editingSteak!.personName = personName;
    editingSteak!.centerCook = centerCook;

    updateSavedSteak(editingSteak!);
    updateSteaksWithSavedId(editingSteak!);
    onClose();
    clearInputs();
  };


  const clearInputs = () => {
    setPersonName('');
    setCenterCook('');
  };

  const handleClose = () => {
    clearInputs();
    onClose();
  };

  const personNameInputRef = useRef<TextInput>(null);

  const handleDismissKeyboard = () => {
    personNameInputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      presentationStyle={'overFullScreen'}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>
              {editingSteak ? 'Edit Steak' : 'Add Steak'}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={globalStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={globalStyles.label}>Person Name:</Text>
          <TextInput
            ref={personNameInputRef}
            style={globalStyles.input}
            placeholder="Person Name"
            placeholderTextColor={'#aaa'}
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

          <View style={globalStyles.buttonContainer}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.saveButton]}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={globalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditSavedSteakModal;
