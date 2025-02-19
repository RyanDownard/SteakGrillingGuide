import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { SavedSteak, Steak } from '../data/SteakData';

const SAVED_STEAKS_STORAGE_KEY = 'favoriteSteaks';

interface SavedSteaksState {
  savedSteaks: SavedSteak[];
  loadSavedSteaks: () => Promise<void>;
  addSavedSteak: (steakToSave: Steak) => Promise<void>;
  updateSavedSteak: (savedSteak: SavedSteak) => Promise<void>;
  removeSavedSteak: (id: number) => Promise<void>;
}

const useSavedSteaksStore = create<SavedSteaksState>((set, get) => ({
  savedSteaks: [],

  loadSavedSteaks: async () => {
    try {
      const storedData = await AsyncStorage.getItem(SAVED_STEAKS_STORAGE_KEY);
      if (storedData) {
        set({ savedSteaks: JSON.parse(storedData) });
      }
    } catch (error) {
      console.error('Failed to load saved steaks:', error);
    }
  },

  addSavedSteak: async (steakToSave) => {
    try {
      const { savedSteaks } = get();
      const matchSteak = savedSteaks.find(
        (i) => i.personName === steakToSave.personName && i.centerCook === steakToSave.centerCook
      );

      if (matchSteak) {
        Alert.alert('Steak with name and center cook already saved to device');
        steakToSave = {
          ...steakToSave,
          id: matchSteak.id,
          savedSteak: matchSteak,
        };
        return;
      }

      let nextId = 1;
            if (savedSteaks.length > 0) {
                nextId = savedSteaks
                    .reduce((prev: number, current: SavedSteak) =>
                        (
                            prev > current.id) ? prev : current.id
                    , 0) + 1;
            }
      const savedSteakInfo = new SavedSteak(nextId, steakToSave.personName, steakToSave.centerCook);

      const updatedSteaks = [...savedSteaks, savedSteakInfo] as Steak[];
      await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(updatedSteaks));

      set({ savedSteaks: updatedSteaks });
      steakToSave.savedSteak = savedSteakInfo;

      Alert.alert('Steak saved!');
    } catch (error) {
      Alert.alert('An error occurred while attempting to save steak');
      console.error('Failed to save favorite steak:', error);
    }
  },

  updateSavedSteak: async (updatedSteak) => {
    try {
      const { savedSteaks } = get();
      const updatedSteaks = savedSteaks.map((steak) =>
        steak?.id === updatedSteak.id ? { ...steak, savedSteak: updatedSteak } : steak
      ) as Steak[];

      await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(updatedSteaks));
      set({ savedSteaks: updatedSteaks });
    } catch (error) {
      Alert.alert('Failed to update saved steak.');
      console.error('Failed to update favorite steak:', error);
    }
  },

  removeSavedSteak: async (id) => {
    try {
      const { savedSteaks } = get();
      const updatedSteaks = savedSteaks.filter((steak) => steak?.id !== id);

      await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(updatedSteaks));
      set({ savedSteaks: updatedSteaks });

      Alert.alert('Saved steak removed!');
    } catch (error) {
      Alert.alert('An error occurred while attempting to remove steak');
      console.error('Failed to remove favorite steak:', error);
    }
  },
}));

export default useSavedSteaksStore;
