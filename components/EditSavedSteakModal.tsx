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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Steak, SavedSteak } from '../data/SteakData';
import globalStyles from '../styles/globalStyles';
import useSavedSteaksStore from '../stores/SavedSteakStore';
import useSteakStore from '../stores/SteakStore';
import useToastStore from '../stores/ToastStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  editingSteak: SavedSteak | null;
}

const EditSavedSteakModal: React.FC<Props> = ({ visible, onClose, editingSteak }) => {
  const [personName, setPersonName] = useState('');
  const [centerCook, setCenterCook] = useState('');
  const { addSavedSteak, updateSavedSteak } = useSavedSteaksStore();
  const { updateSteaksWithSavedId } = useSteakStore();
  const { showToast } = useToastStore();

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
    } else {
      setPersonName('');
      setCenterCook('');
    }
  }, [editingSteak]);

  const handleSave = async () => {
    if (personName.length === 0 || centerCook.length === 0) {
      showToast('Please enter both the name and cook level before saving.');
      return;
    }

    if (editingSteak) {
      editingSteak.personName = personName;
      editingSteak.centerCook = centerCook;

      await updateSavedSteak(editingSteak);
      updateSteaksWithSavedId(editingSteak);
    } else {
      const newSteak = new Steak(0, personName, centerCook, 1);
      await addSavedSteak(newSteak);
    }

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
                  {editingSteak ? 'Edit Saved Steak' : 'Add Saved Steak'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingSteak ? 'Update the details for this saved profile.' : 'Save a reusable steak profile for later.'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleClose}>
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
    marginBottom: 10,
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

export default EditSavedSteakModal;
