import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { addHabit, getHabits, checkHabit, Habit } from '../utils/firestoreHabits';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import PremiumModal from '../components/PremiumModal';

function todayDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function HabitsScreen() {
  const { user } = useAuth();
  const { isPremium, trialActive } = useSubscription();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPremium, setShowPremium] = useState(false);

  const fetchHabits = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getHabits(user);
      setHabits(data);
    } catch (e) {
      setError('Failed to load habits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddHabit = async () => {
    if (!user || !newHabit.trim()) return;
    if (!isPremium && !trialActive) {
      setShowPremium(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addHabit(user, { name: newHabit.trim() });
      setNewHabit('');
      setSuccess('Habit added!');
      fetchHabits();
    } catch (e) {
      setError('Failed to add habit.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckHabit = async (habitId: string) => {
    if (!user) return;
    if (!isPremium && !trialActive) {
      setShowPremium(true);
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await checkHabit(user, habitId, todayDate());
      setSuccess('Habit checked for today!');
    } catch (e) {
      setError('Failed to check habit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PremiumModal
        visible={showPremium}
        onClose={() => setShowPremium(false)}
        onSubscribe={() => {
          setShowPremium(false);
          // TODO: Integrate Stripe checkout flow
          alert('Subscription flow coming soon!');
        }}
      />
      <View style={styles.container} accessibilityRole="main">
      <Text style={styles.title}>Spiritual Habits</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new discipline (e.g. Prayer)"
        value={newHabit}
        onChangeText={setNewHabit}
        accessibilityLabel="New Habit"
      />
      <Button title="Add Custom Discipline" onPress={handleAddHabit} />
      {loading && <ActivityIndicator />}
      {success ? <Text style={{ color: 'green', marginTop: 8 }}>{success}</Text> : null}
      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
      <FlatList
        data={habits}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => (
          <View style={styles.habitRow}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Button title="Check Today" onPress={() => handleCheckHabit(item.id!)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 16 }}>No habits yet.</Text>}
        style={{ marginTop: 16, width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
});
