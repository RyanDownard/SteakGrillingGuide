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
import { theme } from './styles/theme';

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: theme.colors.background,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    fontFamily: theme.typography.heading,
    fontSize: 22,
    fontWeight: '700' as const,
  },
  headerTitleAlign: 'center' as const,
  tabBarActiveTintColor: theme.colors.accent,
  tabBarInactiveTintColor: theme.colors.textSoft,
  tabBarStyle: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
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
