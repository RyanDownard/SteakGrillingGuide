import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Steak, SavedSteak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';

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
  const [selectedSavedSteak, setSelectedSavedSteak] = useState<SavedSteak | null>(null);
  const { savedSteaks, updateSavedSteak } = useSavedSteaksStore();


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
      setThickness(editingSteak.thickness.toFixed(1).toString());
      if (editingSteak.savedSteak) {
        setSelectedSavedSteak(editingSteak.savedSteak);
      }
    } else {
      setPersonName('');
      setCenterCook('');
      setThickness('');
      setSelectedSavedSteak(null);
    }
  }, [editingSteak]);

  const handleSavedDetailsChanged = () => {
    selectedSavedSteak!.personName = personName;
    selectedSavedSteak!.centerCook = centerCook;

    updateSavedSteak(selectedSavedSteak!);
  };

  const handleSave = () => {
    if (personName.length === 0 || centerCook.length === 0 || thickness === '') {
      Alert.alert('Name, center cook, and thickness must have a value before saving.');
      return;
    }

    var thicknessNumber = Number(thickness);
    const maxId = savedSteaks.reduce((max, steak) => (steak.id > max ? steak.id : max), 0);
    const steak = new Steak(maxId + 1, personName, centerCook, thicknessNumber);

    if (selectedSavedSteak) {
      if (personName !== selectedSavedSteak.personName
        || centerCook !== selectedSavedSteak.centerCook) {
        Alert.alert(
          'Details Changed',
          'You selected a saved steak and changed the details, do you want to update the saved steak?',
          [
            {
              text: 'Yes',
              onPress: () => handleSavedDetailsChanged(),
            },
            {
              text: 'No',
              onPress: () => { steak.savedSteak = null; },
            },
          ],
          { cancelable: false },
        );
      }

      steak.savedSteak = selectedSavedSteak;
    }

    onSave(steak);
    onClose();
    clearInputs();
  };

  const clearInputs = () => {
    setPersonName('');
    setThickness('');
    setCenterCook('');
    setSelectedSavedSteak(null);
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

  const handleDropdownChange = (item: SavedSteak) => {
    if (item) {
      setSelectedSavedSteak(item);
      setCenterCook(item.centerCook);
      setPersonName(item.personName);
    }
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
          {savedSteaks.length > 0 ? (
            <Dropdown
              style={globalStyles.dropdown}
              selectedTextStyle={globalStyles.selectedTextStyle}
              data={savedSteaks}
              labelField="personName"
              valueField="id"
              placeholder="Select a saved steak"
              value={selectedSavedSteak}
              onChange={handleDropdownChange}
            />
          ) : null}

          {selectedSavedSteak ? (
            <TouchableOpacity style={styles.clearButtonContainer} onPress={() => setSelectedSavedSteak(null)}>
              <Text style={styles.clearButton}>
                Clear Saved
              </Text>
            </TouchableOpacity>
          ) : null}

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
              onPress={handleClose}
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

const styles = StyleSheet.create({
  clearButtonContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
},
clearButton: {
    flex: 0.35,
    marginBottom: 20,
    fontSize: 15,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d9534f',
    backgroundColor: '#d9534f',
    color: 'white',
},
});

export default SteakModal;
