import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import SteakModal from './components/SteakModal';
import BeforeYouGrill from './components/BeforeYouGrill';
import StartTimerModal from './components/StartTimerModal.tsx';
import TopButtons from './components/TopButtons';
import SteakList from './components/SteakList.tsx';
import { addSteak, editSteak, getSteaks, getCookingTimes, Steak } from './data/SteakData.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [beforeYouGrillVisible, setBeforeYouGrillVisible] = useState(false);
  const [startTimeModalVisible, setStartTimerModalVisible] = useState(false);
  const [steaks, setSteaks] = useState(getSteaks());
  const [editingSteak, setEditingSteak] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0); // Timer countdown in seconds
  const [timerRunning, setTimerRunning] = useState(false);

  library.add(fas);

  const handleSave = (steak: Steak) => {
    if (editingSteak) {
      const index = steaks.indexOf(editingSteak);
      editSteak(index, steak);
    } else {
      var cookingTimes = getCookingTimes(steak.centerCook, steak.thickness);

      steak.firstSideTime = cookingTimes?.firstSide ?? 0;
      steak.secondSideTime = cookingTimes?.secondSide ?? 0;

      addSteak(steak);
    }
    setSteaks([...getSteaks()]);
    setEditingSteak(null);
  };

  const handleOnAddSteak = () => {
    setModalVisible(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    setRemainingTime(0);
  };

  const showInfo = () => {
    setBeforeYouGrillVisible(true);
  };

  const startTimer = () => {
    setStartTimerModalVisible(false);
    setRemainingTime(Math.max(...steaks.map(o => o.firstSideTime + o.secondSideTime)));
    setTimerRunning(true);
  };

  useEffect(() => {
    let timer: any;
    if (timerRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerRunning, remainingTime]);

  const showStartTimeModal = () => {
    setStartTimerModalVisible(true);
  };

  // Calculate the longest total time
  const getLongestTime = (): string => {
    if (steaks.length === 0) { return '0:00'; }

    const maxTime = Math.max(
      ...steaks.map((steak) => steak.firstSideTime + steak.secondSideTime)
    );

    const minutes = Math.floor(maxTime / 60);
    const seconds = maxTime % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRemainingMinutes = (): string => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopButtons onAdd={handleOnAddSteak} onPause={pauseTimer} onInfo={showInfo} onStart={showStartTimeModal} />
      ({(steaks !== null && steaks.length > 0) ? (<Text style={styles.longestTime}>{timerRunning ? getRemainingMinutes() : getLongestTime()}</Text>) : null})
      ({((steaks === null || steaks.length === 0)) ? (<Text onPress={handleOnAddSteak} style={styles.noneAddedText}>No Steaks Added</Text>) : null})
      <SteakList steaks={steaks} onEdit={handleEdit} />

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
        onClose={() => { setBeforeYouGrillVisible(false); }} />

      ({steaks.length > 0 ? (<StartTimerModal visible={startTimeModalVisible} steaks={steaks} onClose={() => setStartTimerModalVisible(false)} onStart={startTimer} />) : null})
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  steakItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
