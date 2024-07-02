import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';

import Home from './src/pages/Home';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { useTokenStore } from './src/zustand/token-store';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
}

export function useAppNavigation() {
  return useNavigation<NavigationProp<RootStackParamList>>();
}

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { token } = useTokenStore();

  if (!token) return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return <Home />;
}

export default AppNavigator;
