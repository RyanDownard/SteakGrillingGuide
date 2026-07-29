import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#f46421', backgroundColor: '#fffdf9' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: '600', color: '#2a1a0e' }}
      text2Style={{ fontSize: 12, color: '#7a6d62' }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#d9534f', backgroundColor: '#fffdf9' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: '600', color: '#2a1a0e' }}
      text2Style={{ fontSize: 12, color: '#7a6d62' }}
    />
  ),
};
