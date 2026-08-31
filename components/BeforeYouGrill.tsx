import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { theme } from '../styles/theme';

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
      } else {
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
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerAccent} />
          <View style={styles.modalHeader}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.modalTitle}>Before You Grill</Text>
              <Text style={styles.modalSubtitle}>A few reminders for a smooth cook.</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.noticeBox}>
              <Text style={styles.modalItem}>
                • Make sure you clean your grill regularly to prevent flare-ups and ensure even cooking.
              </Text>
              <Text style={styles.modalItem}>
                • Sit steaks out at room temperature for 30 minutes prior to cooking.
              </Text>
              <Text style={styles.modalItem}>
                • Season steaks on both sides with your favorite seasoning.
              </Text>
              <Text style={styles.modalItem}>
                • Preheat the grill to approximately 500 degrees.
              </Text>
              <Text style={styles.modalItem}>
                • Let steaks rest for 5 minutes after grilling before serving.
              </Text>
              <Text style={styles.modalItem}>
                • Verify steaks are properly cooked before eating.
              </Text>
              <Text style={styles.modalItem}>• Enjoy!</Text>
            </View>

            <View style={styles.checkBoxContainer}>
              <BouncyCheckbox
                size={25}
                isChecked={hideOnStart}
                fillColor="#c97a45"
                disableText={true}
                unFillColor="#FFFFFF"
                iconStyle={styles.iconStyling}
                innerIconStyle={styles.innerIconStyling}
                onPress={(isChecked: boolean) => { handleHideOnStartChecked(isChecked); }}
              />
              <Text style={styles.dontShowStyling}>Do not show on start</Text>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeActionButton}>
            <Text style={styles.closeActionText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  headerAccent: {
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.accent,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Avenir-Book',
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  noticeBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#efe2d4',
    padding: 14,
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 14,
    color: '#6d4f3b',
    marginBottom: 8,
    lineHeight: 20,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconStyling: {
    borderColor: theme.colors.accent,
  },
  innerIconStyling: {
    borderWidth: 2,
  },
  dontShowStyling: {
    fontWeight: '700',
    color: '#6d4f3b',
    marginLeft: 10,
  },
  closeActionButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
  },
  closeActionText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default BeforeYouGrill;
