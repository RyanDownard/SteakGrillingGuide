import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import SteakModal from './components/SteakModal';
import TopButtons from './components/TopButtons';
import { addSteak, editSteak, getSteaks, getCookingTimes, Steak } from './data/SteakData.tsx';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [steaks, setSteaks] = useState(getSteaks());
  const [editingSteak, setEditingSteak] = useState(null);

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
    // Pause timer logic
  };

  const showInfo = () => {
    // Show info modal
  };

  const startTimer = () => {
    // Start timer logic
  };

  // Calculate the longest total time
  const getLongestTime = (): string => {
    if (steaks.length === 0) {return '0:00';}

    const maxTime = Math.max(
      ...steaks.map((steak) => steak.firstSideTime + steak.secondSideTime)
    );

    const minutes = Math.floor(maxTime / 60);
    const seconds = maxTime % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopButtons onAdd={handleOnAddSteak} onPause={pauseTimer} onInfo={showInfo} onStart={startTimer} />
      <Text style={styles.longestTime}>{getLongestTime()}</Text>
      <FlatList
        data={steaks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.steakItem}>
            <Text>
              {item.personName}: {item.centerCook} (First:{' '}
              {item.firstSideTime}s, Second: {item.secondSideTime}s)
            </Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
          </View>
        )}
      />

      <SteakModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingSteak(null);
        }}
        onSave={handleSave}
        editingSteak={editingSteak}
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
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default App;
