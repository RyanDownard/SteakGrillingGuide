import React, { useEffect } from 'react';
import { AppState, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './views/Home';
import SavedSteaks from './views/SavedSteaks';
import { faSave, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import notifee from '@notifee/react-native';
import Timer from './components/Timer';
import useSavedSteaksStore from './stores/SavedSteakStore';

const Tab = createBottomTabNavigator();

const homeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faHome} size={size} color={color} />
);

const savedSteakIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faSave} size={size} color={color} />
);

const App = () => {

  const { loadSavedSteaks } = useSavedSteaksStore();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === 'active') {
        notifee.setBadgeCount(0);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadSavedSteaks();
  }, [loadSavedSteaks]);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Timer />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
