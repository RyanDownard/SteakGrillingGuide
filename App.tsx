import React, { useEffect } from 'react';
import { AppState, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './views/Home';
import SavedSteaks from './views/SavedSteaks';
import { faSave, faHome, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import notifee from '@notifee/react-native';
import useSavedSteaksStore from './stores/SavedSteakStore';
import useSteakStore from './stores/SteakStore';
import EditTimes from './views/EditTimes';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#fdf8f4',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTintColor: '#2a1a0e',
  headerTitleStyle: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 22,
    fontWeight: '700' as const,
  },
  headerTitleAlign: 'center' as const,
  tabBarActiveTintColor: '#f46421',
  tabBarInactiveTintColor: '#a08070',
  tabBarStyle: {
    backgroundColor: '#fffdf9',
    borderTopColor: '#e8d8cc',
  },
};

const homeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faHome} size={size} color={color} />
);

const savedSteakIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faSave} size={size} color={color} />
);

const timerIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faClock} size={size} color={color} />
);

const App = () => {

  const { loadSavedSteaks } = useSavedSteaksStore();
  const { loadOverrides } = useSteakStore();

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
    loadOverrides();
  }, [loadSavedSteaks, loadOverrides]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={screenOptions}>
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
                headerTitle: 'Saved Steaks',
                tabBarIcon: savedSteakIcon,
              }} />
            <Tab.Screen
              name="Edit Times"
              component={EditTimes}
              options={{
                headerTitle: 'Edit Times',
                tabBarIcon: timerIcon,
              }} />
          </Tab.Navigator>
        </NavigationContainer>
        <Toast />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
