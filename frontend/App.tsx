import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Home from './src/pages/Home';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import { useTokenStore } from './src/zustand/token-store';
import { Stack } from './src/navigator';

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
