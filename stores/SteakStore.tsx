import { create } from 'zustand';
import { Steak, SavedSteak, CookData, Duration } from '../data/SteakData';
import steakSettings from '../data/SteakSettings.json';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SteakStore {
    steaks: Steak[];
    addSteak: (steak: Steak) => void;
    clearSteaks: () => void;
    editSteak: (index: number, updatedSteak: Steak) => void;
    updateSteaks: (newSteaks: Steak[]) => void;
    updateSteaksWithSavedId: (updatedInfo: SavedSteak) => void;
    removeAnySavedSteakInfo: (id: number) => void;
    handleSteaksWithLongestTime: (longestTime: number) => void;
    updateSteaksStatus: (timeRemaining: number, endsAt: Date) => void;
    getSteaks: () => Steak[];
    getCookingTimes: (centerCook: string, thickness: number) => { firstSide: number; secondSide: number } | null;
    resetSteaksStatus: () => void;
}

const useSteakStore = create<SteakStore>((set, get) => ({
    steaks: [],

    addSteak: (steak) => set((state) => ({ steaks: [...state.steaks, steak] })),

    clearSteaks: () => set(() => ({ steaks: []})),

    editSteak: (index, updatedSteak) =>
        set((state) => ({
            steaks: state.steaks.map((steak, i) => (i === index ? updatedSteak : steak)),
        })),

    updateSteaks: (newSteaks) => set(() => ({ steaks: [...newSteaks] })),

    updateSteaksWithSavedId: (updatedInfo) =>
        set((state) => ({
            steaks: state.steaks.map((steak) =>
                steak.savedSteak?.id === updatedInfo.id
                    ? { ...steak, personName: updatedInfo.personName, centerCook: updatedInfo.centerCook }
                    : steak
            ),
        })),

    removeAnySavedSteakInfo: (id) =>
        set((state) => ({
            steaks: state.steaks.map((steak) =>
                steak.savedSteak?.id === id ? { ...steak, savedSteak: null } : steak
            ),
        })),

    handleSteaksWithLongestTime: (longestTime) => {
        const steaksToPlace = get().steaks.filter(
            (steak) => steak.firstSideTime + steak.secondSideTime === longestTime
        );

        if (steaksToPlace.length > 0) {
            set((state) => ({
                steaks: state.steaks.map((steak) =>
                    steaksToPlace.includes(steak) ? { ...steak, isPlaced: true } : steak
                ),
            }));
        }
    },

    updateSteaksStatus: async (remainingTime, endsAt) => {
        const steaksToPlace = get().steaks.filter(
            (steak) => steak.firstSideTime + steak.secondSideTime > remainingTime && !steak.isPlaced
        );

        if (steaksToPlace.length > 0) {
            set((state) => ({
                steaks: state.steaks.map((steak) =>
                    steaksToPlace.includes(steak) ? { ...steak, isPlaced: true } : steak
                ),
            }));
            Toast.show({
                type: 'success',
                text1: `${steaksToPlace.map((s) => s.personName + "'s").join(', ')} ${
                    steaksToPlace.length === 1 ? 'steak' : 'steaks'
                } ready to be placed on the grill`,
                topOffset: 80,
            });
        }

        const steaksToFlip = get().steaks.filter(
            (steak) => steak.secondSideTime > remainingTime && !steak.isFlipped
        );

        if (steaksToFlip.length > 0) {
            set((state) => ({
                steaks: state.steaks.map((steak) =>
                    steaksToFlip.includes(steak) ? { ...steak, isFlipped: true } : steak
                ),
            }));
            Toast.show({
                type: 'success',
                text1: `${steaksToFlip.map((s) => s.personName + "'s").join(', ')} ${
                    steaksToFlip.length === 1 ? 'steak' : 'steaks'
                } ready to be flipped on the grill`,
                topOffset: 80,
            });
        }

        if(steaksToFlip.length > 0 || steaksToPlace.length > 0) {
            try {
                const dataToSave = {
                  steaks: get().steaks,
                  endTime: endsAt,
                };
                await AsyncStorage.setItem('steakTimerData', JSON.stringify(dataToSave));
              } catch (error) {
                console.error('Failed to save timer and steaks:', error);
              }
        }
    },

    resetSteaksStatus: () => {
        set((state) => ({
            steaks: state.steaks.map((steak) => ({ ...steak, isPlaced: false, isFlipped: false })),
        }));
    },

    getSteaks: () => get().steaks,

    getCookingTimes: (centerCook, thickness) => {
        const cookData = steakSettings.find((data: CookData) => data.CenterCook === centerCook);
        if (!cookData) {
            console.error('CenterCook not found');
            return null;
        }

        const duration = cookData.Durations.find((d: Duration) => d.Thickness === thickness);
        if (!duration) {
            console.error('Thickness not found for the selected CenterCook');
            return null;
        }

        return { firstSide: duration.FirstSide, secondSide: duration.SecondSide };
    },
}));

export default useSteakStore;
