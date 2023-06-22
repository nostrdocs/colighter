import React, { useCallback } from 'react';
import { PartialKeyPair } from 'nostrfn';
import { getRelays } from '../utils/Relay';

const defaultSettings = {
  highlightColor: '#FFD700',
  nostrId: {
    privkey: '',
    pubkey: '',
  } as PartialKeyPair,
  relays: getRelays(),
};
type Settings = typeof defaultSettings;

export const SettingsContext = React.createContext<{
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function useSettings() {
  return React.useContext(SettingsContext);
}

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  const updateSettings = useCallback(
    async (newSettings: Settings) => {
      setSettings({ ...settings, ...newSettings });
      localStorage.setItem('settings', JSON.stringify(newSettings));
    },
    [settings]
  );

  React.useEffect(() => {
    const storedNostrKeys = localStorage.getItem('nostrKeys');
    console.log({ storedNostrKeys });
    if (storedNostrKeys) {
      const parsedKeys = JSON.parse(storedNostrKeys);
      setSettings({
        ...settings,
        nostrId: parsedKeys,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
