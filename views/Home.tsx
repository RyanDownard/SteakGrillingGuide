import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, Alert, Linking, View, TouchableOpacity } from 'react-native';
import SteakModal from '../components/SteakModal';
import BeforeYouGrill from '../components/BeforeYouGrill';
import StartTimerModal from '../components/StartTimerModal.tsx';
import TopButtons from '../components/TopButtons';
import SteakList from '../components/SteakList.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import notifee, { TimestampTrigger, TriggerType, AuthorizationStatus, AndroidImportance } from '@notifee/react-native';
import StopTimerModal from '../components/StopTimerModal.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTimerStore from '../stores/TimerStore.tsx';
import useSteakStore from '../stores/SteakStore.tsx';
import { Steak } from '../data/SteakData.tsx';
import globalStyles from '../styles/globalStyles.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
  const { duration, timerRunning, timerComplete, startStoreTimer, stopStoreTimer, setDuration, setTimerRunning, setEndTime, setRemainingTime, setTimerComplete } = useTimerStore();
  const { steaks, addSteak, clearSteaks, editSteak, updateSteaks } = useSteakStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [stopTimerModalVisible, setStopTimerModalVisible] = useState(false);
  const [beforeYouGrillVisible, setBeforeYouGrillVisible] = useState(false);
  const [startTimeModalVisible, setStartTimerModalVisible] = useState(false);
  const [editingSteak, setEditingSteak] = useState<Steak | null>(null);

  library.add(fas);

  const scheduleNotification = async (title: string, body: string, secondsFromNow: number) => {
    try {
      const currentStartTime = useTimerStore.getState().startTime;
      const triggerTime = currentStartTime!.getTime() + secondsFromNow * 1000;

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime,
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      await notifee.createChannel({
        id: 'sound',
        name: `Steak Timer Notifications ${new Date(triggerTime)}`,
        lights: true,
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',

      });

      await notifee.createTriggerNotification(
        {
          title,
          body,
          android: {
            channelId: 'sound',
            smallIcon: 'ic_launcher',
            sound: 'default',
            badgeCount: 1,
            importance: AndroidImportance.HIGH,
          },
          ios: {
            interruptionLevel: 'timeSensitive',
            sound: 'default',
            badgeCount: 1,
            critical: true,
            criticalVolume: 5,
          },
        },
        trigger
      );
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const groupSteaksByTime = (steaksToGroup: Steak[], action: 'place' | 'flip') => {
    const grouped: Record<number, string[]> = {};

    steaksToGroup.forEach((steak) => {
      let time = 0;
      let diffTime = duration - (steak.firstSideTime + steak.secondSideTime);
      if (action === 'place') {
        if ((steak.firstSideTime + steak.secondSideTime) === duration) { return; }
        time = (steak.firstSideTime + steak.secondSideTime);
      } else if (action === 'flip') {
        time = steak.firstSideTime + diffTime;
      }

      if (!grouped[time]) {
        grouped[time] = [];
      }
      grouped[time].push(steak.personName);
    });

    return grouped;
  };

  const scheduleGroupedNotifications = async () => {
    const placeGrouped = groupSteaksByTime(steaks, 'place');
    for (const [time, names] of Object.entries(placeGrouped)) {
      await scheduleNotification(
        'Place Steaks',
        `It's time to place ${names.map((name) => name + "'s").join(' and ')} ${names.length === 1 ? 'steak' : 'steaks'} on the grill!`,
        duration - Number(time)
      );
    }

    const flipGrouped = groupSteaksByTime(steaks, 'flip');
    for (const [time, names] of Object.entries(flipGrouped)) {
      await scheduleNotification(
        'Flip Steaks',
        `Time to flip ${names.map((name) => name + "'s").join(' and ')} ${names.length === 1 ? 'steak' : 'steaks'}!`,
        Number(time)
      );
    }
  };

  const showStopTimerModal = () => {
    setStopTimerModalVisible(true);
  };


  const handleSave = (steak: Steak) => {
    if (editingSteak) {
      const index = steaks.indexOf(editingSteak);
      editSteak(index, steak);
    } else {
      addSteak(steak);
    }
    setEditingSteak(null);
  };

  const handleOnAddSteak = () => {
    setModalVisible(true);
  };

  const showDeleteConfirm = (steakToDelete: Steak) => {
    Alert.alert(
      'Delete Steak?',
      `Are you sure you want to delete ${steakToDelete.personName}'s steak?`,
      [
        {
          text: 'Yes',
          onPress: () => handleDelete(steakToDelete),
        },
        {
          text: 'No',
        },
      ],
      { cancelable: false },
    );
  };

  const handleDelete = (steakToDelete: Steak) => {
    if (steakToDelete) {
      const updatedSteaks = steaks.filter((steak: Steak) => steak !== steakToDelete);

      updateSteaks(updatedSteaks);
    }
  };

  const resetState = async () => {
    setTimerComplete(false);
    clearSteaks();
  };

  const stopTimer = async () => {
    setStopTimerModalVisible(false);
    stopStoreTimer();
    notifee.cancelAllNotifications();
  };

  const startTimer = async () => {
    let permission = await notifee.requestPermission({
      sound: true,
      announcement: true,
      alert: true,
    });

    if (permission.authorizationStatus === AuthorizationStatus.DENIED) {
      Alert.alert(
        'Notification Permission Required',
        'This app needs notification permissions to notify you about steak timers. Please enable them in the app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return;
    }

    setStartTimerModalVisible(false);
    await startStoreTimer();

    try {
      await scheduleGroupedNotifications();
      await scheduleCompleteNotification();
    }
    catch (error) {
      console.error('Error while scheduling notifications', error);
    }
  };

  const scheduleCompleteNotification = async () => {
    const endsAt = useTimerStore.getState().startTime!.getTime() + (duration * 1000);

    const channelId = await notifee.createChannel({
      id: 'steak-timer',
      name: 'Steak Timer Notifications',
      importance: 4,
      sound: 'default',
      vibration: true,
      lights: true,
    });

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: endsAt,
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    await notifee.createTriggerNotification(
      {
        title: 'Steaks Ready',
        body: steaks.length === 1 ? 'Steak is done!' : 'Steaks are done!',
        android: {
          channelId: channelId,
          importance: 4,
          sound: 'default',
        },
        ios: {
          interruptionLevel: 'timeSensitive',
          sound: 'default',

        },
      },
      trigger
    );
  };

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  const checkShowBeforeYouGrillModal = async () => {
    try {
      const value = await AsyncStorage.getItem('hideInfoModalOnStart');
      if (value === undefined || value !== 'true') {
        setBeforeYouGrillVisible(true);
      }
    } catch (error) {
      console.error('Error reading stored value:', error);
    }
  };

  useEffect(() => {
    setDuration(Math.max(...steaks.map((calcSteak: Steak) => calcSteak.firstSideTime + calcSteak.secondSideTime)));
  }, [steaks, setDuration]);

  useEffect(() => {
    const loadSteakData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('steakTimerData');

        if (savedData) {
          const { steaks: savedSteaks, endTime: savedEndTime } = JSON.parse(savedData);

          const now = new Date();
          const endsAt = new Date(savedEndTime);
          const diffInSeconds = Math.floor((endsAt.getTime() - now.getTime()) / 1000);

          if (diffInSeconds > 0) {
            updateSteaks(savedSteaks);
            setEndTime(endsAt);
            setRemainingTime(diffInSeconds);
            setTimerRunning(true);
          } else {
            // If the timer expired, reset
            await AsyncStorage.removeItem('steakTimerData');
            Alert.alert('Unexpected Close',
              "The app closed unexpectedly, if it's on us, we hope your steaks still turned out great and apologize for the inconvinence.");
          }
        }
      } catch (error) {
        console.error('Failed to load timer and steaks data:', error);
      }
    };

    if (steaks !== undefined && steaks.length === 0) {
      loadSteakData();
    }
  }, [setEndTime, setRemainingTime, setTimerRunning, updateSteaks, steaks]);

  useEffect(() => {
    checkShowBeforeYouGrillModal();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopButtons
        onAdd={() => handleOnAddSteak()}
        onPause={() => {
          showStopTimerModal();
        }}
        onInfo={() => setBeforeYouGrillVisible(true)}
        onStart={() => setStartTimerModalVisible(true)}
        allDisabled={timerComplete}
        addSteakEnabled={!timerRunning}
        pauseEnabled={timerRunning}
        startEnabled={!timerRunning && steaks.length > 0}
      />
      {(!steaks || steaks.length === 0 && !timerComplete) && (
        <Text onPress={() => setModalVisible(true)} style={styles.noneAddedText}>
          No Steaks Added
        </Text>
      )}

      {timerComplete && (
        <View style={styles.completeContainer}>
          <Text style={styles.completedText}>
            {steaks.length === 1 ? 'Steak' : 'Steaks'} Ready!
          </Text>
          <Text style={styles.prepText}>
            Be sure to let rest for 5 minutes and ensure they are cooked properly before eating.
          </Text>
          <View style={styles.resetContainer}>
            <TouchableOpacity onPress={resetState} style={[globalStyles.fontAwesomeButton, globalStyles.goodButtonOutline, styles.resetButton]} >
            <FontAwesomeIcon icon={faRefresh} size={24} color="#5cb85c" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!timerComplete && (
        <SteakList
          steaks={steaks}
          onEdit={handleEdit}
          onDelete={showDeleteConfirm}
          actionsDisabled={timerRunning} />
      )}

      <SteakModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSteak(null);
        }}
        onSave={handleSave}
        editingSteak={editingSteak}
      />

      <BeforeYouGrill
        visible={beforeYouGrillVisible} onClose={() => setBeforeYouGrillVisible(false)}
      />

      <StopTimerModal
        visible={stopTimerModalVisible} onClose={() => setStopTimerModalVisible(false)}
        onStop={stopTimer}
      />

      <StartTimerModal
        visible={startTimeModalVisible}
        steaks={steaks}
        onClose={() => setStartTimerModalVisible(false)}
        onStart={startTimer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  longestTime: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  noneAddedText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 20,
  },
  completeContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  completedText: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#5cb85c',
  },
  prepText: {
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  resetContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resetText: {
    color: '#5cb85c',
  },
  resetButton: {
    width: 150,
  },
});

export default Home;
