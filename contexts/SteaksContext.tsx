import React, { createContext, useContext, useState } from 'react';
import { Steak, SavedSteak, CookData, Duration } from '../data/SteakData';
import steakSettings from '../data/SteakSettings.json';

interface SteakContextType {
    steaks: Steak[];
    addSteak: (steak: Steak) => void;
    editSteak: (index: number, updatedSteak: Steak) => void;
    updateSteaks: (newSteaks: Steak[]) => void;
    updateSteaksWithSavedId: (updatedInfo: SavedSteak) => void;
    removeAnySavedSteakInfo: (id: number) => void;
    updateSteaksStatus: (timeRemaining: number) => void;
    getSteaks: () => Steak[];
    getCookingTimes: (centerCook: string, thickness: number) => { firstSide: number; secondSide: number } | null;
}

const SteakContext = createContext<SteakContextType | undefined>(undefined);

const SteakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [steaks, setSteaks] = useState<Steak[]>([]);

    const addSteak = (steak: Steak) => {
        setSteaks((prevSteaks) => [...prevSteaks, steak]);
    };

    const editSteak = (index: number, updatedSteak: Steak) => {
        setSteaks((prevSteaks) =>
            prevSteaks.map((steak, i) => (i === index ? updatedSteak : steak))
        );
    };

    const updateSteaks = (newSteaks: Steak[]) => {
        setSteaks([...newSteaks]);
    };

    const updateSteaksWithSavedId = (updatedInfo: SavedSteak) => {
        setSteaks((prevSteaks) =>
            prevSteaks.map((steak) =>
                steak.savedSteak && steak.savedSteak.id === updatedInfo.id
                    ? { ...steak, personName: updatedInfo.personName, centerCook: updatedInfo.centerCook, thickness: steak.thickness, firstSideTime: steak.firstSideTime, secondSideTime: steak.secondSideTime, totalCookingTime: steak.totalCookingTime, description: steak.description }
                    : steak
            )
        );
    };

    const removeAnySavedSteakInfo = (id: number) => {
        setSteaks((prevSteaks) =>
            prevSteaks.map((steak) =>
                steak.savedSteak && steak.savedSteak.id === id
                    ? { ...steak, savedSteak: null, personName: steak.personName, centerCook: steak.centerCook, thickness: steak.thickness, firstSideTime: steak.firstSideTime, secondSideTime: steak.secondSideTime, totalCookingTime: steak.totalCookingTime, description: steak.description }
                    : steak
            )
        );
    };

    const updateSteaksStatus = (remainingTime: number) => {
        const steaksToPlace = steaks.filter((steak) => steak.firstSideTime + steak.secondSideTime < remainingTime && !steak.isPlaced);
        if (steaksToPlace.length > 0) {
            steaksToPlace.forEach((steakToPlace) => {
                setSteaks((prevSteaks) =>
                    prevSteaks.map((steak) =>
                        steak === steakToPlace ? { ...steak, isPlaced: true, totalCookingTime: steak.totalCookingTime, description: steak.description } : steak
                    )
                );
            });
        }

        const steaksToFlip = steaks.filter((steak) => steak.secondSideTime < remainingTime && !steak.isFlipped);

        if(steaksToFlip.length > 0){
            steaksToFlip.forEach((steakToFlip) => {
                setSteaks((prevSteaks) =>
                    prevSteaks.map((steak) =>
                        steak === steakToFlip ? { ...steak, isFlipped: true, totalCookingTime: steak.totalCookingTime, description: steak.description } : steak
                    )
                );
            });
        }


    };

    const getSteaks = () => {
        return steaks;
    };

    const getCookingTimes = (
        centerCook: string,
        thickness: number
    ): { firstSide: number; secondSide: number } | null => {
        // Find the cook data matching the centerCook
        const cookData = steakSettings.find(
            (data: CookData) => data.CenterCook === centerCook
        );

        if (!cookData) {
            console.error('CenterCook not found');
            return null;
        }

        // Find the duration matching the thickness
        const duration = cookData.Durations.find(
            (d: Duration) => d.Thickness === thickness
        );

        if (!duration) {
            console.error('Thickness not found for the selected CenterCook');
            return null;
        }

        // Return the cooking times
        return { firstSide: duration.FirstSide, secondSide: duration.SecondSide };
    };

    return (
        <SteakContext.Provider
            value={{
                steaks,
                addSteak,
                editSteak,
                updateSteaks,
                updateSteaksWithSavedId,
                removeAnySavedSteakInfo,
                getSteaks,
                getCookingTimes,
            }}
        >
            {children}
        </SteakContext.Provider>
    );
};

const useSteakContext = () => {
    const context = useContext(SteakContext);
    if (context === undefined) {
        throw new Error('useSteakContext must be used within a SteakProvider');
    }
    return context;
};

export { SteakProvider, useSteakContext };
