import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Share } from 'react-native';
import verses from '../../scripture/daily_verses.json';

export default function DailyVerseScreen() {
  const [verse, setVerse] = useState<any>(null);

  useEffect(() => {
    // Simple rotation by day of year
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setVerse(verses[dayOfYear % verses.length]);
  }, []);

  if (!verse) return null;

  const handleShare = async () => {
    await Share.share({
      message: `${verse.text} (${verse.reference} ${verse.version})\n${verse.reflection}`
    });
  };

  return (
    <View style={styles.container} accessibilityRole="main">
      <Text style={styles.reference}>{verse.reference} ({verse.version})</Text>
      <Text style={styles.verse}>{verse.text}</Text>
      <Text style={styles.reflection}>{verse.reflection}</Text>
      <View style={styles.actions}>
        <Button title="Share" onPress={handleShare} />
        {/* TODO: Favorite, translation switch */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  reference: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  verse: { fontSize: 24, fontFamily: 'serif', textAlign: 'center', marginBottom: 16 },
  reflection: { fontSize: 16, fontStyle: 'italic', color: '#555', marginBottom: 24, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12 },
});
