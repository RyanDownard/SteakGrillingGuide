import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OverrideKey = string;
interface TimeOverride {
  FirstSideOverride?: number;
  SecondSideOverride?: number;
}
interface OverrideState {
  overrides: Record<OverrideKey, TimeOverride>;
  loadOverrides: () => Promise<void>;
  clearAllOverrides: () => Promise<void>;
  setOverride: (centerCook: string, thickness: number, override: TimeOverride) => Promise<void>;
  getOverride: (centerCook: string, thickness: number) => TimeOverride | undefined;
  removeOverride: (centerCook: string, thickness: number) => Promise<void>;
}

const STORAGE_KEY = 'steakOverrides';

const useOverrideStore = create<OverrideState>((set, get) => ({
  overrides: {},
  loadOverrides: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    set({ overrides: raw ? JSON.parse(raw) : {} });
  },
    clearAllOverrides: async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        set({ overrides: {} });
    },
  setOverride: async (centerCook, thickness, override) => {
    const key = `${centerCook}:${thickness}`;
    const newOverrides = { ...get().overrides, [key]: override };
    set({ overrides: newOverrides });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newOverrides));
  },
  getOverride: (centerCook, thickness) => {
    const key = `${centerCook}:${thickness}`;
    return get().overrides[key];
  },
  removeOverride: async (centerCook, thickness) => {
    const key = `${centerCook}:${thickness}`;
    const newOverrides = { ...get().overrides };
    delete newOverrides[key];
    set({ overrides: newOverrides });
    return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newOverrides));
  }
}));

export default useOverrideStore;
