import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedSteak, Steak } from '../data/SteakData';
import useToastStore from './ToastStore';

const SAVED_STEAKS_STORAGE_KEY = 'favoriteSteaks';
const showToastMessage = (message: string) => useToastStore.getState().showToast(message);

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
        showToastMessage('Steak already saved for that name and cook level.');
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

      showToastMessage('Steak saved.');
    } catch (error) {
      showToastMessage('Unable to save steak right now.');
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
      showToastMessage('Unable to update saved steak.');
      console.error('Failed to update favorite steak:', error);
    }
  },

  removeSavedSteak: async (id) => {
    try {
      const { savedSteaks } = get();
      const updatedSteaks = savedSteaks.filter((steak) => steak?.id !== id);

      await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(updatedSteaks));
      set({ savedSteaks: updatedSteaks });

      showToastMessage('Saved steak removed.');
    } catch (error) {
      showToastMessage('Unable to remove saved steak.');
      console.error('Failed to remove favorite steak:', error);
    }
  },
}));

export default useSavedSteaksStore;
