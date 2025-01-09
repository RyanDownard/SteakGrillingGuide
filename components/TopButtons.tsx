import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faStop, faCircleInfo, faPlay } from '@fortawesome/free-solid-svg-icons';

interface Props {
  onAdd: () => void;
  onPause: () => void;
  onInfo: () => void;
  onStart: () => void;
  pauseEnabled: boolean;
  startEnabled: boolean;
}

const TopButtons: React.FC<Props> = ({ onAdd, onPause, onInfo, onStart, pauseEnabled, startEnabled }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.button, styles.goodButton]} onPress={onAdd}>
        <FontAwesomeIcon icon={faPlus} size={24} color={'#03911f'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.pauseButton, !pauseEnabled && styles.disabledButton]} onPress={onPause} disabled={!pauseEnabled}>
        <FontAwesomeIcon icon={faStop} size={24} color={!pauseEnabled ? '#949799' : '#c70404'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={onInfo}>
        <FontAwesomeIcon icon={faCircleInfo} size={24} color={'#029af2'} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.goodButton, !startEnabled && styles.disabledButton]} onPress={onStart} disabled={!startEnabled}>
        <FontAwesomeIcon icon={faPlay} size={24} color={!startEnabled ? '#949799' : '#03911f'} />
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
  goodButton: {
    borderColor: '#03911f',
  },
  pauseButton: {
    borderColor: '#c70404',
  },
  infoButton: {
    borderColor: '#029af2',
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: '#949799',
  },
});

export default TopButtons;
