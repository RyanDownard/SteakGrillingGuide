import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSteakContext } from './SteaksContext';

const TimerContext = createContext<any>(null);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [duration, setDuration] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const { updateSteaksStatus, handleSteaksWithLongestTime } = useSteakContext();

    const stopContextTimer = async () => {
        await AsyncStorage.removeItem('steakTimerData');
        setTimerRunning(false);
        setRemainingTime(0);
    };

    const startContextTimer = async () => {
        const now = new Date();
        const calculatedEndTime = new Date(now.getTime() + duration * 1000);
        setEndTime(calculatedEndTime);
        handleSteaksWithLongestTime(duration);
        setTimerRunning(true);
    };

    useEffect(() => {
        let timer: any;

        if (timerRunning && endTime) {
            timer = setInterval(async () => {
                const now = new Date();
                const diffInSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);
                if (diffInSeconds <= 0) {
                    clearInterval(timer);
                    setRemainingTime(0);
                    setTimerRunning(false);
                    await AsyncStorage.removeItem('steakTimerData');
                }
                else {
                    setRemainingTime(diffInSeconds);
                    updateSteaksStatus(diffInSeconds);
                }
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [timerRunning, endTime, remainingTime, updateSteaksStatus]);

    return (
        <TimerContext.Provider value={{ remainingTime, duration, timerRunning, endTime, startContextTimer, stopContextTimer, setDuration, setTimerRunning, setEndTime, setRemainingTime }}>
            {children}
        </TimerContext.Provider>
    );

};


export const useTimer = () => useContext(TimerContext);
