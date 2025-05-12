import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { saveJournalEntry } from '../utils/firestoreJournal';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PremiumModal from '../components/PremiumModal';

const prompts = [
  'What does this verse teach about God?',
  "Where have you seen the Lord’s hand today?",
  'What prayer can you offer in response?'
];

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPremium, setShowPremium] = useState(false);
  const { user } = useAuth();
  const { isPremium, trialActive } = useSubscription();

  const handleSave = async () => {
    if (!user) {
      setError('You must be signed in to save journal entries.');
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
      await saveJournalEntry(user, {
        text: entry,
        prompt: prompts[promptIndex],
        mood,
      });
      setSuccess('Entry saved!');
      setEntry('');
      setMood('');
    } catch (e: any) {
      setError('Failed to save entry.');
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
      <ScrollView contentContainerStyle={styles.container} accessibilityRole="main">
      <Text style={styles.title}>Journal</Text>
      <Text style={styles.prompt}>{prompts[promptIndex]}</Text>
      <TextInput
        style={styles.input}
        multiline
        value={entry}
        onChangeText={setEntry}
        placeholder="Write your thoughts..."
        accessibilityLabel="Journal Entry"
      />
      <Text style={styles.label}>Mood/Emotion Tag (optional):</Text>
      <TextInput
        style={styles.input}
        value={mood}
        onChangeText={setMood}
        placeholder="e.g. grateful, anxious, joyful"
        accessibilityLabel="Mood Tag"
      />
      <Button title="Next Prompt" onPress={() => setPromptIndex((i) => (i + 1) % prompts.length)} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Save Entry" onPress={handleSave} />
      )}
      {success ? <Text style={{ color: 'green', marginTop: 8 }}>{success}</Text> : null}
      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  prompt: { fontSize: 18, marginBottom: 8, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16, minHeight: 60 },
  label: { fontSize: 14, marginBottom: 4 },
});
