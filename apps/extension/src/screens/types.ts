export const SettingsSelectionType = {
  GENERAL: 'GENERAL',
  ACCOUNT: 'ACCOUNT',
  NOTIFICATIONS: 'NOTIFICATIONS',
} as const;

export type SettingsSelection =
  (typeof SettingsSelectionType)[keyof typeof SettingsSelectionType];
