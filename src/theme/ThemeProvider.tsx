import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const [dark, setDark] = useState(colorScheme === 'dark');

  const toggleTheme = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <NavigationThemeProvider value={dark ? DarkTheme : DefaultTheme}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};
