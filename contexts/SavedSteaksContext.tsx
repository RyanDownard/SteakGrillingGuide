import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { SavedSteak, Steak } from '../data/SteakData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedSteaksContext = createContext<any>(null);
const SAVED_STEAKS_STORAGE_KEY = 'favoriteSteaks';

export const SavedSteaksProvider = ({ children }: { children: React.ReactNode }) => {
    const [savedSteaks, setSavedSteaks] = useState<Steak[]>([]);


    // Load saved steaks from AsyncStorage when the app starts
    useEffect(() => {
        const loadSavedSteaks = async () => {
            try {
                const storedData = await AsyncStorage.getItem(SAVED_STEAKS_STORAGE_KEY);
                if (storedData) {
                    setSavedSteaks(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Failed to load saved steaks:', error);
            }
        };

        loadSavedSteaks();
    }, []);

    // Save steaks to AsyncStorage whenever the savedSteaks state changes
    useEffect(() => {
        const saveSteaksToStorage = async () => {
            try {
                await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(savedSteaks));
            } catch (error) {
                console.error('Failed to save steaks:', error);
            }
        };

        saveSteaksToStorage();
    }, [savedSteaks]);

    const addSavedSteak = async (steakToSave: Steak) => {
        try {
            const favorites = await AsyncStorage.getItem(SAVED_STEAKS_STORAGE_KEY);
            const favoritesArray = favorites ? JSON.parse(favorites) : [];

            const matchSteaks = favoritesArray.find(
                (i: SavedSteak) => i.personName === steakToSave.personName && i.centerCook === steakToSave.centerCook
            );

            if (matchSteaks !== undefined) {
                Alert.alert('Steak with name and center cook already saved to device');
                steakToSave.savedSteak = matchSteaks;
                return;
            }

            let nextId = 1;
            if (favoritesArray.length > 0) {
                nextId = favoritesArray
                    .reduce((prev: SavedSteak, current: SavedSteak) =>
                        (
                            prev && prev.id > current.id) ? prev : current
                    ) + 1;
            }

            let savedSteakInfo = new SavedSteak(
                nextId,
                steakToSave.personName,
                steakToSave.centerCook
            );

            // Add the steak to favorites
            favoritesArray.push(savedSteakInfo);
            await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(favoritesArray));
            setSavedSteaks(favoritesArray);
            Alert.alert('Steak saved!');
            return savedSteakInfo;
        } catch (error) {
            Alert.alert('An error occured while attempting to remove steak');
            console.error('Failed to save favorite steak:', error);
        }
    };

    const updateSavedSteak = async (savedSteak: SavedSteak) => {
        const favorites = await AsyncStorage.getItem(SAVED_STEAKS_STORAGE_KEY);
        const favoritesArray = favorites ? JSON.parse(favorites) : [];
        let indexOf = favoritesArray.findIndex((steak: SavedSteak) => steak.id === savedSteak.id);

        if(indexOf >= 0){
            favoritesArray[indexOf] = savedSteak;
        }
        else{
            Alert.alert('Failed to find saved steak to update.');
        }

        await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(favoritesArray));

        setSavedSteaks(favoritesArray);
    };

    const removeSavedSteak = async (id: number) => {
        const favorites = await AsyncStorage.getItem(SAVED_STEAKS_STORAGE_KEY);
        const favoritesArray = favorites ? JSON.parse(favorites) : [];
        const updated = favoritesArray.filter((steak: SavedSteak) => steak.id !== id);

        await AsyncStorage.setItem(SAVED_STEAKS_STORAGE_KEY, JSON.stringify(updated));

        setSavedSteaks(updated);

        Alert.alert('Saved steak removed!');
    };

    return (
        <SavedSteaksContext.Provider value={{ savedSteaks, addSavedSteak, removeSavedSteak, updateSavedSteak }}>
            {children}
        </SavedSteaksContext.Provider>
    );
};

export const useSavedSteaks = () => useContext(SavedSteaksContext);
