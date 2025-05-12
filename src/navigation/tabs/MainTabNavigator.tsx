import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyVerseScreen from '../../screens/DailyVerseScreen';
import JournalScreen from '../../screens/JournalScreen';
import AudioScreen from '../../screens/AudioScreen';
import HabitsScreen from '../../screens/HabitsScreen';
import MoodScreen from '../../screens/MoodScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DailyVerse" component={DailyVerseScreen} options={{ title: 'Verse' }} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Mood" component={MoodScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
