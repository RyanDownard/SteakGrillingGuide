// timerStore.ts
import { create } from 'zustand';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSteakStore from './SteakStore';

interface TimerStore {
  timerRunning: boolean;
  endTime: Date | null;
  duration: number;
  remainingTime: number;

  // Actions
  setTimerRunning: (running: boolean) => void;
  setEndTime: (time: Date | null) => void;
  setDuration: (duration: number) => void;
  setRemainingTime: (time: number) => void;

  stopStoreTimer: () => Promise<void>;
  startStoreTimer: () => Promise<void>;
  updateRemainingTime: () => void;
}

const useTimerStore = create<TimerStore>((set, get) => ({
  timerRunning: false,
  endTime: null,
  duration: 0,
  remainingTime: 0,

  setTimerRunning: (running) => set({ timerRunning: running }),
  setEndTime: (time) => set({ endTime: time }),
  setDuration: (duration) => set({ duration }),
  setRemainingTime: (time) => set({ remainingTime: time }),

  updateRemainingTime: () => {
    const { endTime } = get();
    if (endTime) {
      const now = new Date();
      const diffInSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);
      set({ remainingTime: diffInSeconds });
      useSteakStore.getState().updateSteaksStatus(diffInSeconds);
    }
  },

  stopStoreTimer: async () => {
    await AsyncStorage.removeItem('steakTimerData');
    set({
      timerRunning: false,
      remainingTime: 0,
      endTime: null,
    });
    useSteakStore.getState().resetSteaksStatus();
  },

  startStoreTimer: async () => {
    const { duration } = get();
    const now = new Date();
    const newEndTime = new Date(now.getTime() + (duration * 1000));

    set({
      endTime: newEndTime,
      timerRunning: true,
      remainingTime: duration, // Set initial remaining time immediately
    });

    const steakStore = useSteakStore.getState();
    steakStore.handleSteaksWithLongestTime(duration);

    try {
      const dataToSave = {
        steaks: steakStore.steaks,
        endTime: newEndTime.toISOString(),
        remainingTime: newEndTime,
      };
      await AsyncStorage.setItem('steakTimerData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save timer and steaks:', error);
    }
  },
}));

// Custom hook for the timer effect
export const useTimerEffect = () => {
  const {
    timerRunning,
    endTime,
    setRemainingTime,
    setTimerRunning,
    updateRemainingTime,
  } = useTimerStore();
  const { resetSteaksStatus } = useSteakStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timerRunning && endTime) {
      // Immediately update the remaining time
      updateRemainingTime();

      timer = setInterval(async () => {
        const now = new Date();
        const diffInSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);

        if (diffInSeconds <= 0) {
          clearInterval(timer);
          setRemainingTime(0);
          setTimerRunning(false);
          resetSteaksStatus();
          await AsyncStorage.removeItem('steakTimerData');
        } else {
          setRemainingTime(diffInSeconds);
          useSteakStore.getState().updateSteaksStatus(diffInSeconds);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerRunning, endTime, setRemainingTime, setTimerRunning, resetSteaksStatus, updateRemainingTime]);
};

export default useTimerStore;
