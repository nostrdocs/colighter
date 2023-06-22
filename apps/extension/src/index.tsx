import './styles/style.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';

import { Popup } from './components';
import { chakraTheme } from './theme';
import { SettingsProvider } from './context/settingsContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const Extension = React.memo(Popup);
root.render(
  <ChakraProvider theme={chakraTheme}>
    <SettingsProvider>
      <Extension />
    </SettingsProvider>
  </ChakraProvider>
);
