import { create } from 'zustand';
import { Steak, SavedSteak, CookData, Duration } from '../data/SteakData';
import steakSettings from '../data/SteakSettings.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OVERRIDE_KEY = 'steakOverrides';
type OverrideKey = string;
interface TimeOverride {
    FirstSideOverride?: number;
    SecondSideOverride?: number;
}
interface SteakStore {
    overrides: Record<OverrideKey, TimeOverride>;
    steaks: Steak[];
    settings: CookData[];
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
    //override stuff
    loadOverrides: () => Promise<void>;
    clearAllOverrides: () => Promise<void>;
    setOverride: (centerCook: string, thickness: number, override: TimeOverride) => Promise<void>;
    removeOverride: (centerCook: string, thickness: number) => Promise<void>;
}

const useSteakStore = create<SteakStore>((set, get) => ({
    overrides: {},
    settings: steakSettings,
    steaks: [],

    addSteak: (steak) => set((state) => ({ steaks: [...state.steaks, steak] })),

    clearSteaks: () => set(() => ({ steaks: [] })),

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
        }

        if (steaksToFlip.length > 0 || steaksToPlace.length > 0) {
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
        const cookData = get().settings.find((data: CookData) => data.CenterCook === centerCook);
        if (!cookData) {
            console.error('CenterCook not found');
            return null;
        }

        const duration = cookData.Durations.find((d: Duration) => d.Thickness === thickness);
        if (!duration) {
            console.error('Thickness not found for the selected CenterCook');
            return null;
        }

        return { firstSide: duration.FirstSideOverride ?? duration.FirstSide, secondSide: duration.SecondSideOverride ?? duration.SecondSide };
    },

    loadOverrides: async () => {
        const raw = await AsyncStorage.getItem(OVERRIDE_KEY);
        const { settings } = get();
        set({ overrides: raw ? JSON.parse(raw) : {} });

        Object.entries(get().overrides).forEach(([key, override]) => {
            const [centerCook, thickness] = key.split(':');
            const duration = settings.find((data: CookData) => data.CenterCook === centerCook)?.Durations.find((findDuration: Duration) => findDuration.Thickness === Number(thickness));
            if (duration) {
                duration.FirstSideOverride = override.FirstSideOverride;
                duration.SecondSideOverride = override.SecondSideOverride;
            }
        });
    },
    clearAllOverrides: async () => {
        await AsyncStorage.removeItem(OVERRIDE_KEY);
        set({ overrides: {} });

        const { settings } = get();
        settings.forEach((data: CookData) => {
            data.Durations.forEach((duration: Duration) => {
                duration.FirstSideOverride = undefined;
                duration.SecondSideOverride = undefined;
            });
        });
        set({ settings: [...settings] });
    },
    setOverride: async (centerCook, thickness, override) => {
        const key = `${centerCook}:${thickness}`;
        const newOverrides = { ...get().overrides, [key]: override };
        set({ overrides: newOverrides });
        await AsyncStorage.setItem(OVERRIDE_KEY, JSON.stringify(newOverrides));

        const { settings } = get();
        const duration = settings.find((data: CookData) => data.CenterCook === centerCook)?.Durations.find((findDuration) => findDuration.Thickness === thickness);
        if (duration) {
            duration.FirstSideOverride = override.FirstSideOverride;
            duration.SecondSideOverride = override.SecondSideOverride;
            set({ settings: [...settings] });
        }
    },
    removeOverride: async (centerCook, thickness) => {
        const key = `${centerCook}:${thickness}`;
        const newOverrides = { ...get().overrides };
        delete newOverrides[key];
        set({ overrides: newOverrides });
        await AsyncStorage.setItem(OVERRIDE_KEY, JSON.stringify(newOverrides));

        const { settings } = get();
        const duration = settings.find((data: CookData) => data.CenterCook === centerCook)?.Durations.find((findDuration) => findDuration.Thickness === thickness);
        if (duration) {
            duration.FirstSideOverride = undefined;
            duration.SecondSideOverride = undefined;
            set({ settings: [...settings] });
        }
    },
}));

export default useSteakStore;
