import '@fontsource/inter/400.css';
import '@fontsource/oxygen-mono/400.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/600.css';

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
