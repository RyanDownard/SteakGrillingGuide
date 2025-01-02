import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import SteakModal from './components/SteakModal';
import { addSteak, editSteak, getSteaks } from './data/SteakData.tsx';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [steaks, setSteaks] = useState(getSteaks());
  const [editingSteak, setEditingSteak] = useState(null);

  const handleSave = (steak: any) => {
    if (editingSteak) {
      const index = steaks.indexOf(editingSteak);
      editSteak(index, steak);
    } else {
      addSteak(steak);
    }
    setSteaks([...getSteaks()]);
    setEditingSteak(null);
  };

  const handleEdit = (steak: any) => {
    setEditingSteak(steak);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} >
       <Text>Add Steak</Text>
        </TouchableOpacity>

      <FlatList
        data={steaks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.steakItem}>
            <Text>
              {item.personName}: {item.desiredDoneness} (First:{' '}
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
});

export default App;
