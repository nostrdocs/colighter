import './styles/style.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { ChakraProvider } from '@chakra-ui/react';

import { Popup } from './components';
import { chakraTheme } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const Extension = React.memo(Popup);
root.render(
  <ChakraProvider theme={chakraTheme}>
    <Extension />
  </ChakraProvider>
);
