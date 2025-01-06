import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, Modal, View, Button } from 'react-native';
import SteakModal from './components/SteakModal';
import BeforeYouGrill from './components/BeforeYouGrill';
import StartTimerModal from './components/StartTimerModal.tsx';
import TopButtons from './components/TopButtons';
import SteakList from './components/SteakList.tsx';
import { addSteak, editSteak, getSteaks, getCookingTimes, updateSteaks, Steak } from './data/SteakData.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.tsx';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
    setSteaks([...getSteaks()]);
    setEditingSteak(null);

    setLongestTime(Math.max(
      ...steaks.map((steak) => steak.firstSideTime + steak.secondSideTime)
    ));
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
    }
  };

  const showDeleteConfirm = (steak: Steak) => {
    setSteakToDelete(steak);
    setDeleteModalVisible(true);
  };

  const startTimer = () => {
    setStartTimerModalVisible(false);
    const now = new Date();
    const calculatedEndTime = new Date(now.getTime() + longestTime * 1000);
    setEndTime(calculatedEndTime);
    setTimerRunning(true);
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

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopButtons
        onAdd={handleOnAddSteak}
        onPause={() => {
          setTimerRunning(false);
          setRemainingTime(0);
        }}
        onInfo={() => setBeforeYouGrillVisible(true)}
        onStart={() => setStartTimerModalVisible(true)}
      />
      {steaks && steaks.length > 0 && (
        <Text style={styles.longestTime}>
          {timerRunning && remainingTime > 0 ? formatTime(remainingTime) : formatTime(longestTime)}
        </Text>
      )}
      {(!steaks || steaks.length === 0) && (
        <Text onPress={handleOnAddSteak} style={styles.noneAddedText}>
          No Steaks Added
        </Text>
      )}
      <SteakList steaks={steaks} onEdit={handleEdit} onDelete={showDeleteConfirm} />

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
        visible={beforeYouGrillVisible}
        onClose={() => setBeforeYouGrillVisible(false)}
      />

      {steaks.length > 0 && (
        <StartTimerModal
          visible={startTimeModalVisible}
          steaks={steaks}
          onClose={() => setStartTimerModalVisible(false)}
          onStart={startTimer}
        />
      )}

      <ConfirmDeleteModal deleteModalVisible={deleteModalVisible} steakToDelete={steakToDelete} setDeleteModalVisible={setModalVisible} handleDelete={handleDelete}  />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
});

export default App;
