import React from 'react';
import { ThemeProvider } from 'styled-components';
import { HomePopUp } from './components';
import { theme } from './theme';

export const Extension = React.memo(function Extension() {
  return (
    <ThemeProvider theme={theme}>
      <HomePopUp />
    </ThemeProvider>
  );
});
