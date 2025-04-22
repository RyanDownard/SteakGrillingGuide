import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import globalStyles from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface GrillInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const BeforeYouGrill: React.FC<GrillInfoModalProps> = ({ visible, onClose }) => {
  const [hideOnStart, setHideOnStart] = useState(false);

  const checkShowBeforeYouGrillModal = async () => {
    try {
      const value = await AsyncStorage.getItem('hideInfoModalOnStart');
      if (value === undefined) {
        setHideOnStart(true);
      }
      else {
        setHideOnStart(value === 'true');
      }
    } catch (error) {
      console.error('Error reading stored value:', error);
    }
  };

  const handleHideOnStartChecked = async (isChecked: boolean) => {
    setHideOnStart(isChecked);

    await AsyncStorage.setItem('hideInfoModalOnStart', isChecked.toString());
  };

  useEffect(() => {
    checkShowBeforeYouGrillModal();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>Before You Grill</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={globalStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={globalStyles.modalSubtitle}>
            Before you get started on your steaks, we have some suggestions for preparing and cooking your steak:
          </Text>
          <View style={globalStyles.modalBody}>
            <Text style={styles.modalItem}>
              - Make sure your grill is cleaned; higher temperatures can cause the grease to catch fire.
            </Text>
            <Text style={styles.modalItem}>
              - Sit steaks out at room temperature for 30 minutes prior to cooking.
            </Text>
            <Text style={styles.modalItem}>
              - Season steaks on both sides with favorite seasoning.
            </Text>
            <Text style={styles.modalItem}>
              - Preheat grill to approximately 500 degrees.
            </Text>
            <Text style={styles.modalItem}>
              - Let steaks rest for 5 minutes after grilling prior to eating.
            </Text>
            <Text style={styles.modalItem}>
              - Verify steaks are properly cooked before eating.
            </Text>
            <Text style={styles.modalItem}>- Enjoy!</Text>
            <View style={styles.checkBoxContainer}>
              <BouncyCheckbox
                size={25}
                isChecked={hideOnStart}
                fillColor="grey"
                disableText={true}
                unFillColor="#FFFFFF"
                iconStyle={styles.iconStyling}
                innerIconStyle={styles.innerIconStyling}
                onPress={(isChecked: boolean) => { handleHideOnStartChecked(isChecked); }}
              />
              <Text style={styles.dontShowStyling}>Do not show on start</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={globalStyles.modalFooter}>
            <Text style={globalStyles.modalFooterText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  iconStyling: {
    borderColor: 'grey',
  },
  innerIconStyling: {
    borderWidth: 2,
  },
  dontShowStyling: {
    fontWeight: 'bold',
    paddingTop: 5,
    marginLeft: 10,
  },
});

export default BeforeYouGrill;
