import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Before You Grill</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <Text style={styles.modalSubtitle}>
            Before you get started on your steaks, we have some suggestions for preparing and cooking your steak:
          </Text>
          <View style={styles.modalBody}>
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
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 20,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  modalFooter: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalFooterText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BeforeYouGrill;
