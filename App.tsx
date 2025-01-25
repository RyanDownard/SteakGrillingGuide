import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './views/Home';
import SavedSteaks from './views/SavedSteaks';
import { faSave, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SavedSteaksProvider } from './contexts/SavedSteaksContext';
import notifee from '@notifee/react-native';
import { TimerProvider } from './contexts/TimerContext';
import Timer from './components/Timer';

const Tab = createBottomTabNavigator();

const homeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faHome} size={size} color={color} />
);

const savedSteakIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faSave} size={size} color={color} />
);

const App = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === 'active') {
        notifee.setBadgeCount(0);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <TimerProvider>
      <SavedSteaksProvider>
        <NavigationContainer>
          <Timer/>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={Home}
              options={{
                headerTitle: 'Steak Grilling Guide',
                tabBarIcon: homeIcon,
              }} />
            <Tab.Screen
              name="Saved Steaks"
              component={SavedSteaks}
              options={{
                tabBarIcon: savedSteakIcon,
              }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SavedSteaksProvider>
    </TimerProvider>
  );
};

export default App;
