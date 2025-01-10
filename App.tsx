import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, Alert, Linking } from 'react-native';
import SteakModal from './components/SteakModal';
import BeforeYouGrill from './components/BeforeYouGrill';
import StartTimerModal from './components/StartTimerModal.tsx';
import TopButtons from './components/TopButtons';
import SteakList from './components/SteakList.tsx';
import { addSteak, editSteak, getSteaks, getCookingTimes, updateSteaks, Steak } from './data/SteakData.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.tsx';
import { formatTime } from './data/Helpers.tsx';
import notifee, { TimestampTrigger, TriggerType, AuthorizationStatus } from '@notifee/react-native';
import StopTimerModal from './components/StopTimerModal.tsx';
import globalStyles from './styles/globalStyles.tsx';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [stopTimerModalVisible, setStopTimerModalVisible] = useState(false);
  const [beforeYouGrillVisible, setBeforeYouGrillVisible] = useState(false);
  const [startTimeModalVisible, setStartTimerModalVisible] = useState(false);
  const [steaks, setSteaks] = useState(getSteaks());
  const [editingSteak, setEditingSteak] = useState<Steak | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [steakToDelete, setSteakToDelete] = useState<Steak | null>(null);
  const [longestTime, setLongestTime] = useState(0);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  library.add(fas);

  // Schedule a single notification using Notifee
  const scheduleNotification = async (title: string, body: string, secondsFromNow: number) => {
    try {
      const triggerTime = Date.now() + secondsFromNow * 1000;

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime,
      };

      await notifee.createChannel({
        id: 'steak-timer',
        name: 'Steak Timer Notifications',
      });

      await notifee.createTriggerNotification(
        {
          title,
          body,
          android: {
            channelId: 'steak-timer',
            smallIcon: 'ic_launcher',
          },
          ios: {
            interruptionLevel: 'timeSensitive',
            sound: 'default',
          },
        },
        trigger
      );

      console.log(`Notification scheduled: ${title} - ${body} at ${new Date(triggerTime)}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Group steaks by time and schedule grouped notifications
  const groupSteaksByTime = (steaksToGroup: Steak[], action: 'place' | 'flip') => {
    const grouped: Record<number, string[]> = {};

    steaksToGroup.forEach((steak) => {
      let time = 0;
      let diffTime = longestTime - steak.totalCookingTime();
      if (action === 'place') {
        time = steak.totalCookingTime();
      }
      else if (action === 'flip') {
        if (longestTime === steak.totalCookingTime()) {
          time = steak.firstSideTime;
        }
        else {
          time = longestTime - steak.firstSideTime + diffTime;
        }
      }
      console.log(time);
      if (!grouped[time]) { grouped[time] = []; }
      grouped[time].push(steak.personName);
    });

    return grouped;
  };

  const scheduleGroupedNotifications = async (groupedSteaks: Steak[]) => {
    // Place notifications
    const placeGrouped = groupSteaksByTime(groupedSteaks, 'place');
    for (const [time, names] of Object.entries(placeGrouped)) {
      await scheduleNotification(
        'Place Steaks',
        `It's time to place ${names.join(' and ')}'s ${steaks.length === 1 ? 'steak' : 'steaks'} on the grill!`,
        longestTime - Number(time)
      );
    }

    // Flip notifications
    const flipGrouped = groupSteaksByTime(steaks, 'flip');
    for (const [time, names] of Object.entries(flipGrouped)) {
      await scheduleNotification(
        'Flip Steaks',
        `Time to flip ${names.join(' and ')}'s ${steaks.length === 1 ? 'steak' : 'steaks'}!`,
        Number(time)
      );
    }
  };

  const showStopTimerModal = () => {
    setStopTimerModalVisible(true);
  };

  const showDeleteConfirm = (steak: Steak) => {
    setSteakToDelete(steak);
    setDeleteModalVisible(true);
  };

  const handleSave = (steak: Steak) => {
    if (editingSteak) {
      const index = steaks.indexOf(editingSteak);
      editSteak(index, steak);
    } else {
      const cookingTimes = getCookingTimes(steak.centerCook, steak.thickness);

      steak.firstSideTime = cookingTimes?.firstSide ?? 0;
      steak.secondSideTime = cookingTimes?.secondSide ?? 0;

      addSteak(steak);
    }
    const updatedSteaks = [...getSteaks()];
    setSteaks(updatedSteaks);
    setEditingSteak(null);

    setLongestTime(Math.max(...updatedSteaks.map((calcSteak) => calcSteak.totalCookingTime())));
  };

  const handleOnAddSteak = () => {
    setModalVisible(true);
  };
  const handleDelete = () => {
    if (steakToDelete) {
      const updatedSteaks = steaks.filter((steak) => steak !== steakToDelete);
      setSteaks(updatedSteaks);
      setDeleteModalVisible(false);
      setSteakToDelete(null);

      updateSteaks(updatedSteaks);

      setLongestTime(Math.max(...updatedSteaks.map((calcSteak) => calcSteak.totalCookingTime())));
    }
  };

  const stopTimer = () => {
    setStopTimerModalVisible(false);
    setTimerRunning(false);
    setRemainingTime(0);
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
    const now = new Date();
    const calculatedEndTime = new Date(now.getTime() + longestTime * 1000);
    setEndTime(calculatedEndTime);
    setTimerRunning(true);

    // Schedule notifications
    await scheduleGroupedNotifications(steaks);
    await scheduleCompleteNotification(calculatedEndTime);
  };

  const scheduleCompleteNotification = async (calculatedEndTime: Date) => {
    const date = calculatedEndTime;

    const channelId = await notifee.createChannel({
      id: 'steak-timer',
      name: 'Steak Timer Notifications',
      importance: 4,
      sound: 'default', // Ensure the sound is set to default or a valid sound file
      vibration: true,
      lights: true,
    });

    // Create a trigger for the notification
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // Convert date to milliseconds
    };

    // Create and schedule the notification
    await notifee.createTriggerNotification(
      {
        title: 'Steaks Ready',
        body: steaks.length === 1 ? 'Steak is done!' : 'Steaks are done!',
        android: {
          channelId: channelId, // Ensure the channel exists
          importance: 4,
          sound: 'default', // Ensure the sound is set to default or a valid sound file
        },
        ios: {
          // iOS resource (.wav, aiff, .caf)
          interruptionLevel: 'timeSensitive',
          sound: 'default',

        },
      },
      trigger
    );
  };

  useEffect(() => {
    let timer: any;

    if (timerRunning && endTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor((endTime.getTime() - now.getTime()) / 1000);
        if (diffInSeconds <= 0) {
          clearInterval(timer);
          setRemainingTime(0);
          setTimerRunning(false);
        } else {
          setRemainingTime(diffInSeconds);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerRunning, endTime]);

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.appTitle}>
        Steak Grilling Guide
      </Text>
      <TopButtons
        onAdd={() => handleOnAddSteak()}
        onPause={() => {
          showStopTimerModal();
        }}
        onInfo={() => setBeforeYouGrillVisible(true)}
        onStart={() => setStartTimerModalVisible(true)}
        pauseEnabled={timerRunning}
        startEnabled={!timerRunning && steaks.length > 0}
      />
      {steaks && steaks.length > 0 && (
        <Text style={styles.longestTime}>
          {timerRunning && remainingTime > 0 ? formatTime(remainingTime) : formatTime(longestTime)}
        </Text>
      )}x
      {(!steaks || steaks.length === 0) && (
        <Text onPress={() => setModalVisible(true)} style={styles.noneAddedText}>
          No Steaks Added
        </Text>
      )}
      <SteakList steaks={steaks} onEdit={handleEdit} onDelete={showDeleteConfirm} actionsDisabled={timerRunning} />

      <SteakModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSteak(null);
        }}
        onSave={handleSave}
        editingSteak={editingSteak}
      />

      <BeforeYouGrill visible={beforeYouGrillVisible} onClose={() => setBeforeYouGrillVisible(false)} />

      <StopTimerModal visible={stopTimerModalVisible} onClose={() => setStopTimerModalVisible(false)} onStop={stopTimer} />

      <StartTimerModal
        visible={startTimeModalVisible}
        steaks={steaks}
        onClose={() => setStartTimerModalVisible(false)}
        onStart={startTimer}
      />

      <ConfirmDeleteModal
        deleteModalVisible={deleteModalVisible}
        steakToDelete={steakToDelete}
        setDeleteModalVisible={() => setDeleteModalVisible(false)}
        handleDelete={handleDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default App;
