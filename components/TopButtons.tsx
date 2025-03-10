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
  allDisabled: boolean;
  pauseEnabled: boolean;
  startEnabled: boolean;
  addSteakEnabled: boolean;
}

const TopButtons: React.FC<Props> = ({ onAdd, onPause, onInfo, onStart, allDisabled, pauseEnabled, startEnabled, addSteakEnabled }) => {
  return (
    <View style={globalStyles.actionButtonsContainer}>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.goodButtonOutline, (allDisabled || !addSteakEnabled) && globalStyles.disabledButton]} onPress={onAdd} disabled={allDisabled || !addSteakEnabled}>
        <FontAwesomeIcon icon={faPlus} size={24} color={allDisabled || !addSteakEnabled ? '#949799' : '#03911f'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.badButtonOutline, (allDisabled || !pauseEnabled) && globalStyles.disabledButton]} onPress={onPause} disabled={allDisabled || !pauseEnabled}>
        <FontAwesomeIcon icon={faStop} size={24} color={allDisabled || !pauseEnabled ? '#949799' : '#c70404'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.infoButtonOutline, allDisabled && globalStyles.disabledButton]} disabled={allDisabled} onPress={onInfo}>
        <FontAwesomeIcon icon={faCircleInfo} size={24} color={allDisabled ? '#949799' : '#029af2'} />
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.fontAwesomeButton, globalStyles.goodButtonOutline, (allDisabled || !startEnabled) && globalStyles.disabledButton]} onPress={onStart} disabled={allDisabled || !startEnabled}>
        <FontAwesomeIcon icon={faPlay} size={24} color={allDisabled || !startEnabled ? '#949799' : '#03911f'} />
      </TouchableOpacity>
    </View>
  );
};

export default TopButtons;
