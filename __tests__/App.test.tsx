/**
 * @format
 */

import 'react-native';
import React from 'react';
import Timer from '../components/Timer';

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

it('does not render the timer in a SafeAreaView', () => {
  const component = renderer.create(<Timer />);

  expect(component.root.findAllByType(require('react-native').SafeAreaView)).toHaveLength(0);
});
