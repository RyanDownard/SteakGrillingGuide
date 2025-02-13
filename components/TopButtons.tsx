import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faStop, faCircleInfo, faPlay } from '@fortawesome/free-solid-svg-icons';
import globalStyles from '../styles/globalStyles';

interface Props {
  onAdd: () => void;
  onPause: () => void;
  onInfo: () => void;
  onStart: () => void;
  pauseEnabled: boolean;
  startEnabled: boolean;
  addSteakEnabled: boolean;
}

const TopButtons: React.FC<Props> = ({ onAdd, onPause, onInfo, onStart, pauseEnabled, startEnabled, addSteakEnabled }) => {
  return (
    <View style={globalStyles.actionButtonsContainer}>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.goodButtonOutline, !addSteakEnabled && globalStyles.disabledButton]} onPress={onAdd} disabled={!addSteakEnabled}>
        <FontAwesomeIcon icon={faPlus} size={24} color={addSteakEnabled ? '#03911f' : '#949799'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.badButtonOutline, !pauseEnabled && globalStyles.disabledButton]} onPress={onPause} disabled={!pauseEnabled}>
        <FontAwesomeIcon icon={faStop} size={24} color={!pauseEnabled ? '#949799' : '#c70404'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.infoButtonOutline]} onPress={onInfo}>
        <FontAwesomeIcon icon={faCircleInfo} size={24} color={'#029af2'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.goodButtonOutline, !startEnabled && globalStyles.disabledButton]} onPress={onStart} disabled={!startEnabled}>
        <FontAwesomeIcon icon={faPlay} size={24} color={!startEnabled ? '#949799' : '#03911f'} />
      </TouchableOpacity>
    </View>
  );
};

export default TopButtons;
