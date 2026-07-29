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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
      setThickness(editingSteak.thickness.toString());
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

  const handleSave = async () => {
    if (personName.length === 0 || centerCook.length === 0 || thickness === '') {
      Alert.alert('Name, center cook, and thickness must have a value before saving.');
      return;
    }

    const thicknessNumber = Number(thickness);
    const maxId = savedSteaks.reduce((max, steak) => (steak.id > max ? steak.id : max), 0);
    const steak = new Steak(maxId + 1, personName, centerCook, thicknessNumber);

    if (selectedSavedSteak) {
      if (personName !== selectedSavedSteak.personName || centerCook !== selectedSavedSteak.centerCook) {
        await new Promise<void>(() => {
          Alert.alert(
            'Details Changed',
            'You selected a saved steak and changed the details, do you want to update the saved steak?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  handleSavedDetailsChanged();
                  steak.savedSteak = selectedSavedSteak;
                  saveAndClose(steak);
                },
              },
              {
                text: 'No',
                onPress: () => {
                  steak.savedSteak = null;
                  saveAndClose(steak);
                },
              },
            ],
            { cancelable: false },
          );
        });
      } else {
        steak.savedSteak = selectedSavedSteak;
      }
    }
    saveAndClose(steak);
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

  const saveAndClose = (steak: Steak) => {
    onSave(steak);
    onClose();
    clearInputs();
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
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.headerAccent} />
            <View style={styles.modalHeader}>
              <View style={styles.headerTextWrap}>
                <Text style={styles.modalTitle}>
                  {editingSteak ? 'Edit Steak' : 'Add Steak'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingSteak ? 'Adjust the details for this steak.' : 'Create a steak entry and save it for later.'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {savedSteaks.length > 0 ? (
                <View style={styles.fieldGroup}>
                  <Dropdown
                    style={[globalStyles.dropdown, styles.fieldControl]}
                    selectedTextStyle={[globalStyles.selectedTextStyle, styles.selectedTextStyle]}
                    placeholderStyle={styles.placeholderStyle}
                    data={savedSteaks}
                    labelField="personName"
                    valueField="id"
                    placeholder="Select a saved steak"
                    value={selectedSavedSteak}
                    onChange={handleDropdownChange}
                  />
                </View>
              ) : null}

              {selectedSavedSteak ? (
                <TouchableOpacity style={styles.clearButtonContainer} onPress={() => setSelectedSavedSteak(null)}>
                  <Text style={styles.clearButton}>Clear Saved</Text>
                </TouchableOpacity>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Person Name</Text>
                <TextInput
                  ref={personNameInputRef}
                  style={[globalStyles.input, styles.fieldInput]}
                  placeholder="Person Name"
                  placeholderTextColor={'#a78d7a'}
                  value={personName}
                  onChangeText={setPersonName}
                  enterKeyHint={'done'}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Center Cook</Text>
                <Dropdown
                  style={[globalStyles.dropdown, styles.fieldControl]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={[globalStyles.selectedTextStyle, styles.selectedTextStyle]}
                  data={centerCookOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Center Cook"
                  value={centerCook}
                  onFocus={handleDismissKeyboard}
                  onChange={(item) => setCenterCook(item.value)}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Thickness</Text>
                <Dropdown
                  style={[globalStyles.dropdown, styles.fieldControl]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={[globalStyles.selectedTextStyle, styles.selectedTextStyle]}
                  data={thicknessOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Thickness"
                  value={thickness}
                  onFocus={handleDismissKeyboard}
                  onChange={(item) => setThickness(item.value)}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 30, 20, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  keyboardContainer: {
    width: '100%',
    maxWidth: 480,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fdf8f4',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ecdccc',
    shadowColor: '#5a3d2a',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  headerAccent: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#c97a45',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a1a0e',
    fontFamily: 'Avenir-Book',
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#8b6a56',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f6ebdf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#8b6a56',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6d4f3b',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#fffdf9',
    borderColor: '#e2d2c0',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  fieldControl: {
    backgroundColor: '#fffdf9',
    borderColor: '#e2d2c0',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#a78d7a',
  },
  selectedTextStyle: {
    color: '#2f241d',
  },
  clearButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d2a58f',
    backgroundColor: '#fcefe7',
    color: '#8a4f2e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#c97a45',
  },
  secondaryButton: {
    backgroundColor: '#8d6b56',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SteakModal;
