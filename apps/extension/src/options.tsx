import './styles/style.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { CSSReset, ChakraProvider } from '@chakra-ui/react';

import { chakraTheme } from './theme';
import { Settings } from './screens/Settings';

const root = ReactDOM.createRoot(document.getElementById('options-root')!);
const ExtensionSettings = React.memo(Settings);
root.render(
  <ChakraProvider theme={chakraTheme}>
    <CSSReset />
    <ExtensionSettings />
  </ChakraProvider>
);
