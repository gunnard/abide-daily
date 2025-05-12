import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Slider, TextInput, ActivityIndicator } from 'react-native';
import { saveMoodEntry } from '../utils/firestoreMood';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PremiumModal from '../components/PremiumModal';

export default function MoodScreen() {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPremium, setShowPremium] = useState(false);
  const { user } = useAuth();
  const { isPremium, trialActive } = useSubscription();

  const handleSave = async () => {
    if (!user) {
      setError('You must be signed in to save mood entries.');
      return;
    }
    if (!isPremium && !trialActive) {
      setShowPremium(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await saveMoodEntry(user, {
        mood,
        note,
      });
      setSuccess('Mood saved!');
      setNote('');
    } catch (e: any) {
      setError('Failed to save mood.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    setShowPremium(false);
    // TODO: Integrate Stripe checkout flow
    alert('Subscription flow coming soon!');
  };


  return (
    <>
      <PremiumModal
        visible={showPremium}
        onClose={() => setShowPremium(false)}
        onSubscribe={handleSubscribe}
      />
      <View style={styles.container} accessibilityRole="main">
      <Text style={styles.title}>Mood & Reflection</Text>
      <Text style={styles.label}>How are you feeling today?</Text>
      {/* Replace with emoji or slider as desired */}
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={mood}
        onValueChange={setMood}
        style={{ width: 200, marginBottom: 16 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a note or prayer..."
        value={note}
        onChangeText={setNote}
        accessibilityLabel="Mood Note"
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Save Mood" onPress={handleSave} />
      )}
      {success ? <Text style={{ color: 'green', marginTop: 8 }}>{success}</Text> : null}
      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16, minWidth: 200 },
});
