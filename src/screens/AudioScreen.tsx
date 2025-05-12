import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AudioScreen() {
  // TODO: List audio devotionals from Firebase Storage, play/download, track progress
  return (
    <View style={styles.container} accessibilityRole="main">
      <Text style={styles.title}>Audio Devotionals</Text>
      <Text>Coming soon: Listen to daily prayers and devotionals.</Text>
      <Button title="Refresh" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
});
