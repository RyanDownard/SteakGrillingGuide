import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '../styles/globalStyles';

interface GrillInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const BeforeYouGrill: React.FC<GrillInfoModalProps> = ({ visible, onClose }) => {
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
            <Text style={globalStyles.modalItem}>
              - Make sure your grill is cleaned; higher temperatures can cause the grease to catch fire.
            </Text>
            <Text style={globalStyles.modalItem}>
              - Sit steaks out at room temperature for 30 minutes prior to cooking.
            </Text>
            <Text style={globalStyles.modalItem}>
              - Season steaks on both sides with favorite seasoning.
            </Text>
            <Text style={globalStyles.modalItem}>
              - Preheat grill to approximately 500 degrees.
            </Text>
            <Text style={globalStyles.modalItem}>
              - Let steaks rest for 5 minutes after grilling prior to eating.
            </Text>
            <Text style={globalStyles.modalItem}>
              - Verify steaks are properly cooked before eating.
            </Text>
            <Text style={globalStyles.modalItem}>- Enjoy!</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={globalStyles.modalFooter}>
            <Text style={globalStyles.modalFooterText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BeforeYouGrill;
