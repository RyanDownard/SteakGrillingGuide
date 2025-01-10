import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './views/Home';
import SavedSteaks from './views/SavedSteaks';
import { faSave, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Tab = createBottomTabNavigator();

const homeIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faHome} size={size} color={color} />
);

const savedSteakIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={faSave} size={size} color={color} />
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
      <Tab.Screen 
        name="Steak Grilling Guide"
        component={Home}
        options={{
          tabBarIcon: homeIcon,
        }} />
      <Tab.Screen
        name="Saved Steaks"
        component={SavedSteaks}
        options={{
          tabBarIcon: savedSteakIcon,
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
