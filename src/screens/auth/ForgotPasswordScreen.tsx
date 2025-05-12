import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
      setError('');
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container} accessibilityRole="form">
      <Text style={styles.title}>Forgot Password</Text>
      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email"
      />
      <Button title="Send Reset Email" onPress={handleReset} />
      <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.link}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  error: { color: 'red', marginBottom: 16, textAlign: 'center' },
  success: { color: 'green', marginBottom: 16, textAlign: 'center' },
  link: { color: '#3366CC', marginTop: 12, textAlign: 'center' },
});
