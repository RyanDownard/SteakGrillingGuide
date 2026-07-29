import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useToastStore from '../stores/ToastStore';

const Toast = () => {
  const { visible, message, hideToast } = useToastStore();

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      hideToast();
    }, 2200);

    return () => clearTimeout(timer);
  }, [visible, hideToast, message]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toastText: {
    backgroundColor: '#2a1a0e',
    color: '#fffdf9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '600',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

export default Toast;
