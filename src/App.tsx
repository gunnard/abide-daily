import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initializeStripe } from './utils/stripe';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './theme/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './hooks/useAuth';
import { SubscriptionProvider } from './hooks/useSubscription';
import './config/firebase';

export default function App() {
  useEffect(() => {
    initializeStripe();
  }, []);
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
