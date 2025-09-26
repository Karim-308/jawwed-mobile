// in src/constants/navigationThemes.js

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',         // matches Colors.light.background
    text: '#000',               // matches Colors.light.text
    card: '#f5f5f5',            // header background (like Colors.light.headerBackground)
    border: '#ccc',
    primary: '#DE9953',         // highlight color
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',      // matches Colors.dark.background
    text: '#fff',               // matches Colors.dark.text
    card: '#000',               // header background (like Colors.dark.headerBackground)
    border: '#444',
    primary: '#DE9953',         // highlight color
  },
};
