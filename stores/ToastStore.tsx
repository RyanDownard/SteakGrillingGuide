import { create } from 'zustand';
import Toast from 'react-native-toast-message';

interface ToastState {
  showToast: (message: string) => void;
}

const useToastStore = create<ToastState>(() => ({
  showToast: (message: string) => {
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: 2500,
      autoHide: true,
      bottomOffset: 90,
    });
  },
}));

export default useToastStore;
