import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { requestNotificationPermission, scheduleDailyNotification, cancelAllNotifications } from '../utils/notifications';

export default function SettingsScreen() {
  const { dark, toggleTheme } = useTheme();
  const [notifHour, setNotifHour] = useState(8);
  const [notifMinute, setNotifMinute] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleToggleTheme = () => {
    toggleTheme();
    setFeedback(`Switched to ${dark ? 'light' : 'dark'} mode.`);
  };

  const handleEnableNotif = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      setFeedback('Notification permission denied.');
      return;
    }
    await scheduleDailyNotification(notifHour, notifMinute, 'Your daily encouragement from Abide Daily!');
    setNotifEnabled(true);
    setFeedback('Daily notification scheduled.');
  };

  const handleDisableNotif = async () => {
    await cancelAllNotifications();
    setNotifEnabled(false);
    setFeedback('Notifications cancelled.');
  };

  const handleManageSubscription = () => {
    // TODO: Integrate Stripe/in-app purchase management
    Alert.alert('Manage Subscription', 'Subscription management coming soon!');
  };

  return (
    <View style={styles.container} accessibilityRole="main">
      <Text style={styles.title}>Settings</Text>
      <Button title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} onPress={handleToggleTheme} />
      <Text style={{ marginTop: 16, marginBottom: 4 }}>Daily Notification Time (24h):</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Button title="-" onPress={() => setNotifHour(Math.max(0, notifHour - 1))} />
        <Text style={{ marginHorizontal: 8 }}>{notifHour.toString().padStart(2, '0')}</Text>
        <Button title="+" onPress={() => setNotifHour(Math.min(23, notifHour + 1))} />
        <Text>:</Text>
        <Button title="-" onPress={() => setNotifMinute(Math.max(0, notifMinute - 1))} />
        <Text style={{ marginHorizontal: 8 }}>{notifMinute.toString().padStart(2, '0')}</Text>
        <Button title="+" onPress={() => setNotifMinute(Math.min(59, notifMinute + 1))} />
      </View>
      <Button title={notifEnabled ? 'Disable Notifications' : 'Enable Daily Notification'} onPress={notifEnabled ? handleDisableNotif : handleEnableNotif} />
      <Button title="Manage Subscription" onPress={handleManageSubscription} style={{ marginTop: 16 }} />
      {feedback ? <Text style={{ color: '#3366CC', marginTop: 12 }}>{feedback}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
});
