import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faStop, faCircleInfo, faPlay } from '@fortawesome/free-solid-svg-icons';

interface Props {
  onAdd: () => void;
  onPause: () => void;
  onInfo: () => void;
  onStart: () => void;
}

const TopButtons: React.FC<Props> = ({ onAdd, onPause, onInfo, onStart }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.addButton]} onPress={onAdd}>
        <FontAwesomeIcon icon={faPlus} size={24} color={'#949799'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={onPause}>
        <FontAwesomeIcon icon={faStop} size={24} color={'#c70404'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={onInfo}>
        <FontAwesomeIcon icon={faCircleInfo} size={24} color={'#029af2'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.startButton]} onPress={onStart}>
        <FontAwesomeIcon icon={faPlay} size={24} color={'#03911f'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  button: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  addButton: {
    borderColor: '#949799',
  },
  pauseButton: {
    borderColor: '#c70404',
  },
  infoButton: {
    borderColor: '#029af2',
  },
  startButton: {
    borderColor: '#03911f',
  },
});

export default TopButtons;
