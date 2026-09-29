jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
  },
}));

import useToastStore from '../stores/ToastStore';

describe('toast store', () => {
  it('exposes a showToast function', () => {
    const { showToast } = useToastStore.getState();

    expect(typeof showToast).toBe('function');
  });
});
