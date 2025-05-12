import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function GuestScreen() {
  const navigation = useNavigation();

  const handleGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      // handle error
    }
  };

  return (
    <View style={styles.container} accessibilityRole="form">
      <Text style={styles.title}>Continue as Guest</Text>
      <Text style={styles.info}>You can explore the app, but premium features require an account.</Text>
      <Button title="Continue as Guest" onPress={handleGuest} />
      <Button title="Back to Sign In" onPress={() => navigation.navigate('Login' as never)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
});
