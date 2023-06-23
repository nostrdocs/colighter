import React, { useMemo } from 'react';
import { Settings } from '../utils/Storage';

export const SettingsContext = React.createContext<{
  settings: Settings;
}>({
  settings: new Settings(),
});

export function useSettings() {
  return React.useContext(SettingsContext);
}

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const settings = useMemo(() => new Settings(), []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
};
