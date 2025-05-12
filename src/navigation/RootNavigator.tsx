import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './stacks/AuthNavigator';
import MainTabNavigator from './tabs/MainTabNavigator';
import { useAuth } from '../hooks/useAuth';

const RootStack = createStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
