/**
 * @format
 */

import 'react-native';
import React from 'react';
import Timer from '../components/Timer';
import SteakProgress from '../components/SteakProgress';
import { Steak } from '../data/SteakData';
import { theme } from '../styles/theme';

// Note: import explicitly to use the types shipped with jest.
import {it, expect} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  },
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));

jest.mock('react-native-progress', () => ({
  Bar: 'ProgressBar',
}));

it('does not render the timer in a SafeAreaView', () => {
  const component = renderer.create(<Timer />);

  expect(component.root.findAllByType(require('react-native').SafeAreaView)).toHaveLength(0);
});

it('renders progress connectors for the steak timeline', () => {
  const steak = new Steak(1, 'Test', 'Medium', 1.5);
  const component = renderer.create(<SteakProgress steak={steak} />);

  expect(component.root.findAllByType('ProgressBar')).toHaveLength(2);
});

it('exposes a shared app theme with palette and typography tokens', () => {
  expect(theme.colors.accent).toBe('#c07040');
  expect(theme.colors.text).toBe('#2a1a0e');
  expect(theme.typography.heading).toBe('CormorantGaramond-Bold');
});
