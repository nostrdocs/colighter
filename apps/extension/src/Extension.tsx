import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Popup } from './components';
import { theme } from './theme';

export const Extension = React.memo(function Extension() {
  return (
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  );
});
